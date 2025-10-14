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
        try{
            $raw = file_get_contents("php://input");
            $data = json_decode($raw, true);

            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'JSON inválido.',
                    'httpCode' => 400
                ]);
                return;
            }

            $dto = new CrearPartidaDTO($data);
            $response = $this->partidaService->crearPartidaService($dto);


            http_response_code($response->httpCode);
            echo json_encode($response->toArray());

        }catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'httpCode' => 500
            ]);
        }
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
                    'message' => 'JSON inválido.',
                    'httpCode' => 400
                ]);
                return;
            }

            $dto = new TurnoDTO($data);
            $response = $this->partidaService->turnoService($dto);

        
            http_response_code($response->httpCode);
            echo json_encode($response->toArray());

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'httpCode' => 500
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
                'message' => 'JSON inválido.',
                'httpCode' => 400
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
                'message' => 'ID de partida es requerido.',
                'httpCode' => 400
            ]);
        return;
        }

        $result = $this->partidaService->finalizarRondaService($partida_id);

        if (!is_array($result) || !array_key_exists('success', $result)) 
        {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor.',
                'httpCode' => 500
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
// Contoladores transversales a ambos modos
// ============================================================================


    public function finalizarPartidaController()
    {
        try{
            $raw = file_get_contents("php://input");
            $data = json_decode($raw, true);

            //  Valida que el body sea un JSON válido.
            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'JSON inválido.',
                    'httpCode' => 400
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
            
        }catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'httpCode' => 500
            ]);
        }
    }
}


