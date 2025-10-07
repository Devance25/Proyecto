<?php

// ============================================================================
// Modo Juego Digital Completo
// ============================================================================

class CrearPartidaDTO
{
    //  Variables para la request.
    public int $jugador1_id;
    public int $jugador2_id;

    //  Variables para la response.
    public ?bool   $success       = null;
    public ?string $message       = null;
    public ?int    $partida_id    = null;
    public ?array  $bolsaJugador1 = null;
    public ?array  $bolsaJugador2 = null;
    public int     $httpCode      = 200;

    public function __construct(array $data)
    {
        $this->jugador1_id = (int)($data['jugador1_id'] ?? 0);
        $this->jugador2_id = (int)($data['jugador2_id'] ?? 0);
    }

    public function fillResponse(
        ?bool   $success,
        ?string $message,
        ?int    $partida_id,
        ?array  $bolsaJugador1,
        ?array  $bolsaJugador2,
        int     $httpCode
    ) {
        $this->success       = $success;
        $this->message       = $message;
        $this->partida_id    = $partida_id;
        $this->bolsaJugador1 = $bolsaJugador1;
        $this->bolsaJugador1 = $bolsaJugador2;
        $this->httpCode      = $httpCode;
    }

    // Para convertir fácilmente a JSON
    public function toArray(): array {
        return [
            'success'       => $this->success,
            'message'       => $this->message,
            'partida_id'    => $this->partida_id,
            'jugador1_id'   => $this->jugador1_id,
            'jugador2_id'   => $this->jugador2_id,
            'bolsaJugador1' => $this->bolsaJugador1,
            'bolsaJugador1' => $this->bolsaJugador2,
            'httpCode'      => $this->httpCode
        ];
    }
}

class TurnoDTO{
    
    //  Variables de la request
    public int    $partida_id;
    public int    $jugador_id;
    public string $recinto;
    public string $tipoDino;
    public string $tipoDinoDescarte;

    //  Variables de la response
    public ?bool   $success         = null;
    public ?string $message         = null;
    public ?int    $turno           = null;
    public ?int    $ronda           = null;
    public ?string $caraDado        = null;
    public ?int    $puntaje_jugador1 = null;
    public ?int    $puntaje_jugador2 = null;
    public int     $httpCode        = 200;

    public function __construct(array $data)
    {
        $this->partida_id       = (int)   ($data['partida_id']       ??  0);
        $this->jugador_id       = (int)   ($data['jugador_id']       ??  0);
        $this->recinto          = (string)($data['recinto']          ?? '');
        $this->tipoDino         = (string)($data['tipoDino']         ?? '');
        $this->tipoDinoDescarte = (string)($data['tipoDinoDescarte'] ?? '');
    }


    public function fillResponse(
        ?bool   $success,
        ?string $message,
        ?int    $turno,
        ?int    $ronda,
        ?string $caraDado,
        ?int    $puntaje_jugador1 = null,
        ?int    $puntaje_jugador2 = null,
        int     $httpCode
    ) {
        $this->success         = $success;
        $this->message         = $message;
        $this->turno           = $turno;
        $this->ronda           = $ronda;
        $this->caraDado        = $caraDado;
        $this->puntajeJugador1 = $puntaje_jugador1;
        $this->puntajeJugador2 = $puntaje_jugador2;
        $this->httpCode        = $httpCode;
    }



}




// ============================================================================
// DTO transversales a amobos modos
// ============================================================================

class CalcularPuntajesDTO
{   
    //  Variable para el request
    public int $partida_id;

    //  Variables para el response
    public ?int $puntajeJugador1 = null;
    public ?int $puntajeJugador2 = null;

    public function __construct(
        int $partida_id
        )
    {
        $this->partida_id = $partida_id;

    }

    public function fillResponse(
        ?int $puntajeJugador1,
        ?int $puntajeJugador2
    ): void {
        $this->puntajeJugador1 = $puntajeJugador1;
        $this->puntajeJugador2 = $puntajeJugador2;
    }
}

class FinalizarPartidaDTO
{
    //  Variable para la request
    public int $partida_id;

    //  Variables para el response
    public ?bool   $success         = null;
    public ?string $message          = null;
    public ?int    $ganador_id       = null;
    public ?bool   $empate           = null;
    public ?int    $puntaje_jugador1 = null;
    public ?int    $puntaje_jugador2 = null;
    public int     $httpCode         = 200;

    // Constructor: recibe solo lo que hace falta para la request
    public function __construct(array $data)
    {
        $this->partida_id = (int)($data['partida_id'] ?? 0);
    }

    // Método para "completar" cuando se usa como response
    public function fillResponse(
        bool $success,
        string $message,
        ?int $ganador_id,
        ?bool $empate,
        ?int $puntaje_jugador1,
        ?int $puntaje_jugador2,
        int $httpCode = 200
    ): void {
        $this->success = $success;
        $this->message = $message;
        $this->ganador_id = $ganador_id;
        $this->empate = $empate;
        $this->puntaje_jugador1 = $puntaje_jugador1;
        $this->puntaje_jugador2 = $puntaje_jugador2;
        $this->httpCode = $httpCode;
    }

    public function toArray(): array
    {
        return [
            'success'          => $this->success,
            'message'          => $this->message,
            'partida_id'       => $this->partida_id,
            'ganador_id'       => $this->ganador_id,
            'empate'           => $this->empate,
            'puntaje_jugador1' => $this->puntaje_jugador1,
            'puntaje_jugador2' => $this->puntaje_jugador2,
            'httpCode'         => $this->httpCode,
        ];
    }
}

