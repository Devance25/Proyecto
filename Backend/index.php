<?php

require_once 'app/config/Database.php';

require_once 'app/repositories/UsuarioRepository.php';
require_once 'app/repositories/PartidaRepository.php';

require_once 'app/services/AuthService.php';
require_once 'app/services/PartidaService.php';
require_once 'app/services/PartidaSeguimientoService.php';

require_once 'app/controllers/AuthController.php';
require_once 'app/controllers/PartidaController.php';
require_once 'app/controllers/PartidaSeguimientoController.php';

require_once 'app/domain/Partida.php';
require_once 'app/domain/Puntaje.php';
require_once 'app/domain/Reglas.php';

require_once 'app/DTO/PartidaDTO.php';
require_once 'app/DTO/PartidaSeguimientoDTO.php';


$origin = '*';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

try {

    // ===========================
    // PARSEO DE LA URL
    // ===========================
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode('/', trim((string)$uri, '/'));

    // Buscamos la posición de 'index.php' en la URL
    $indexPos = array_search('index.php', $uri);

    // Si existe, tomamos todo lo que venga después de 'index.php'
    if ($indexPos !== false) {
        $segments = array_slice($uri, $indexPos + 1);
    } else {
        // Si no está, tomamos todo lo que venga después de 'user_devance/Backend'
        $basePos = array_search('Backend', $uri);
        $segments = $basePos !== false ? array_slice($uri, $basePos + 1) : $uri;
    }

    // Filtramos vacíos (por si hay barra final '/')
    $segments = array_filter($segments, fn($s) => $s !== '');

    // Unimos todo en un solo string (ej: getUsuarios)
    $resource = implode('/', $segments);
    $method = strtoupper($_SERVER['REQUEST_METHOD']);

    error_log("DEBUG - recurso = " . $resource);

    // ===========================
    // CONTROLADORES
    // ===========================
    $authController = new AuthController();
    $partidaController = new PartidaController();
    $partidaSeguimientoController = new PartidaSeguimientoController();

    // ===========================
    // RUTEO DE ENDPOINTS
    // ===========================
    switch ($resource) {

        // ============================================================================
        // Endpoints para manejo de registro, login de usuarios y funciones de administración
        // ============================================================================
        case 'login':
            if ($method === 'POST') {
                $authController->loginController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'registro':
            if ($method === 'POST') {
                $authController->registroController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'registroAdmin':
            if ($method === 'POST') {
                $authController->registroAdminController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'getUsuarios':
            if ($method === 'GET') {
                $authController->getUsuariosController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'modificarUsuario':
            if ($method === 'POST') {
                $authController->modificarUsuarioController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'eliminarUsuario':
            if ($method === 'POST') {
                $authController->eliminarUsuarioController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'ranking':
            if ($method === 'GET') {
                $authController->getRankingController();
                break;
            }
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido.'
            ]);
            break;


        // ============================================================================
        // Endpoints de juego digital completo
        // ============================================================================
        case 'crearPartida':
            if ($method === 'POST') {
                $partidaController->crearPartidaController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'turno':
            if ($method === 'POST') {
                $partidaController->turnoController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'finalizarRonda':
            if ($method === 'POST') {
                $partidaController->finalizarRondaController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'finalizarPartida':
            if ($method === 'POST') {
                $partidaController->finalizarPartidaController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;


        // ============================================================================
        // Endpoints de modo seguimiento
        // ============================================================================
        case 'crearPartidaSeguimiento':
            if ($method === 'POST') {
                $partidaSeguimientoController->crearPartidaSeguimientoController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'crearBolsaSeguimiento':
            if ($method === 'POST') {
                $partidaSeguimientoController->crearBolsaSeguimientoController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'turnoSeguimiento':
            if ($method === 'POST') {
                $partidaSeguimientoController->turnoSeguimientoController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'finalizarRondaSeguimiento':
            if ($method === 'POST') {
                $partidaSeguimientoController->finalizarRondaSeguimientoController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;

        case 'finalizarPartidaSeguimiento':
            if ($method === 'POST') {
                $partidaSeguimientoController->finalizarPartidaSeguimientoController();
                break;
            }
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
            break;


        // ============================================================================
        // Endpoint de salud
        // ============================================================================
        case 'health':
            $status = 'OK';
            $services = ['database' => ['status' => 'unknown']];

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

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'status' => $status,
                'timestamp' => date('c'),
                'services' => $services,
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