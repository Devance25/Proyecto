<?php

require_once 'app/DTO/AuthDTO.php';

class AuthController
{

    private $authService;

    public function __construct()
    {

        $this->authService = AuthService::getInstance();
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function registroController()
    {
        // Lee el cuerpo crudo de la petición y lo intenta parsear como JSON
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        // Si no es un objeto/array JSON válido, respondemos 400
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'JSON inválido.'
            ]);
            return;
        }
        
        $dto = new RegistroDTO($data);

        // Delegamos la creación al servicio
        $result = $this->authService->registrarUsuarioService($dto);

        // Si el servicio no retornó un array válido, lo consideramos error interno
        if (!is_array($result) || !array_key_exists('success', $result)) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Error interno del servidor.'
            ]);
            return;
        }

        if ($result['success'] === true) {
            http_response_code(201); // Creado
        } else {
            $code = isset($result['code']) ? $result['code'] : 'error';
            if ($code === 'invalid') {
                http_response_code(400); // Datos inválidos
            } elseif ($code === 'duplicate') {
                http_response_code(409); // Conflicto: duplicado
            } else {
                http_response_code(500); // Error genérico del servidor
            }
        }

        echo json_encode($result);
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function registroAdminController()
    {
        // Lee el cuerpo crudo de la petición y lo intenta parsear como JSON
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        // Si no es un objeto/array JSON válido, respondemos 400
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'JSON inválido.'
            ]);
            return;
        }

        $dto = new RegistroAdminDTO($data);

        // Delegamos la creación al servicio
        $result = $this->authService->registrarUsuarioAdminService($dto);

        // Si el servicio no retornó un array válido, lo consideramos error interno
        if (!is_array($result) || !array_key_exists('success', $result)) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Error interno del servidor.'
            ]);
            return;
        }

        if ($result['success'] === true) {
            http_response_code(201); // Creado
        } else {
            $code = isset($result['code']) ? $result['code'] : 'error';
            if ($code === 'invalid') {
                http_response_code(400); // Datos inválidos
            } elseif ($code === 'duplicate') {
                http_response_code(409); // Conflicto: duplicado
            } else {
                http_response_code(500); // Error genérico del servidor
            }
        }

        echo json_encode($result);
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function loginController()
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

        $dto = new LoginDTO($data);

        $result = $this->authService->loginService($dto);

        if (!is_array($result) || !array_key_exists('success', $result)) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Error interno del servidor.'
            ]);
            return;
        }

        if ($result['success']) {
            http_response_code(200);
        } else {
            http_response_code(401);
        }

        echo json_encode($result);
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function getUsuariosController()
    {
        try {
            $usuarios = $this->authService->getUsuariosService();

            if (!is_array($usuarios)) {
                throw new Exception('Respuesta inesperada del servicio.');
            }

            if (count($usuarios) === 0) {
                echo json_encode([
                    'success' => true,
                    'usuarios' => [],
                    'message' => 'No hay usuarios registrados.'
                ]);
                return;
            }

            echo json_encode([
                'success' => true,
                'usuarios' => $usuarios
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener usuarios.'
            ]);
        }
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function modificarUsuarioController()
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

        $dto = new ModificaUsuarioDTO($data);

        $usuarioModificado = $this->authService->modificarUsuarioService($dto);

        echo json_encode([
            'success' => true,
            'message' => $usuarioModificado,
        ]);
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function eliminarUsuarioController()
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

        $dto = new EliminaUsuarioDTO($data);
        
        $result = $this->authService->eliminarUsuarioService($dto);

        if (!is_array($result) || !array_key_exists('success', $result)) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Error interno del servidor.'
            ]);
            return;
        }

        if ($result['success']) {
            http_response_code(200);
        } else {
            http_response_code(401);
        }

        echo json_encode($result);
    }

/*============================================================================================================*/
    public function getRankingController()
    {
        try {
            $result = $this->authService->getRankingService();

            if (!$result['success']) {
                http_response_code(500);
                echo json_encode($result);
                return;
            }

            http_response_code(200);
            echo json_encode($result);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor.'
            ]);
        }
    }
/*============================================================================================================*/

}