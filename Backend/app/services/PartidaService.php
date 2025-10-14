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
    public function crearPartidaService(CrearPartidaDTO $dto): CrearPartidaDTO
    {

        // Valida que que las IDs de los jugadores existan
        if ($dto->jugador1_id <= 0 || 
            $dto->jugador2_id <= 0
            ) {
                $dto->fillResponse(
                    false,                                  //  success
                    "ID de jugador 1 y 2 son requeridos.",  //  message
                    null,                                   //  partida_id
                    null,                                   //  bolsaJugador1
                    null,                                   //  bolsaJugador2
                    400                                     //  httpCode
                );
            return $dto;
        }

         // Valida que las IDs no sean iguales
         if ($dto->jugador1_id === 
             $dto->jugador2_id
             ) {
                $dto->fillResponse(
                    false,                                  //  success
                    "Los jugadores deben ser distintos.",   //  message
                    null,                                   //  partida_id
                    null,                                   //  bolsaJugador1
                    null,                                   //  bolsaJugador2
                    400                                     //  httpCode
             );
            return $dto;
        }

        try {
            $partida_id = $this->partidaRepo->crearPartidaRepo(
                $dto->jugador1_id, 
                $dto->jugador2_id
            );

            if ($partida_id === 0) {
                // Caso duplicado
                $dto->fillResponse(
                    false,                                  //  success
                    "Partida duplicada.",                   //  message
                    null,                                   //  partida_id
                    null,                                   //  bolsaJugador1
                    null,                                   //  bolsaJugador2
                    409                                     //  httpCode
                );
                return $dto;
            }

            $bolsa1 = $this->partida->crearBolsa();
            $bolsa2 = $this->partida->crearBolsa();

            $bolsaJugador1 = $this->partidaRepo->crearBolsaRepo(
                $partida_id,
                $dto->jugador1_id, 
                $bolsa1
            );
            $bolsaJugador2 = $this->partidaRepo->crearBolsaRepo(
                $partida_id, 
                $dto->jugador2_id, 
                $bolsa2
            );

            // Caso éxito
            $dto->fillResponse(
                true,                                       //  success
                "Partida creada exitosamente.",             //  message
                $partida_id,                                //  partida_id
                $bolsaJugador1,                             //  bolsaJugador1
                $bolsaJugador2,                             //  bolsaJugador2
                201                                         //  httpCode
            );
            
            return $dto;

        } catch (Exception $e) {
            // Si es un error de la base distinto a duplicado
            $dto->fillResponse(
                false,                                      //  success
                "Error interno del servidor.",              //  message
                null,                                       //  partida_id
                null,                                       //  bolsaJugador1
                null,                                       //  bolsaJugador2
                500                                         //  httpCode
            );
    
        return $dto;

        }
    }


    
    //Coloca y descarta dinosaurios, tira dado. Actualiza turnos y rondas
    public function turnoService(TurnoDTO $dto): TurnoDTO
    {
       //  Valida que se haya ingresado el ID de la partida
       if (!$dto->partida_id || 
            $dto->partida_id <= 0
           ) {
                $dto->fillResponse(
                    false,                                  //  success
                    'ID de partida inválido.',              //  message
                    null,                                   //  turno
                    null,                                   //  ronda
                    null,                                   //  caraDado
                    404,                                    //  httpCode
                    null,                                   //  puntaje_jugador1
                    null                                    //  puntaje_jugador2
                );
                return $dto;
        }

        //  Valida que se haya ingresado el ID del jugador
        if (!$dto->jugador_id ||
            $dto->jugador_id <= 0
            ){
                $dto->fillResponse(
                    false,                                  //  success
                    'Jugador inválido.',                    //  message
                    null,                                   //  turno
                    null,                                   //  ronda
                    null,                                   //  caraDado
                    404,                                    //  httpCode
                    null,                                   //  puntaje_jugador1
                    null                                    //  puntaje_jugador2
                );
                return $dto;
        }

        //  Valida que existan los datos requeridos
        if ($dto->recinto === '' ||
            $dto->tipoDino === '' || 
            $dto->tipoDinoDescarte === ''
            ) {
                $dto->fillResponse(
                    false,                                  //  success
                    'Recinto, tipos de dinosaurios y 
                    resltado del dado son requeridos.',                                      //  message
                    null,                                   //  turno
                    null,                                   //  ronda
                    null,                                   //  caraDado
                    400,                                    //  httpCode
                    null,                                   //  puntaje_jugador1
                    null                                    //  puntaje_jugador2
                );
                return $dto;
        }

        //  Valida que la partida exista
        if (!$this->partidaRepo->getPartidaRepo(
            $dto->partida_id
            )) {

                $dto->fillResponse(
                    false,                                  //  success
                    "La partida con ID $dto->partida_id
                    no existe.",                            //  message
                    null,                                   //  turno
                    null,                                   //  ronda
                    null,                                   //  caraDado
                    404,                                    //  httpCode
                    null,                                   //  puntaje_jugador1
                    null                                    //  puntaje_jugador2
                );
                return $dto;
        }

        $tiradorActual  = $this->partidaRepo->getTiradorActualRepo ($dto->partida_id);
        $turnoActual    = $this->partidaRepo->getTurnoActualRepo   ($dto->partida_id);
        $rondaActual    = $this->partidaRepo->getRondaActualRepo   ($dto->partida_id);
        $jugador1_id    = $this->partidaRepo->getJugador1IdRepo    ($dto->partida_id);
        $jugador2_id    = $this->partidaRepo->getJugador2IdRepo    ($dto->partida_id);
        $caraDadoActual = $this->partidaRepo->getCaraDadoActualRepo($dto->partida_id);

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
        error_log("DEBUG - jugador_id recibido: " . $dto->jugador_id);
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
                false,                                  //  success
                "El jugador que comienza la partida 
                debe ser el jugador 1.",                //  message
                $turnoActual,                           //  turno
                $rondaActual,                           //  ronda
                $caraDadoActual,                        //  caraDado
                404,                                    //  httpCode
                null,                                   //  puntaje_jugador1
                null                                    //  puntaje_jugador2
            );
            return $dto;
        }

        //  Valida que el jugador 2 sea siempre quien comienza la segunda ronda.
        if($turnoActual === 1 && 
        $rondaActual === 2 && 
        $dto->jugador_id !== $jugador2_id
        ){
            $dto->fillResponse(
                false,                                  //  success
                "El jugador que comienza la 
                ronda 2 debe ser el jugador 2.",        //  message
                $turnoActual,                           //  turno
                $rondaActual,                           //  ronda
                $caraDadoActual,                        //  caraDado
                404,                                    //  httpCode
                null,                                   //  puntaje_jugador1
                null                                    //  puntaje_jugador2
            );
            return $dto;
        }

        //  Si el jugador coloca un dinosaurio en un rescito que restringe el dado, no lo permite.
        if ($turnoActual > 1 && 
            $dto->jugador_id !== $tiradorActual
            ) {
            if (in_array(
                $dto->recinto, 
                $restricciones, 
                true
                )) {
                    $dto->fillResponse(
                        false,                           //  success
                        "El jugador no puede 
                        colocar un 
                        dinosaurio en el 
                        $dto->recinto 
                        (restringido por el dado).",     //  message
                        $turnoActual,                    //  turno
                        $rondaActual,                    //  ronda
                        $caraDadoActual,                 //  caraDado
                        404,                             //  httpCode
                        null,                            //  puntaje_jugador1
                        null                             //  puntaje_jugador2
                    );
                    return $dto;
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
                    false,                           //  success
                    "El jugador no tiene en su 
                    bolsa el dinosaurio {$dto->tipoDino} para colocar en {$dto->recinto}.",      //  message
                    $turnoActual,                    //  turno
                    $rondaActual,                    //  ronda
                    $caraDadoActual,                 //  caraDado
                    404,                             //  httpCode
                    null,                            //  puntaje_jugador1
                    null                             //  puntaje_jugador2
                );
                return $dto;
        }
            
        //  Realiza la colocación de dinosaurio.
        $colocacion = $this->partidaRepo->colocarDinosaurioRepo(
            $dto->jugador_id, 
            $dto->recinto, 
            $dto->tipoDino, 
            $dto->partida_id
        );

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
                    false,                           //  success
                    "El jugador no tiene en 
                    su bolsa el dinosaurio 
                    $dto->tipoDinoDescarte 
                    para descartar.",                //  message
                    $turnoActual,                    //  turno
                    $rondaActual,                    //  ronda
                    $caraDadoActual,                 //  caraDado
                    404,                             //  httpCode
                    null,                            //  puntaje_jugador1
                    null                             //  puntaje_jugador2
                );
                return $dto;
        }

        //  Quita el dinosaurios descartado de la bolsa del jugador.
        $descarte = $this->partidaRepo->descartarDinoRepo(
            $dto->partida_id, 
            $dto->jugador_id, 
            $dto->tipoDinoDescarte
        );


        // Suma un turno
        $turnoActual++;


        //Si el turno es del 1 al 5 Tira dado
        if($turnoActual < 6){

            //  Suma un turno.
            $this->partidaRepo->sumarTurnoRepo($dto->partida_id);
            
            //  Tira dado en backend.
            $caraDadoActual = $this->partida->tirarDado();

            //  Guarda en la base de dato el resultado del dado.
            $this->partidaRepo->tirarDadoRepo(
                $dto->partida_id, 
                $caraDadoActual, 
                $dto->jugador_id
            );

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
            true,                                       //  success
            "Jugada procesada exitosamente.",           //  message
            $turnoActual,                               // turno
            $rondaActual,                               // ronda
            $caraDadoActual,                            // caraDado
            201,                                        // httpCode
            $puntajeJugador1,                           // puntaje_jugador1
            $puntajeJugador2                            // puntaje_jugador2
        );

        return $dto;
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