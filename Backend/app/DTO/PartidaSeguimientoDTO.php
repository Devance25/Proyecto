<?php

// ============================================================================
// Modo Seguimiento de partida
// ============================================================================

class CrearPartidaSeguimientoDTO
{
    //  Variables para la request.
    public int $jugador1_id;
    public int $jugador2_id;

    //  Variables para la response.
    public ?bool   $success    = null;
    public ?string $message    = null;
    public ?int    $partida_id = null;
    public int     $httpCode   = 200;

    public function __construct(
        array $data)
    {
        $this->jugador1_id = (int)($data['jugador1_id'] ?? 0);
        $this->jugador2_id = (int)($data['jugador2_id'] ?? 0);
    }

    public function fillResponse(
        ?bool   $success,
        ?string $message,
        ?int    $partida_id,
        int     $httpCode = 200
    ) {
        $this->success    = $success;
        $this->message    = $message;
        $this->partida_id = $partida_id;
        $this->httpCode   = $httpCode;
    }

    // Para convertir fácilmente a JSON
    public function toArray(): array {
        return [
            'success'     => $this->success,
            'message'     => $this->message,
            'partida_id'  => $this->partida_id,
            'jugador1_id' => $this->jugador1_id,
            'jugador2_id' => $this->jugador2_id,
            'httpCode'    => $this->httpCode
        ];
    }
}

class CrearBolsaSeguimientoDTO 
{
    //  Variables para la request.
    public int   $partida_id;
    public int   $jugador_id;
    public array $dinos;

    //  Variables para la response.
    public ?bool   $success;
    public ?string $message;
    public int     $httpCode = 200;

    public function __construct(
        array $data
    ){
        $this->partida_id = (int)($data['partida_id'] ?? 0);
        $this->jugador_id = (int)($data['jugador_id'] ?? 0);
        $this->dinos      =       $data['dinos']      ?? [];
    }

    public function fillResponse(
         bool   $success,
         string $message,
         int    $httpCode = 200
    ) {
        $this->success    = $success;
        $this->message    = $message;
        $this->httpCode   = $httpCode;
    }

    public function toArray(): array
    {
        return [
            'success'    => $this->success,
            'message'    => $this->message,
            'partida_id' => $this->partida_id,
            'jugador_id' => $this->jugador_id,
            'dinos'      => $this->dinos,
            'httpCode'   => $this->httpCode
        ];
    }


}

class TurnoSeguimientoDTO
{
    //  Variables para la request.
    public int    $partida_id;
    public int    $jugador_id;
    public string $recinto;
    public string $tipoDino;
    public string $tipoDinoDescarte;
    public string $caraDado;

    //  Variables para la response.
    public ?bool   $success          = null;
    public ?string $message          = null;
    public ?int    $turno            = null;
    public ?int    $ronda            = null;
    public ?int    $puntaje_jugador1 = null;
    public ?int    $puntaje_jugador2 = null;
    public int     $httpCode         = 200;

    //  Crea el constructor con las varibles de la request.
    public function __construct(
        array $data
    ){
        $this->partida_id       = (int)   ($data['partida_id']       ??  0);
        $this->jugador_id       = (int)   ($data['jugador_id']       ??  0);
        $this->recinto          = (string)($data['recinto']          ?? '');
        $this->tipoDino         = (string)($data['tipoDino']         ?? '');
        $this->tipoDinoDescarte = (string)($data['tipoDinoDescarte'] ?? '');
        $this->caraDado         = (string)($data['caraDado']         ?? '');

    }

    //  Completa el DTO con los datos de la response.
    public function fillResponse(
        bool   $success,
        string $message,
        ?int   $turno,
        ?int   $ronda,
        ?int   $puntaje_jugador1,
        ?int   $puntaje_jugador2,
        int    $httpCode = 200
    ): void {
        $this->success          = $success;
        $this->message          = $message;
        $this->turno            = $turno;
        $this->ronda            = $ronda;
        $this->puntaje_jugador1 = $puntaje_jugador1;
        $this->puntaje_jugador2 = $puntaje_jugador2;
        $this->httpCode         = $httpCode;
    }

    //  Funcion para comvertir el DTO a array.
    public function toArray(): array
    {
        return [
            'success'          => $this->success,
            'message'          => $this->message,
            'partida_id'       => $this->partida_id,
            'jugador_id'       => $this->jugador_id,
            'recinto'          => $this->recinto,
            'tipoDino'         => $this->tipoDino,
            'tipoDinoDescarte' => $this->tipoDinoDescarte,
            'caraDado'         => $this->caraDado,
            'turno'            => $this->turno,
            'ronda'            => $this->ronda,
            'puntaje_jugador1' => $this->puntaje_jugador1,
            'puntaje_jugador2' => $this->puntaje_jugador2,
            'httpCode'         => $this->httpCode,
        ];
    }
}

