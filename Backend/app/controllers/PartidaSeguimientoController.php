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
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'JSON inválido.'
                ]);
            return;
        }

        $dto = new CrearPartidaSeguimientoDTO($data);
        $response = $this->partidaSeguimientoService->crearPartidaSeguimientoService($dto);

        http_response_code($response->httpCode);
        echo json_encode($response->toArray());
        
    }



    // Controlador de creacion de bolsa de dinos
    public function crearBolsaSeguimientoController()
    {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'JSON inválido.'
                ]);
            return;
        }

        $dto = new CrearBolsaSeguimientoDTO($data);
        $response = $this->partidaSeguimientoService->crearBolsaSeguimientoService($dto);

        http_response_code($response->httpCode);
        echo json_encode($response->toArray());
            
    }



    public function turnoSeguimientoController()
    {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'JSON inválido.'
                ]);
            return;
        }

        $dto = new TurnoSeguimientoDTO($data);
        $response = $this->partidaSeguimientoService->turnoSeguimientoService($dto);

        http_response_code($response->httpCode);
        echo json_encode($response->toArray());
            
    }

}