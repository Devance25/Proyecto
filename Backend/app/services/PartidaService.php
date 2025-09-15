<?php

class PartidaService
{   
    private static ?PartidaService $instance = null; 

    private ?PartidaRepository $partidaRepo;


    //DOMAIN
    private ?Partida $partida;
    private ?Reglas $reglas;
    private ?Puntaje $puntaje;

    private function __construct()
    {
        $this->partidaRepo = PartidaRepository::getInstance();
        $this->partida = Partida::getInstance();
        $this->reglas = Reglas::getInstance();
        $this->puntaje = Puntaje::getInstance();
    }

    public static function getInstance(): ?PartidaService
    {
        if (self::$instance === null) 
        {
            self::$instance = new self();
        }
        return self::$instance;
    }



    //Crea partida y bolsas
    public function crearPartidaService(int $jugador1_id, int $jugador2_id): array
    {

        if ($jugador1_id <= 0 || $jugador2_id <= 0) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Id de jugador invalida.'
                ];
        }

        if ($jugador1_id === $jugador2_id) {
            throw new Exception("Los jugadores deben ser distintos");
        }

        $partida_id = $this->partidaRepo->crearPartidaRepo($jugador1_id, $jugador2_id);

        if ($partida_id === false) {
            return [
                'success' => false,
                'code' => 'error',
                'message' => 'No se pudo crear la partida.'
                ];
        }

        $nombreJugador1 = $this->partidaRepo->getNombreJugadorRepo($jugador1_id);
        $nombreJugador2 = $this->partidaRepo->getNombreJugadorRepo($jugador2_id);

        $bolsa1 = $this->partida->crearBolsa();
        $bolsa2 = $this->partida->crearBolsa();

        $bolsaJugador1 = $this->partidaRepo->crearBolsaRepo($partida_id, $jugador1_id, $bolsa1);
        $bolsaJugador2 = $this->partidaRepo->crearBolsaRepo($partida_id, $jugador2_id, $bolsa2);

        return [
            'success' => true,
            'message' => 'Partida creada exitosamente.',
            'partida' => [
                          'id' => $partida_id,
                          ],
            'jugadores' => [
                     [
                      'nombre' => $nombreJugador1,
                       'bolsa' => $bolsaJugador1
                       ],
                     [
                      'nombre' => $nombreJugador2,
                       'bolsa' => $bolsaJugador2
                      ]
                    ]   
        ];
    }


    
    //Coloca y descarta dinosaurios, tira dado. Actualiza turnos y rondas
    public function turnoService(int $jugador_id, string $recinto, string $tipoDino, string $tipoDinoDescarte, int $partida_id): array
    {
        //Valida datos engresados
        if (!$partida_id || $partida_id <= 0) {
            throw new Exception("ID de partida inválido");
        }

        if (!$jugador_id || $jugador_id <= 0)  {
            throw new Exception("Jugador inválido");
        }

        if ($recinto === '' || $tipoDino === '' || $tipoDinoDescarte === '') {
            return [
                'success' => false, 
                'code'    => 'invalid', 
                'message' => 'Recinto y tipo de dinosaurio son requeridos.'
                ];
        }

        if (!$this->partidaRepo->getPartidaRepo($partida_id)) {
            throw new Exception("La partida con ID $partida_id no existe.");
        }
        //=====================================================================================================================================

        //Trae del repositorio los datos que precisamos
        //=====================================================================================================================================
        $caraDadoActual = $this->partidaRepo->getCaraDadoActualRepo($partida_id);
        $colocacionesJugador = $this->partidaRepo->getColocacionesRepo($partida_id, $jugador_id);
        $porRecintoJugador = [];
        foreach($colocacionesJugador as $c)
        {
            $recinto = $c['recinto'];
            $tipoDino = $c['tipo_dino'];
            $porRecintoJugador1[$recinto][] = $tipoDino;
        }

        //Lista de variables que vamos a usar
        $restricciones = $this->reglas->restriccionDado($caraDadoActual, $porRecintoJugador);   
        $tiradorActual = $this->partidaRepo->getTiradorActualRepo($partida_id);
        $turnoActual = $this->partidaRepo->getTurnoActualRepo($partida_id);
        $rondaActual = $this->partidaRepo->getRondaActualRepo($partida_id);
        $jugador1_id = $this->partidaRepo->getJugador1IdRepo($partida_id);
        $jugador2_id = $this->partidaRepo->getJugador2IdRepo($partida_id);

        // Debug logging
        error_log("DEBUG - jugador_id recibido: $jugador_id");
        error_log("DEBUG - jugador1_id de BD: $jugador1_id");
        error_log("DEBUG - jugador2_id de BD: $jugador2_id");
        error_log("DEBUG - turnoActual: $turnoActual, rondaActual: $rondaActual");

        //Validaciones de turno y ronda
        //=====================================================================================================================================
        if ($turnoActual === 7 && $rondaActual === 2){
            $partidaFinalizada = $this->finalizarPartidaService($partida_id);
            return $partidaFinalizada;
        }

        if($turnoActual === 1 && $rondaActual === 1 && $jugador_id !== $jugador1_id){
            throw new Exception("el jugador que comienza la partida debe ser el jugador1.");
        }

        if($turnoActual === 1 && $rondaActual === 2 && $jugador_id !== $jugador2_id){
            throw new Exception("el jugador que comienza la partida debe ser el jugador2.");
        }

        // si el jugador coloca un dinosaurio en un rescito que restringe el dado, no lo permite
        if ($turnoActual > 1 && $jugador_id !== $tiradorActual) {
            if (in_array($recinto, $restricciones, true)) {
                throw new Exception("el jugador no puede colocar un dinosaurio en el $recinto (restringido por el dado).");
            }
        }
        //=====================================================================================================================================

        //=====================================================================================================================================
        $bolsa = $this->partidaRepo->getBolsa($partida_id, $jugador_id);

        //existe dinosaurio en bolsa?
        //Valida colocacion.
        if(!in_array($tipoDino, $bolsa, true)){
                throw new Exception("el jugador no tiene en su bolsa el dinosaurio $tipoDino para colocar en $recinto.");
        }
            
        //Coloca el dino.
        $colocacion = $this->partidaRepo->colocarDinosaurioRepo($jugador_id, $recinto, $tipoDino, $partida_id);

        //saca el dino colocado de la bolsa
        $this->partidaRepo->descartarDinoRepo($partida_id, $jugador_id, $tipoDino);

        // Obtener la bolsa actualizada después del primer descarte
        $bolsaActualizada = $this->partidaRepo->getBolsa($partida_id, $jugador_id);

        //existe dino_descarte en bolsa?
        if(!in_array($tipoDinoDescarte, $bolsaActualizada, true)){
            throw new Exception("el jugador no tiene en su bolsa el dinosaurio $tipoDinoDescarte para descartar.");
        }

        //Descarta el dino de la bolsa.
        $descarte = $this->partidaRepo->descartarDinoRepo($partida_id, $jugador_id, $tipoDinoDescarte);


        $turnoActual++;


        //Si el turno es del 1 al 5 Tira dado
        if($turnoActual < 6){

            $this->partidaRepo->sumarTurnoRepo($partida_id);

            $nombreTirador = $this->partidaRepo->getNombreJugadorRepo($jugador_id);

            $caraDadoActual = $this->partida->tirarDado();

            $this->partidaRepo->tirarDadoRepo($partida_id, $caraDadoActual, $jugador_id);


        }

        //Si esta corriendo el turno 6 y el jugador ya coloco, descarto (no tira dado porque es el turno 6) setea 'ronda = 2' y resetea los turnos ('turno = 6' => 'tunro = 1'). Actualiza variables $turnoActual y $rondaActual para mandarlo al front end.
        if ($turnoActual === 6 && $rondaActual === 1){
            
            $this->partidaRepo->sumarRondaRepo($partida_id);
            $this->partidaRepo->resetTurnosRepo($partida_id);
            $turnoActual = $this->partidaRepo->getTurnoActualRepo($partida_id);
            $rondaActual = $this->partidaRepo->getRondaActualRepo($partida_id);
            
            // En turno 6 no hay dado, pero necesitamos los datos para el frontend
            $nombreTirador = $this->partidaRepo->getNombreJugadorRepo($jugador_id);
            $caraDadoActual = null; // No se tira dado en turno 6
        }

        $puntajes = $this->calcularPuntajesService($partida_id);

        $colocacion['turno'] = $turnoActual;
        $colocacion['ronda'] = $rondaActual;
        $colocacion['dinoDescartado'] = $descarte['dino_descartado'];
        $colocacion['nombreTirador'] = $nombreTirador;
        $colocacion['caraDado'] = $caraDadoActual;
        $colocacion['puntajes'] = $puntajes;
        
        return $colocacion;
    }





    //Finaliza la partida
    public function finalizarPartidaService(int $partida_id): array
    {
        if ($partida_id <= 0) {
            return [
                'success' => false,
                'code' => 'invalid',
                'message' => 'ID de partida inválido.'
            ];
        }

        $jugador1_id = $this->partidaRepo->getJugador1IdRepo($partida_id);
        $jugador2_id = $this->partidaRepo->getJugador2IdRepo($partida_id);

        $this->partidaRepo->sumarPartidaJugadaRepo($jugador1_id);
        $this->partidaRepo->sumarPartidaJugadaRepo($jugador2_id);

        $puntajesRaw = $this->calcularPuntajesService($partida_id);

        $jugadores = $puntajesRaw['jugadores'];

        $puntaje1 = $jugadores[0]['puntaje'];
        $puntaje2 = $jugadores[1]['puntaje'];

        $ganador_id = null;
        
        $empate = false;

        if ($puntaje1 > $puntaje2) {
            $ganador_id = $jugador1_id;
            $this->partidaRepo->sumarPartidaGanadaRepo($jugador1_id);
        } elseif ($puntaje2 > $puntaje1) {
            $ganador_id = $jugador2_id;
            $this->partidaRepo->sumarPartidaGanadaRepo($jugador2_id);
        } else {
            $empate = true;
        }

        $this->partidaRepo->finalizarPartidaRepo($partida_id, $puntaje1, $puntaje2, $ganador_id);

        return [
            'success'      => true,
            'message'      => 'Partida finalizada exitosamente.',
            'partida_id'   => $partida_id,
            'ganador_id'   => $ganador_id,
            'empate'       => $empate,
            'puntajes'     => [
                'jugador1' => $puntaje1,
                'jugador2' => $puntaje2
            ],
            'detalle'      => $puntajesRaw
        ];
    }






    //Calcula puntaje de ambos jugadores
    public function calcularPuntajesService(int $partida_id): array
    {   

        $jugador1_id = $this->partidaRepo->getJugador1IdRepo($partida_id);
        $jugador2_id = $this->partidaRepo->getJugador2IdRepo($partida_id);


        //resuar locacl storage
        $nombreJugador1 = $this->partidaRepo->getNombreJugadorRepo($jugador1_id);
        $nombreJugador2 = $this->partidaRepo->getNombreJugadorRepo($jugador2_id);

        $colocacionesJugador1 = $this->partidaRepo->getColocacionesRepo($partida_id, $jugador1_id);

        $colocacionesJugador2 = $this->partidaRepo->getColocacionesRepo($partida_id, $jugador2_id);


        $porRecintoJugador1 = [];
        foreach($colocacionesJugador1 as $c)
        {
            $recinto = $c['recinto'];
            $tipoDino = $c['tipo_dino'];
            $porRecintoJugador1[$recinto][] = $tipoDino;
        }

        $porRecintoJugador2 = [];
        foreach($colocacionesJugador2 as $c)
        {
            $recinto = $c['recinto'];
            $tipoDino = $c['tipo_dino'];
            $porRecintoJugador2[$recinto][] = $tipoDino;
        }


        $puntajeJugador1 = $this->puntaje->calcularPuntaje($porRecintoJugador1, $porRecintoJugador2);
        $puntajeJugador2 = $this->puntaje->calcularPuntaje($porRecintoJugador2, $porRecintoJugador1);

        return [
            'partida_id' => $partida_id,
             'jugadores' => [
                [   
                         'id' => $jugador1_id,
                     'nombre' => $nombreJugador1,
                    'puntaje' => $puntajeJugador1
                ],
                [
                         'id' => $jugador2_id,
                     'nombre' => $nombreJugador2,
                    'puntaje' => $puntajeJugador2
                ]
            ]
        ];


    }

}