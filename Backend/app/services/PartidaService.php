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

// ============================================================================
// Modo de juego digital completo
// ============================================================================

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




// ============================================================================
// Modo Seguimiento de partida
// ============================================================================


    public function crearPartidaSeguimientoService(CrearPartidaSeguimientoDTO $dto): CrearPartidaSeguimientoDTO
    {   
        // Valida que que las IDs de los jugadores existan
        if ($dto->jugador1_id <= 0 || $dto->jugador2_id <= 0) {
            $dto->fillResponse(
                false,
                "ID de jugador 1 y 2 son requeridos.",
                null,
                $dto->jugador1_id,
                $dto->jugador2_id,
                400
            );

            return $dto;
        }

        // Valida que las IDs no sean iguales
        if ($dto->jugador1_id === $dto->jugador2_id) {
            $dto->fillResponse(
                false,
                "Los jugadores deben ser distintos.",
                null,
                $dto->jugador1_id,
                $dto->jugador2_id,
                400
            );

            return $dto;
        }

        try {
            $partidaId = $this->partidaRepo->crearPartidaRepo(
                $dto->jugador1_id, 
                $dto->jugador2_id
            );
    
            if ($partidaId === 0) {
                // Caso duplicado
                $dto->fillResponse(
                    false,
                    "Partida duplicada.",
                    null,
                    $dto->jugador1_id,
                    $dto->jugador2_id,
                    409
                );

                return $dto;
            }
    
            // Caso éxito
            $dto->fillResponse(
                true,
                "Partida creada exitosamente.", 
                $partidaId,
                $dto->jugador1_id,
                $dto->jugador2_id,
                201
            );
            
            return $dto;
    
        } catch (Exception $e) {
            // Si es un error de la base distinto a duplicado
            $dto->fillResponse(
                false, 
                "Error interno del servidor.", 
                null,
                $dto->jugador1_id,
                $dto->jugador2_id,
                500
            );
            
            return $dto;
        }
    }



    public function crearBolsaSeguimientoService(CrearBolsaSeguimientoDTO $dto): CrearBolsaSeguimientoDTO
    {   
        $tiposValidos = ["t-rex",
                         "triceratops", 
                         "diplodocus", 
                         "stegosaurus", 
                         "parasaurolophus", 
                         "pterodáctilo"
                        ];

        //  Valida que se hayan igresado la cantidad correcta de dinos
        if (count($dto->dinos) !== 6) {
            $dto->fillResponse(
                false,
                "La bolsa debe contener exactamente 6 dinosaurios.",
                $dto->dinos,
                $dto->jugador_id,
                400
            );
            return $dto;
        }

        // Validar tipos de dinosaurios
        foreach ($dto->dinos as $dino) {
            if (!in_array(strtolower($dino), $tiposValidos, true)) {
                $dto->fillResponse(
                    false,
                    "Tipo de dinosaurio inválido: $dino.",
                    $dto->dinos,
                    $dto->jugador_id,
                    400
                );
                return $dto;
            }
        }

        try {
            $this->partidaRepo->crearBolsaRepo(
                $dto->partida_id,
                $dto->jugador_id,
                $dto->dinos
                );
    
            // Caso éxito
            $dto->fillResponse(
                true,
                "Bolsa creada correctamente.",
                $dto->dinos,
                $dto->jugador_id,
                201
            );

            return $dto;
    
        } catch (Exception $e) {
            // Si es un error de la base distinto a duplicado
            $dto->fillResponse(
                false, 
                "Error interno del servidor.", 
                null, 
                500
            );

            return $dto;
        }
        
    }



    public function turnoSeguimientoService(TurnoSeguimientoDTO $dto): TurnoSeguimientoDTO
    {
        //  Valida que se haya ingresado el ID de la partida
        if (!$dto->partida_id || 
             $dto->partida_id <= 0
            ) {
                $dto->fillResponse(
                    false,
                    'ID de partida inválido.',
                    null,   // turno
                    null,   // ronda
                    null,   // puntaje_jugador1
                    null,   // puntaje_jugador2
                    404
                );
                return $dto;
        }

        //  Valida que se haya ingresado el ID del jugador
        if (!$dto->jugador_id ||
             $dto->jugador_id <= 0
            ){
                $dto->fillResponse(
                    false,
                    'Jugador inválido.',
                    null,   // turno
                    null,   // ronda
                    null,   // puntaje_jugador1
                    null,   // puntaje_jugador2
                    404
                );
                return $dto;
        }

        //  Valida que existan los datos requeridos
        if ($dto->recinto === '' ||
            $dto->tipoDino === '' || 
            $dto->tipoDinoDescarte === '' || 
            $dto->caraDado === ''
            ) {
                $dto->fillResponse(
                    false,
                    'Recinto, tipos de dinosaurios y resltado del dado son requeridos.',
                    null,   // turno
                    null,   // ronda
                    null,   // puntaje_jugador1
                    null,   // puntaje_jugador2
                    400
                );
                return $dto;
        }

        //  Valida que la partida exista
        if (!$this->partidaRepo->getPartidaRepo($dto->partida_id)) {

            $dto->fillResponse(
                false,
                "La partida con ID $dto->partida_id no existe.",
                null,   // turno
                null,   // ronda
                null,   // puntaje_jugador1
                null,   // puntaje_jugador2
                404
            );
            return $dto;
        }

        //  Tremos de la base datos para hacer comparaciones y asi asegurar que la logica del juego se cumpla
        $tiradorActual = $this->partidaRepo->getTiradorActualRepo($dto->partida_id);
        $turnoActual = $this->partidaRepo->getTurnoActualRepo($$dto->partida_id);
        $rondaActual = $this->partidaRepo->getRondaActualRepo($$dto->partida_id);
        $jugador1_id = $this->partidaRepo->getJugador1IdRepo($dto->partida_id);
        $jugador2_id = $this->partidaRepo->getJugador2IdRepo($dto->partida_id);
        $nombreTirador = $this->partidaRepo->getNombreJugadorRepo($dto->jugador_id);
        $caraDadoActual = null;

        //  Si el turno no es el primero, treamos del repo el resultado del dado actual, es decir, lo que tiro el jugador anterior
        if($turnoActual > 1){
            $caraDadoActual = $this->partidaRepo->getCaraDadoActualRepo($dto->partida_id);
        }
        

        //  Traemos las colocaciones anteriores del jugador
        $colocacionesJugador = $this->partidaRepo->getColocacionesRepo(
            $dto->partida_id, 
            $dto->jugador_id
        );

        // Convierte los arrays indexados de arrays asociativos a arrays asociativos de arrays indexados.
        $porRecintoJugador = $this->partida->agruparPorRecinto($colocacionesJugador);

        //  Utilizamos el resultado del dado y las colocaciones del jugador para aplicar restricciones
        $restricciones = $this->reglas->restriccionDado(
            $caraDadoActual, 
            $porRecintoJugador
        );     
        

        // Debug logging
        error_log("DEBUG - jugador_id recibido: $jugador_id");
        error_log("DEBUG - jugador1_id de BD: $jugador1_id");
        error_log("DEBUG - jugador2_id de BD: $jugador2_id");
        error_log("DEBUG - turnoActual: $turnoActual, rondaActual: $rondaActual");

        //  Valida que desde el frontend se continue la partida luego de tremrinada por erro, si es asi, la finaliza.
        if ($turnoActual === 7 && 
            $rondaActual === 2
            ){
            
            //  Crea un DTO de finalizarPartida y le pasa como parametro el dto de TurnoSeguimiento convertido en array.
            $finalizarDTO = new FinalizarPartidaDTO($dto->toArray());
            
            //  Llamar al servicio (ya hace fillResponse internamente)
            $response = $this->finalizarPartidaService($finalizarDTO);
            
            //  Devolver la respuesta
            return $response;
        }

        //  Valida que el jugador 1 sea siempre quien comienza la partida.
        if($turnoActual === 1 && 
           $rondaActual === 1 && 
           $dto->jugador_id !== $jugador1_id
           ){
            $dto->fillResponse(
                false,
                "El jugador que comienza la partida debe ser el jugador 1.",
                $turnoActual,   // turno
                $rondaActual,   // ronda
                $puntajeJugador1,   // puntaje_jugador1
                $puntajeJugador2,   // puntaje_jugador2
                404
            );
        }

        //  Valida que el jugador 2 sea siempre quien comienza la segunda ronda.
        if($turnoActual === 1 && 
           $rondaActual === 2 && 
           $dto->jugador_id !== $jugador2_id
           ){
            $dto->fillResponse(
                false,
                "El jugador que comienza la ronda 2 debe ser el jugador 2.",
                $turnoActual,   // turno
                $rondaActual,   // ronda
                $puntajeJugador1,   // puntaje_jugador1
                $puntajeJugador2,   // puntaje_jugador2
                404
            );
        }

        //  Si el jugador coloca un dinosaurio en un rescito que restringe el dado, no lo permite.
        if ($turnoActual > 1 && $dto->jugador_id !== $tiradorActual) {
            if (in_array(
                $dto->recinto, 
                $restricciones, 
                true
                )) {
                    $dto->fillResponse(
                        false,
                        "El jugador no puede colocar un dinosaurio en el $dto->recinto (restringido por el dado).",
                        $turnoActual,   // turno
                        $rondaActual,   // ronda
                        $puntajeJugador1,   // puntaje_jugador1
                        $puntajeJugador2,   // puntaje_jugador2
                        404
                    );
            }
        }

        //  Trae de la base de datos los dinosaurios con los que cuenta el jugador.
        $bolsa = $this->partidaRepo->getBolsa(
            $dto->partida_id, 
            $dto->jugador_id
        );

        //  Valida que realmente el jugador cuente con el dinosaurio que desea colocar en su bolsa.
        if(!in_array(
            $dto->tipoDino, 
            $bolsa, 
            true
            )){
                $dto->fillResponse(
                    false,
                    "El jugador no tiene en su bolsa el dinosaurio $tipoDino para colocar en $recinto.",
                    $turnoActual,   // turno
                    $rondaActual,   // ronda
                    $puntajeJugador1,   // puntaje_jugador1
                    $puntajeJugador2,   // puntaje_jugador2
                    404
                );
        }
            
        //  Realiza la colocación de dinosaurio.
        $colocacion = $this->partidaRepo->colocarDinosaurioRepo(
            $dto->jugador_id, 
            $dto->recinto, 
            $dto->tipoDino, 
            $dto->partida_id
        );

        //  colocarDinoRepo devulve:
        //     'success'    => true,
        //     'partida'    => $partida_id,
        //     'jugador_id' => $jugador_id,
        //     'recinto'    => $recinto,
        //     'tipo_dino'  => $tipo_dino,

        //  Quita el dinosaurios colocado de la bolsa del jugador.
        $this->partidaRepo->descartarDinoRepo(
            $dto->partida_id, 
            $dto->jugador_id, 
            $dto->tipoDino
        );

        // Obtener la bolsa actualizada después del primer descarte.
        $bolsaActualizada = $this->partidaRepo->getBolsa(
            $dto->partida_id, 
            $dto->jugador_id
        );

        //  Valida que realmente el jugador cuente con el dinosaurio que desea descartar en su bolsa.
        if(!in_array(
            $dto->tipoDinoDescarte, 
            $bolsaActualizada, 
            true
            )){
                $dto->fillResponse(
                    false,
                    "El jugador no tiene en su bolsa el dinosaurio $dto->tipoDinoDescarte para descartar.",
                    $turnoActual,   // turno
                    $rondaActual,   // ronda
                    $puntajeJugador1,   // puntaje_jugador1
                    $puntajeJugador2,   // puntaje_jugador2
                    404
                );
        }

        //  Quita el dinosaurios descartado de la bolsa del jugador.
        $descarte = $this->partidaRepo->descartarDinoRepo(
            $dto->partida_id, 
            $dto->jugador_id, 
            $dto->tipoDinoDescarte
        );

        // Suma un turno
        $turnoActual++;


        //  Si el turno es del 1 al 5.
        if($turnoActual < 6){

            //  Suma un turno.
            $this->partidaRepo->sumarTurnoRepo($dto->partida_id);     

            //  Guarda en la base el resultado del dado que vino desde el frontend.
            $this->partidaRepo->tirarDadoRepo($dto->partida_id, $dto->caraDado, $dto->jugador_id);


        }

        //  Si esta corriendo el turno 6 (no tira dado).
        if ($turnoActual === 6 && $rondaActual === 1){
            
            //  Setea 'ronda = 2'.
            $rondaActual = $this->partidaRepo->sumarRondaRepo($dto->partida_id);

            // Resetea los turnos ('turno = 6' => 'tunro = 1').
            $turnoActual = $this->partidaRepo->resetTurnosRepo($dto->partida_id);

            // No se tira dado en turno 6.
            $caraDadoActual = null;
        }

        //  Crea una dto de calcular puntajes.
        $calcularPuntajesDTO = new CalcularPuntajesDTO($dto->partida_id);
    
        //  Calcula los puntajes de los jugadores.
        $puntajes = $this->calcularPuntajesService($calcularPuntajesDTO);
    
        //  Separa los puntajes de cada jugador.
        $puntajeJugador1 = $puntajes->puntajeJugador1;
        $puntajeJugador2 = $puntajes->puntajeJugador2;

        //  Retorna turno procesado exitosamente.
        $dto->fillResponse(
            true,
            "Jugada procesada exitosamente.",
            $turnoActual,   // turno
            $rondaActual,   // ronda
            $puntajeJugador1,   // puntaje_jugador1
            $puntajeJugador2,   // puntaje_jugador2
            201
        );
    }


