<?php

class PartidaService
{   
    private static ?PartidaService $instance = null; 

    private ?PartidaRepository $partidaRepo;

    //DOMAIN
    private Partida $partida;
    private Reglas $reglas;
    private Puntaje $puntaje;

    private function __construct()
    {
        $this->partidaRepo = PartidaRepository::getInstance();
        $this->partida = new Partida();
        $this->reglas = new Reglas();
        $this->puntaje = new Puntaje();
    }

    public static function getInstance(): ?PartidaService
    {
        if (self::$instance === null) 
        {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function crearPartidaService(int $jugador1_id, string $jugador2_nombre): array
    {
        $jugador2_nombre = trim($jugador2_nombre);

        // Validación de presencia
        if ($jugador1_id <= 0 || $jugador2_nombre === '') {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'El nombre del jugador 1 debe tener al menos 3 caracteres.'
                ];
        }

        if (strlen($jugador2_nombre) < 3) {
            return [
                'success' => false,
                'code' => 'invalid',
                'message' => 'El nombre del jugador 2 debe tener al menos 3 caracteres.'];
        }

        $created = $this->partidaRepo->crearPartidaRepo($jugador1_id, $jugador2_nombre);
        if ($created === false) {
            // Podría fallar por restricciones únicas u otros motivos
            return [
                'success' => false,
                'code' => 'error',
                'message' => 'No se pudo crear la partida.'
                ];
        }

        return [
            'success' => true,
            'message' => 'Partida creada exitosamente.',
            'partida' => [
                'id' => $created,
                 ],
        ];
    }

    public function crearBolsasService(int $partida_id, string $jugador1, string $jugador2): array
    {

        if ($partida_id <= 0) {
            throw new Exception("ID de partida inválido");
        }

        if (!$this->partidaRepo->partidaExisteRepo($partida_id)) {
            throw new Exception("La partida con ID $partida_id no existe.");
        }

        if (empty(trim($jugador1)) || empty(trim($jugador2))) {
            throw new Exception("Los nombres de los jugadores no pueden estar vacíos");
        }

        if ($jugador1 === $jugador2) {
            throw new Exception("Los jugadores deben ser distintos");
        }

        $bolsa1 = $this->partida->crearBolsa();
        $bolsa2 = $this->partida->crearBolsa();

        $bolsaJugador1 = $this->partidaRepo->crearBolsaRepo($partida_id, $jugador1, $bolsa1);
        $bolsaJugador2 = $this->partidaRepo->crearBolsaRepo($partida_id, $jugador2, $bolsa2);



        return [
            'success' => true,
            'partida_id' => $partida_id,
            'bolsaJugador1' => $bolsaJugador1,
            'bolsaJugador2' => $bolsaJugador2
        ];
    }

    public function tirarDadoService(int $id, string $jugador): array
    {
        $tirador = trim($jugador);

        if (!in_array($tirador, ['jugador1', 'jugador2'])) {
        return [
            'success' => false,
            'code' => 'invalid',
            'message' => 'Tirador no válido.'
        ];
    }


        $caraDadoActual = $this->partida->tirarDado($tirador);
        $this->partidaRepo->tirarDadoRepo($id, $caraDadoActual, $tirador);

        return [
            'success' => true,
            'partida_id' => $id,
            'cara_dado' => $caraDadoActual,
            'tirador' => $tirador,
        ];
    }

    public function colocarDinosaurioService(string $jugador, string $recinto, string $tipoDino, int $partida_id): array
    {

        if ($partida_id <= 0) {
            throw new Exception("ID de partida inválido");
        }

        if (!$this->partidaRepo->partidaExisteRepo($partida_id)) {
            throw new Exception("La partida con ID $partida_id no existe.");
        }

        if (empty(trim($jugador))) {
            throw new Exception("Jugador requerido.");
        }


        $caraDadoActual = $this->partidaRepo->getCaraDadoActualRepo($partida_id);
        $tiradorActual = $this->partidaRepo->getTiradorActualRepo($partida_id);
        $turnoActual = $this->partidaRepo->getTurnoActualRepo($partida_id);
        $rondaActual = $this->partidaRepo->getRondaActualRepo($partida_id);

        if ($jugador !== $tiradorActual && $recinto === $caraDadoActual)
        {
            throw new Exception ('el jugador no puede colocar un dinosaurio en ese recinto');
        }

        //3 turnos por ronda. Un turno, ambos jugadores colocan
        if ($jugador !== $tiradorActual) 
        {
            $this->partidaRepo->sumarTurnoRepo($partida_id);
            $turnoActual = $this->partidaRepo->getTurnoActualRepo($partida_id);
        }

        //cuando el segundo jugador coloca si dino en la 
        if ($turnoActual > 3){
            
            $this->partidaRepo->sumarRondaRepo($partida_id);
            $this->partidaRepo->resetTurnosRepo($partida_id);
            $turnoActual = $this->partidaRepo->getTurnoActualRepo($partida_id);
            $rondaActual = $this->partidaRepo->getRondaActualRepo($partida_id);
        }

   
        $colocacion = $this->partidaRepo->colocarDinosaurioRepo($jugador, $recinto, $tipoDino, $partida_id);

        $extraccion = $this->partidaRepo->descartarDinoRepo($partida_id, $jugador, $tipoDino);

        $colocacion['turno'] = $turnoActual;
        $colocacion['ronda'] = $rondaActual;
        $colocacion ['extraccion_bolsa'] = $extraccion;


        return $colocacion;

    }


    public function descartarDinoService(int $partida_id, string $jugador, string $dino): array
    {

        if ($partida_id <= 0) {
            throw new Exception("ID de partida inválido");
        }

        if (!$this->partidaRepo->partidaExisteRepo($partida_id)) {
            throw new Exception("La partida con ID $partida_id no existe.");
        }

        if (empty(trim($jugador))) {
            throw new Exception("Jugador requerido.");
        }

        if (!in_array($jugador, ['jugador1', 'jugador2'])) {
            return [
                'success' => false,
                'code' => 'invalid',
                'message' => 'Jugador no válido.'
            ];
        }   

        $descarte = $this->partidaRepo->descartarDinoRepo($partida_id, $jugador, $dino);

        return $descarte;
    }    


    public function finalizarPartidaService(int $id, int $puntaje_jugador1, int $puntaje_jugador2) : array
    {
        if($id <= 0){
            return [
                'success' => false,
                'code' => 'invalid',
                'message' => 'ID de partida inválido.'
            ];
        }

        try {
            $this->partidaRepo->finalizarPartidaRepo($id, $puntaje_jugador1, $puntaje_jugador2);
            
            return [
                'success' => true,
                'message' => 'Partida finalizada exitosamente.',
                'partida' => [
                    'id' => $id,
                    'puntaje_jugador1' => $puntaje_jugador1,
                    'puntaje_jugador2' => $puntaje_jugador2,
                ],
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'code' => 'error',
                'message' => 'No se pudo finalizar la partida: ' . $e->getMessage()
            ];
        }
    }


    public function cancelarPartidaService(int $id) : array
    {
        if($id <= 0){
            return [
                'success' => false,
                'code' => 'invalid',
                'message' => 'ID de partida inválido.'
            ];
        }

        try {
            $this->partidaRepo->cancelarPartidaRepo($id);
            
            return [
                'success' => true,
                'message' => 'Partida cancelada exitosamente.',
                'partida' => [
                    'id' => $id,
                ],
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'code' => 'error',
                'message' => 'No se pudo cancelar la partida: ' . $e->getMessage()
            ];
        }
    }



}