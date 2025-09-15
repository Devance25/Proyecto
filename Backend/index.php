<?php

require_once 'app/config/Database.php';

require_once 'app/repositories/UsuarioRepository.php';
require_once 'app/repositories/PartidaRepository.php';

require_once 'app/services/AuthService.php';
require_once 'app/services/PartidaService.php';

require_once 'app/controllers/AuthController.php';
require_once 'app/controllers/PartidaController.php';

require_once 'app/domain/Partida.php';
require_once 'app/domain/Puntaje.php';
require_once 'app/domain/Reglas.php';

$origin = 'http://127.0.0.1:5500';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

try {

    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); 
    $uri = explode('/', trim((string)$uri, '/')); // 
    $method = strtoupper($_SERVER['REQUEST_METHOD']);

    $resource = $uri[0] ?? '';
    $param = $uri[1] ?? '';

    $authController = new AuthController();
    $partidaController = new PartidaController();


    switch ($resource) { 

        //AuthController
        case 'login':
            if ($method === 'POST') {
                $authController->loginController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
            ]);
            break;


        case 'registro':
            if ($method === 'POST') {
                $authController->registroController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
            ]);
            break;

        case 'registroAdmin':
            if ($method === 'POST') {
                $authController->registroAdminController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
            ]);
            break;

        
        case 'getUsuarios':
            if ($method === 'GET') {
                $authController->getUsuariosController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
            ]);
            break;

        case 'modificarUsuario':
            if ($method === 'POST') {
                $authController->modificarUsuarioController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
            ]);
            break;

        case 'eliminarUsuario':
            if ($method === 'POST') {
                $authController->eliminarUsuarioController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
            ]);
            break;



        //PartidaController
        case 'crearPartida':
            if ($method === 'POST') {
                $partidaController->crearPartidaController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
            ]);
            break;


        case 'turno':
            if ($method === 'POST') {
                $partidaController->turnoController();
                break;
            }            
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
                ]);
            break;  

        
        case 'finalizarPartida':
            if ($method === 'POST') {
                $partidaController->finalizarPartidaController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido.'
            ]);
            break;








        case 'health':

            $status = 'OK';
            $services = [
                'database' => ['status' => 'unknown'],
            ];

            try {
                $db = Database::getInstance()->getConnection();
                if ($db && ($db->query('SELECT 1') !== false)) {
                    $services['database']['status'] = 'up';
                } else {
                    $services['database']['status'] = 'down';
                    $status = 'DEGRADED';
                }
            } catch (Exception $e) {
                $services['database']['status'] = 'down';
                $status = 'DEGRADED';
            }

            $endpoints = [
                ['method' => 'GET', 'path' => '/health', 'description' => 'Estado de la aplicación y servicios'],
                ['method' => 'POST', 'path' => '/login', 'description' => 'Login con email o o nombre de usuario.'],
                ['method' => 'POST', 'path' => '/register', 'description' => 'Crear nuevo usuario.'],
                ['method' => 'POST', 'path' => '/crearPartida', 'description' => 'Crear nueva partida.'],
                ['method' => 'POST', 'path' => '/turno', 'description' => 'Colocar y descartar dinosaurio, tirar dado. Maneja el flujo de la partida.'],
                ['method' => 'POST', 'path' => '/finalizarPartida', 'description' => 'Finaliza una partida.'],
                // Agrega aquí nuevas rutas futuras...
            ];

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'status' => $status,
                'timestamp' => date('c'), // ISO-8601
                'services' => $services,
                'endpoints' => $endpoints,
            ]);
            break;

        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'No existe el recurso.']);
            break;
    }


} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor index: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
