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

            $dto = new RondaDTO($data);
            $response = $this->partidaService->finalizarRondaService($dto);

        
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


