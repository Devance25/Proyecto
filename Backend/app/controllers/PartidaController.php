<?php

class PartidaController
{
    private $partidaService;

    public function __construct()
    {
        $this->partidaService = PartidaService::getInstance();
    }


// ============================================================================
// Contoladores de juego digital completo
// ============================================================================

    // Controlador de creacion de partida
    public function crearPartidaController()
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
        
        $jugador1_id = isset($data['jugador1_id']) ? (int)$data['jugador1_id'] : 0;
        $jugador2_id = isset($data['jugador2_id']) ? (int)$data['jugador2_id'] : 0;

        $result = $this->partidaService->crearPartidaService($jugador1_id, $jugador2_id);

        if (!is_array($result) || !array_key_exists('success', $result)) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor.'
            ]);
            return;
        }

        if ($result['success'] === true) {
            http_response_code(201);
        } else {
            $code = isset($result['code']) ? $result['code'] : 'error';
            if ($code === 'invalid') {
                http_response_code(400);
            } elseif ($code === 'duplicate') {
                http_response_code(409);
            } else {
                http_response_code(500);
            }
        }

        echo json_encode($result);
    }



    public function turnoController()
    {
        try {
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

            $partida_id = isset($data['partida_id']) ? (int)$data['partida_id'] : 0;

            $jugador_id = isset($data['jugador_id']) ? (int)$data['jugador_id'] : 0;

            if ($partida_id <= 0 || $jugador_id <= 0) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de partida y jugador son requeridos.'
                ]);
                return;
            }


            if (empty(trim($data['recinto'] ?? ''))) {
                echo json_encode([
                    'success' => false,
                    'code' => 'invalid',
                    'message' => 'Falta recinto.'
                ]);
                return;
            }

            $recinto = trim((string)$data['recinto']);



            if (empty(trim($data['tipoDino'] ?? ''))) {
                echo json_encode([
                    'success' => false,
                    'code' => 'invalid',
                    'message' => 'Falta tipo de dinosaurio.'
                ]);
                return;
            }

            $tipoDino = trim((string)$data['tipoDino']);



            if (empty(trim($data['tipoDinoDescarte'] ?? ''))) {
                echo json_encode([
                    'success' => false,
                    'code' => 'invalid',
                    'message' => 'Falta tipo de dinosaurio.'
                ]);
                return;
            }

            $tipoDinoDescarte = trim((string)$data['tipoDinoDescarte']);



            $result = $this->partidaService->turnoService($jugador_id, $recinto, $tipoDino, $tipoDinoDescarte, $partida_id);

            if (!is_array($result) || !array_key_exists('success', $result)) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Error interno del servidor controller.'
                ]);
                return;
            }

            if ($result['success'] === true) {
                http_response_code(200);
            } else {
                $code = isset($result['code']) ? $result['code'] : 'error';
                if ($code === 'invalid') {
                    http_response_code(400);
                } elseif ($code === 'duplicate') {
                    http_response_code(409);
                } else {
                    http_response_code(500);
                }
            }

            echo json_encode($result);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor controller: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
        }
    }




    public function finalizarRondaController()
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
        
        if (isset($data['partida_id'])) {
            $partida_id = (int)$data['partida_id'];
        } else {  
            $partida_id = 0;
        }

        if ($partida_id <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID de partida es requerido.'
            ]);
        return;
        }

        $result = $this->partidaService->finalizarRondaService($partida_id);

        if (!is_array($result) || !array_key_exists('success', $result)) 
        {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor.'
            ]);
            return;
        }

        if ($result['success'] === true) {
            http_response_code(200);
        } else {
            $code = isset($result['code']) ? $result['code'] : 'error';
            if ($code === 'invalid') {
                http_response_code(400); 
            } elseif ($code === 'duplicate') {
                http_response_code(409); 
            } else {
                http_response_code(500); 
            }
        }

        echo json_encode($result);
    }








// ============================================================================
// Contoladores de modo de seguimiento
// ============================================================================
    

    // Controlador de creacion de partida
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

        $dto = new CrearPartidaSeguimientoRequestDTO($data);
        $response = $this->partidaService->crearPartidaSeguimientoService($dto);

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
    
        $dto = new CrearBolsaSeguimientoRequestDTO($data);
        $response = $this->partidaService->crearBolsaSeguimientoService($dto);
    
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
        $response = $this->partidaService->turnoSeguimientoService($dto);
    
        http_response_code($response->httpCode);
        echo json_encode($response->toArray());
            
    }


// ============================================================================
// Contoladores transversales a ambos modos
// ============================================================================


    public function finalizarPartidaController()
    {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        //  Valida que el body sea un JSON válido.
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'JSON inválido.'
            ]);
            return;
        }
        //  Crea el DTO con los datos de la request.
        $dto = new FinalizarPartidaDTO($data);

        //  Llama al service que procesa la lógica de negocio.
        $response = $this->partidaService->finalizarPartidaService($dto);

        //  Devuelve la respuesta como JSON con el código HTTP correspondiente.
        http_response_code($response->httpCode);
        echo json_encode($response->toArray());
    }
}