// ============================================================================
// Funciones transversales a ambos modos.
// ============================================================================

    //  Service para calcular los puntajes de ambos jugadores.
    public function calcularPuntajesService(CalcularPuntajesDTO $dto): CalcularPuntajesDTO
    {   

        // Trae los IDs de los jugadores.
        $jugador1_id = $this->partidaRepo->getJugador1IdRepo($dto->partida_id);
        $jugador2_id = $this->partidaRepo->getJugador2IdRepo($dto->partida_id);


        // Utilizado los IDs de los jugadores trae sus colocaicones(devuelve un array indexado de arrays asociativos).
        $colocacionesJugador1 = $this->partidaRepo->getColocacionesRepo(
            $dto->partida_id,
            $jugador1_id
        );
        $colocacionesJugador2 = $this->partidaRepo->getColocacionesRepo(
            $dto->partida_id, 
            $jugador2_id
        );

        // Convierte los arrays indexados de arrays asociativos a arrays asociativos de arrays indexados.
        $porRecintoJugador1 = $this->partida->agruparPorRecinto($colocacionesJugador1);
        $porRecintoJugador2 = $this->partida->agruparPorRecinto($colocacionesJugador2);
        
        //  Calcula los puntajes de los jugadores.
        $puntajeJugador1 = $this->puntaje->calcularPuntaje(
            $porRecintoJugador1, 
            $porRecintoJugador2
        );
        $puntajeJugador2 = $this->puntaje->calcularPuntaje(
            $porRecintoJugador2, 
            $porRecintoJugador1
        );

        //  Completa el DTO de calcular puntajes con los puntajes de los jugadores.
        $dto->fillResponse($puntajeJugador1, $puntajeJugador2);

        
        //  Retorna los puntajes de los jugadores.
        return $dto;
    }
    

    //  Service para finalizar la partida.
    public function finalizarPartidaService(FinalizarPartidaDTO $dto): FinalizarPartidaDTO
    {
        //  Valida que se haya ingresado el ID de la partida.
        if (!$dto->partida_id || $dto->partida_id <= 0) {
            $dto->fillResponse(
                false,
                'ID de partida inválido.',
                null,   // ganador_id
                null,   // empate
                null,   // puntaje_jugador1
                null,   // puntaje_jugador2
                404
            );
            return $dto;
        }
    
        //  Valida que la partida exista.
        if (!$this->partidaRepo->getPartidaRepo($dto->partida_id)) {
            $dto->fillResponse(
                false,
                "La partida con ID {$dto->partida_id} no existe.",
                null,
                null,
                null,
                null,
                404
            );
            return $dto;
        }

        //  Valida que la partida este activa.
        if ($this->partidaRepo->getEstadoPartidaRepo($dto->partida_id) === "finalizada") {
            $dto->fillResponse(
                false,
                "La partida con ID {$dto->partida_id} ya ha sido finalizada.",
                null,
                null,
                null,
                null,
                404
            );
            return $dto;
        }
    
        //  Trae los IDs de los jugadores.
        $jugador1_id = $this->partidaRepo->getJugador1IdRepo($dto->partida_id);
        $jugador2_id = $this->partidaRepo->getJugador2IdRepo($dto->partida_id);
    
        //  Suma una partida jugada a cada jugador.
        $this->partidaRepo->sumarPartidaJugadaRepo($jugador1_id);
        $this->partidaRepo->sumarPartidaJugadaRepo($jugador2_id);
    
        //  Crea una dto de calcular puntajes.
        $calcularPuntajesDTO = new CalcularPuntajesDTO($dto->partida_id);
    
        //  Calcula los puntajes de los jugadores.
        $puntajes = $this->calcularPuntajesService($calcularPuntajesDTO);
    
        //  Separa los puntajes de cada jugador.
        $puntajeJugador1 = $puntajes->puntajeJugador1;
        $puntajeJugador2 = $puntajes->puntajeJugador2;
    
        //  Evalua los puntajes y determina el ganador de la partida.
        $ganador_id = $this->partida->determinarGanador(
            $jugador1_id, 
            $jugador2_id,
            $puntajeJugador1,
            $puntajeJugador2
        );
    
        //  Si el metodo "determinarGanador" devuelve "null", la variable "empate" se setea con valor "true" y si el metodo devuelve un ID, se setea con valor "false".
        $empate = ($ganador_id === null);
    
        //  Si no hubo empate se le agrega al jugador ganador una partida ganada.
        if (!$empate) {
            $this->partidaRepo->sumarPartidaGanadaRepo($ganador_id);
        }
    
        //  Completa los datos de la partida en la base de datos finalizando la misma.
        $this->partidaRepo->finalizarPartidaRepo(
            $dto->partida_id, 
            $puntajeJugador1, 
            $puntajeJugador2, 
            $ganador_id
        );
    
        //  Retorna los datos relevantes.
        $dto->fillResponse(
            true,
            'Partida finalizada exitosamente.',
            $ganador_id,
            $empate,
            $puntajeJugador1,
            $puntajeJugador2,
            200
        );
        
        //  Retorna el objeto con todos los datos
        return $dto;
    }

}