<?php

class PartidaController
{
    private $partidaService;

    public function __construct()
    {
        $this->partidaService = PartidaService::getInstance();
    }





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
        
        if (isset($data['jugador1_id'])) {
            $jugador1_id = (int)$data['jugador1_id'];
        } else {  
            $jugador1_id = 0;
        }

        if (isset($data['jugador2_nombre'])){
            $jugador2_nombre = trim((string)$data['jugador2_nombre']);
        } else {
            $jugador2_nombre = '';
        }


        if ($jugador1_id <= 0 || $jugador2_nombre === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID de jugador 1 y nombre de jugador 2 son requeridos.'
            ]);
        return;
        }

        $result = $this->partidaService->crearPartidaService($jugador1_id, $jugador2_nombre);

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




    public function crearBolsasController()
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
        
        $id = isset($data['id']) ? (int)$data['id'] : 0;

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID de partida es requerido.'
            ]);
            return;
        }


        if (empty(trim($data['jugador1'] ?? ''))) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'invalid',
                'message' => 'Falta jugador 1.'
            ]);
            return;
        }

        if (empty(trim($data['jugador2'] ?? ''))) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'invalid',
                'message' => 'Falta jugador 2.'
            ]);
            return;
        }


        $jugador1 = trim((string)$data['jugador1']);
        $jugador2 = trim((string)$data['jugador2']);


        $result = $this->partidaService->crearBolsasService(
            $id, 
            $jugador1,
            $jugador2
        );

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





    public function tirarDadoController()
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
        
        $id = isset($data['id']) ? (int)$data['id'] : 0;

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID de partida es requerido.'
            ]);
            return;
        }


        if (empty(trim($data['jugador'] ?? ''))) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'code' => 'invalid',
                'message' => 'Falta jugador.'
            ]);
            return;
        }


        $jugador = trim((string)$data['jugador']);


        $result = $this->partidaService->tirarDadoService(
            $id, 
            $jugador
        );

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





    public function colocarDinosaurioController()
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

            if ($partida_id <= 0) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de partida es requerido.'
                ]);
                return;
            }

            if (empty(trim($data['jugador'] ?? ''))) {
                echo json_encode([
                    'success' => false,
                    'code' => 'invalid',
                    'message' => 'Falta jugador.'
                ]);
                return;
            }

            $jugador = trim((string)$data['jugador']);

            if (empty(trim($data['recinto'] ?? ''))) {
                echo json_encode([
                    'success' => false,
                    'code' => 'invalid',
                    'message' => 'Falta recinto.'
                ]);
                return;
            }

            $recinto = trim((string)$data['recinto']);

            if (empty(trim($data['tipo_dino'] ?? ''))) {
                echo json_encode([
                    'success' => false,
                    'code' => 'invalid',
                    'message' => 'Falta tipo de dinosaurio.'
                ]);
                return;
            }

            $tipo_dino = trim((string)$data['tipo_dino']);

            $result = $this->partidaService->colocarDinosaurioService($jugador, $recinto, $tipo_dino, $partida_id);

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
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

        public function descartarDinoController()
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

            if ($partida_id <= 0) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID de partida es requerido.'
                ]);
                return;
            }


            if (empty(trim($data['jugador'] ?? ''))) {
                echo json_encode([
                    'success' => false,
                    'code' => 'invalid',
                    'message' => 'Falta jugador.'
                ]);
                return;
            }

            $jugador = trim((string)$data['jugador']);


            if (empty(trim($data['dino'] ?? ''))) {
                echo json_encode([
                    'success' => false,
                    'code' => 'invalid',
                    'message' => 'Falta dino.'
                ]);
                return;
            }

            $dino = trim((string)$data['dino']);
            

            $result = $this->partidaService->descartarDinoService($partida_id, $jugador, $dino);

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
                'trace' => $e->getTraceAsString()
            ]);
        }
    }



    public function cancelarPartidaController()
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
            
        if (isset($data['id'])) {
                $id = (int)$data['id'];
        } else {  
                $id = 0;
        }

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode([
                            'success' => false,
                            'message' => 'ID de partida es requerido.'
                            ]);
            return;
        }

        $result = $this->partidaService->cancelarPartidaService($id);

        if (!is_array($result) || !array_key_exists('success', $result)){
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




    public function finalizarPartidaController()
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
        
        if (isset($data['id'])) {
            $id = (int)$data['id'];
        } else {  
            $id = 0;
        }

        if(isset($date['puntaje_jugador1'])){
            $puntaje_jugador1 = (int)$data['puntaje_jugador1'];
        } else {  
            $puntaje_jugador1 = 0;
        }

        if(isset($date['puntaje_jugador2'])){
            $puntaje_jugador2 = (int)$data['puntaje_jugador2'];
        } else {  
            $puntaje_jugador2 = 0;
        }

        if ($id <= 0 || $puntaje_jugador1 < 0 || $puntaje_jugador2 < 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID de partida es requerido.'
            ]);
        return;
        }

        $result = $this->partidaService->finalizarPartidaService(
            $id, 
            $puntaje_jugador1, 
            $puntaje_jugador2
        );

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

}
