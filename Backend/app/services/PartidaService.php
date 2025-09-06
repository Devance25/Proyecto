<?php

class PartidaService
{   
    private static ?PartidaService $instance = null; 

    private ?PartidaRepository $partidaRepository;

    //DOMAIN
    private Partida $partida;
    private Reglas $reglas;
    private Puntaje $puntaje;

    private function __construct()
    {
        $this->partidaRepository = PartidaRepository::getInstance();
        $this->partida = new Partida();
        $this->reglas = new Reglas();
        $this->puntaje = new Puntaje();
    }

    public static function getInstance(): ?PartidaSerivce
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

        $created = $this->partidaRepository->crearPartida($jugador1_id, $jugador2_nombre);
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

    public function tirarDadoService(int $partida_id, string $jugador): array
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
        $this->partidaRepository->guardarResultadoDado($partida_id, $jugador, $caraDadoActual);

        return [
            'success' => true,
            'partida_id' => $partida_id,
            'cara_dado' => $caraDadoActual,
            'tirador' => $tirador,
        ];
    }

    private function colocarDinosaurioService(string $jugador, string $recinto, string $tipoDino, int $partida_id): array
    {
        $caraDadoActual = $this->partidaRepository->getCaraDadoActual($partida_id);
        $tiradorActual = $this->partidaRepository->getTiradorActual($partida_id);
        $turnoActual = $this->partidaRepository->getTurnoActual($partida_id);
        $rondaActual = $this->partidaRepository->getRondaActual($partida_id);

        if ($jugador !== $tiradorActual && $recinto === $caraDadoActual)
        {
            throw new Exception ('el jugador no puede colocar un dinosaurio en ese recinto');
        }

        //3 turnos por ronda. Un turno, ambos jugadores colocan
        if ($jugador !== $tiradorActual) 
        {
            $this->partidaRepository->sumarTurnoRepository($partida_id);
            $turnoActual = $this->partidaRepository->getTurnoActual($partida_id);
        }

        //cuando el segundo jugador coloca si dino en la 
        if ($turnoActual > 3){
            
            $this->partidaRepository->sumarRondaRepository($partida_id);
            $this->partidaRepository->resetTurnosRepository($partida_id);
            $turnoActual = $this->partidaRepository->getTurnoActual($partida_id);
            $rondaActual = $this->partidaRepository->getRondaActual($partida_id);
        }

        $colocacion = $this->partidaRepository->colocarDinosaurioRepository($jugador, $recinto, $tipoDino, $turnoActual, $rondaActual, $partida_id);

        return $colocacion;

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
            $this->partidaRepository->finalizarPartida($id, $puntaje_jugador1, $puntaje_jugador2);
            
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
            $this->partidaRepository->cancelarPartida($id);
            
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