class RondaSeguimientoDTO
{
    //  Variables para la request.
    public int    $partida_id;
    public int    $jugador_id;
    public string $recinto;
    public string $tipoDino;
    public string $tipoDinoDescarte;
    public array  $bolsa_jugador1;
    public array  $bolsa_jugador2;

    //  Variables para la response.
    public ?bool   $success          = null;
    public ?string $message          = null;
    public ?int    $turno            = null;
    public ?int    $ronda            = null;
    public ?string $caraDado         = null;
    public ?int    $puntaje_jugador1 = null;
    public ?int    $puntaje_jugador2 = null;
    public int     $httpCode         = 200;

    //  Crea el constructor con las varibles de la request.
    public function __construct(
        array $data
    ){
        $this->partida_id       = (int)   ($data['partida_id']       ??  0);
        $this->jugador_id       = (int)   ($data['jugador_id']       ??  0);
        $this->recinto          = (string)($data['recinto']          ?? '');
        $this->tipoDino         = (string)($data['tipoDino']         ?? '');
        $this->tipoDinoDescarte = (string)($data['tipoDinoDescarte'] ?? '');
        $this->bolsa_jugador1   =          $data['bolsa_jugador1']   ??  [];
        $this->bolsa_jugador2   =          $data['bolsa_jugador2']   ??  [];
    }

    //  Completa el DTO con los datos de la response.
    public function fillResponse(
        ?bool   $success,
        ?string $message,
        ?int    $turno,
        ?int    $ronda,
        ?string $caraDado,
        int     $httpCode,
        ?int    $puntaje_jugador1 = null,
        ?int    $puntaje_jugador2 = null,
        
    ): void {
        $this->success          = $success;
        $this->message          = $message;
        $this->turno            = $turno;
        $this->ronda            = $ronda;
        $this->caraDado         = $caraDado;
        $this->puntaje_jugador1 = $puntaje_jugador1;
        $this->puntaje_jugador2 = $puntaje_jugador2;
        $this->httpCode         = $httpCode;
    }

    //  Funcion para comvertir el DTO a array.
    public function toArray(): array
    {
        return [
            'success'          => $this->success,
            'message'          => $this->message,
            'partida_id'       => $this->partida_id,
            'jugador_id'       => $this->jugador_id,
            'recinto'          => $this->recinto,
            'tipoDino'         => $this->tipoDino,
            'tipoDinoDescarte' => $this->tipoDinoDescarte,
            'caraDado'         => $this->caraDado,
            'turno'            => $this->turno,
            'ronda'            => $this->ronda,
            'puntaje_jugador1' => $this->puntaje_jugador1,
            'puntaje_jugador2' => $this->puntaje_jugador2,
            'bolsa_jugador1'   => $this->bolsa_jugador1,
            'bolsa_jugador2'   => $this->bolsa_jugador2,
            'httpCode'         => $this->httpCode,
        ];
    }
}

class FinalizarPartidaSeguimientoDTO
{
    //  Variables para la request.
    public int    $partida_id;
    public int    $jugador_id;
    public string $recinto;
    public string $tipoDino;
    public string $tipoDinoDescarte;

    //  Variables para la response.
    public ?bool   $success          = null;
    public ?string $message          = null;
    public ?int    $ganador_id       = null;
    public ?int    $empate           = null;
    public ?int    $puntaje_jugador1 = null;
    public ?int    $puntaje_jugador2 = null;
    public int     $httpCode         = 200;

    //  Crea el constructor con las varibles de la request.
    public function __construct(
        array $data
    ){
        $this->partida_id       = (int)   ($data['partida_id']       ??  0);
        $this->jugador_id       = (int)   ($data['jugador_id']       ??  0);
        $this->recinto          = (string)($data['recinto']          ?? '');
        $this->tipoDino         = (string)($data['tipoDino']         ?? '');
        $this->tipoDinoDescarte = (string)($data['tipoDinoDescarte'] ?? '');
    }

    //  Completa el DTO con los datos de la response.
    public function fillResponse(
        bool   $success,
        string $message,
        ?int   $ganador_id,
        ?int   $empate,
        ?int   $puntaje_jugador1,
        ?int   $puntaje_jugador2,
        int    $httpCode = 200
    ): void {
        $this->success          = $success;
        $this->message          = $message;
        $this->ganador_id       = $ganador_id;
        $this->empate           = $empate;
        $this->puntaje_jugador1 = $puntaje_jugador1;
        $this->puntaje_jugador2 = $puntaje_jugador2;
        $this->httpCode         = $httpCode;
    }

    //  Funcion para comvertir el DTO a array.
    public function toArray(): array
    {
        return [
            'success'          => $this->success,
            'message'          => $this->message,
            'partida_id'       => $this->partida_id,
            'jugador_id'       => $this->jugador_id,
            'recinto'          => $this->ganador_id,
            'tipoDino'         => $this->empate,
            'puntaje_jugador1' => $this->puntaje_jugador1,
            'puntaje_jugador2' => $this->puntaje_jugador2,
            'httpCode'         => $this->httpCode,
        ];
    }
}