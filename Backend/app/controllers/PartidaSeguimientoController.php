<?php

class PartidaSeguimientoController
{
    private $partidaSeguimientoService;

    public function __construct()
    {
        $this->partidaSeguimientoService = PartidaSeguimientoService::getInstance();
    }


// ============================================================================
// Contoladores de modo de seguimiento
// ============================================================================
    

    public function crearPartidaSeguimientoController()
    {
        try{
            $raw  = file_get_contents("php://input");
            $data = json_decode($raw, true);

            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode([
                    'success'  => false,
                    'message'  => 'JSON inválido.',
                    'httpCode' => 400
                ]);
                return;
            }

            $dto      = new CrearPartidaSeguimientoDTO($data);
            $response = $this->partidaSeguimientoService->crearPartidaSeguimientoService($dto);

            http_response_code($response->httpCode);
            echo json_encode($response->toArray());
            
        }catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success'  => false,
                'message'  => 'Error interno del servidor: ' . $e->getMessage(),
                'httpCode' => 500
            ]);
        }
    }



    //  Controlador de creacion de bolsa de dinos
    public function crearBolsaSeguimientoController()
    {
        try{
            $raw  = file_get_contents("php://input");
            $data = json_decode($raw, true);

            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode([
                    'success'  => false,
                    'message'  => 'JSON inválido.',
                    'httpCode' => 400
                ]);
                return;
            }

            $dto      = new CrearBolsaSeguimientoDTO($data);
            $response = $this->partidaSeguimientoService->crearBolsaSeguimientoService($dto);

            http_response_code($response->httpCode);
            echo json_encode($response->toArray());
            
        }catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success'  => false,
                'message'  => 'Error interno del servidor: ' . $e->getMessage(),
                'httpCode' => 500
            ]);
        }
            
    }


    //  Controlador para procesar el turno del modo seguimiento 
    public function turnoSeguimientoController()
    {
        try {
            $raw  = file_get_contents("php://input");
            $data = json_decode($raw, true);

            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode([
                    'success'  => false,
                    'message'  => 'JSON inválido.',
                    'httpCode' => 400
                ]);
                return;
            }

            $dto      = new TurnoSeguimientoDTO($data);
            $response = $this->partidaSeguimientoService->turnoSeguimientoService($dto);

            http_response_code($response->httpCode);
            echo json_encode($response->toArray());
            
        }catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success'  => false,
                'message'  => 'Error interno del servidor: ' . $e->getMessage(),
                'httpCode' => 500
            ]);
        }
    }

    //  Controlador para procesar el fin de ronda del modo seguimiento 
    public function finalizarRondaSeguimientoController()
    {
        try {
            $raw = file_get_contents("php://input");
            $data = json_decode($raw, true);

            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode([
                    'success'  => false,
                    'message'  => 'JSON inválido.',
                    'httpCode' => 400
                ]);
                return;
            }

            $dto      = new RondaSeguimientoDTO($data);
            $response = $this->partidaSeguimientoService->finalizarRondaSeguimientoService($dto);

            http_response_code($response->httpCode);
            echo json_encode($response->toArray());
            
        }catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success'  => false,
                'message'  => 'Error interno del servidor: ' . $e->getMessage(),
                'httpCode' => 500
            ]);
        }
    }

    //  Controlador para procesar el fin de partida del modo seguimiento 
    public function finalizarPartidaSeguimientoController()
    {
        try {
            $raw  = file_get_contents("php://input");
            $data = json_decode($raw, true);

            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode([
                    'success'  => false,
                    'message'  => 'JSON inválido.',
                    'httpCode' => 400
                ]);
                return;
            }

            $dto      = new FinalizarPartidaSeguimientoDTO($data);
            $response = $this->partidaSeguimientoService->finalizarPartidaSeguimientoService($dto);

            http_response_code($response->httpCode);
            echo json_encode($response->toArray());
            
        }catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success'  => false,
                'message'  => 'Error interno del servidor: ' . $e->getMessage(),
                'httpCode' => 500
            ]);
        }
    }

}