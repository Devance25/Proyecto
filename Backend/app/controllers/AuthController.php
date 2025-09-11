<?php


class AuthController
{

    private $authService;

    public function __construct()
    {

        $this->authService = AuthService::getInstance();
    }




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

        // Sanitiza/normaliza datos (trim para quitar espacios a los extremos)
        if (isset($data['nombreUsuario'])) {
            $nombreUsuario = trim((string)$data['nombreUsuario']);
        } else {  
            $nombreUsuario = '';
        }

        if (isset($data['email'])){
            $email = trim((string)$data['email']);
        } else {
            $email = '';
        }

        if (isset($data['nacimiento'])){
            $nacimiento = trim((string)$data ['nacimiento']);
        } else {
            $nacimiento = '';
        }

        if (isset($data['password'])){
            $password = trim((string)$data ['password']);
        } else {
            $password = '';
        }

        if (isset($data['passwordConfirm'])){
            $passwordConfirm = trim((string)$data ['passwordConfirm']);
        } else {
            $passwordConfirm = '';
        }

        $validacionErrores = [];

        // Validación mínima de presencia de campos
        if ($nombreUsuario === '' || $email === '' || $nacimiento === '' || $password === '' || $passwordConfirm === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Todos los campos son requeridos.'
            ]);
            return;
        }

        // Validación de nombre de usuario
        if (strlen($nombreUsuario) < 3 || strlen($nombreUsuario) > 15) {
            $validacionErrores[] = 'El nombre de usuario debe tener entre 3 y 15 caracteres.';
        }


        // Validación de email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $validacionErrores[] = 'El email no tiene un formato válido.';
        }

        if (strlen($email) > 254) {
            $validacionErrores[] = 'El email no puede exceder 254 caracteres.';
        }

        // Validación de fecha de nacimiento
        $fechaNacimiento = DateTime::createFromFormat('Y-m-d', $nacimiento);


        if (!$fechaNacimiento || $fechaNacimiento->format('Y-m-d') !== $nacimiento) {
            $validacionErrores[] = 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.';
        } else {
            // Verificar que no sea fecha futura
            $hoy = new DateTime();
            if ($fechaNacimiento > $hoy) {
                $validacionErrores[] = 'La fecha de nacimiento no puede ser futura.';
            }

            // Verificar edad mínima (8 años)
            $edad = $hoy->diff($fechaNacimiento)->y;
            if ($edad < 8) {
                $validacionErrores[] = 'Debes tener al menos 8 años para registrarte.';
            }
        }

        // Validación de contraseña
        if (strlen($password) < 6) {
            $validacionErrores[] = 'La contraseña debe tener al menos 6 caracteres.';
        }

        if (strlen($password) > 50) {
            $validacionErrores[] = 'La contraseña no puede exceder 50 caracteres.';
        }

        // Verificar que contenga al menos una letra y un número
        if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)/', $password)) {
            $validacionErrores[] = 'La contraseña debe contener al menos una letra y un número.';
        }

        // Validación de confirmación de contraseña
        if ($password !== $passwordConfirm) {
            $validacionErrores[] = 'Las contraseñas no coinciden.';
        }

        // Si hay errores de validación, retornar
        if (!empty($validacionErrores)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => implode(' ', $validacionErrores)
            ]);
            return;
        }

        // Delegamos la creación al servicio
        $result = $this->authService->registrarUsuarioService($nombreUsuario, $email, $nacimiento, $password, $passwordConfirm);

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

        // Sanitiza/normaliza datos (trim para quitar espacios a los extremos)
        if (isset($data['nombreUsuario'])) {
            $nombreUsuario = trim((string)$data['nombreUsuario']);
        } else {  
            $nombreUsuario = '';
        }

        if (isset($data['email'])){
            $email = trim((string)$data['email']);
        } else {
            $email = '';
        }

        if (isset($data['nacimiento'])){
            $nacimiento = trim((string)$data ['nacimiento']);
        } else {
            $nacimiento = '';
        }

        if (isset($data['password'])){
            $password = trim((string)$data ['password']);
        } else {
            $password = '';
        }


        $validacionErrores = [];

        // Validación mínima de presencia de campos
        if ($nombreUsuario === '' || $email === '' || $nacimiento === '' || $password === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Todos los campos son requeridos.'
            ]);
            return;
        }

        // Validación de nombre de usuario
        if (strlen($nombreUsuario) < 3 || strlen($nombreUsuario) > 15) {
            $validacionErrores[] = 'El nombre de usuario debe tener entre 3 y 15 caracteres.';
        }


        // Validación de email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $validacionErrores[] = 'El email no tiene un formato válido.';
        }

        if (strlen($email) > 254) {
            $validacionErrores[] = 'El email no puede exceder 254 caracteres.';
        }

        // Validación de fecha de nacimiento
        $fechaNacimiento = DateTime::createFromFormat('Y-m-d', $nacimiento);


        if (!$fechaNacimiento || $fechaNacimiento->format('Y-m-d') !== $nacimiento) {
            $validacionErrores[] = 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.';
        } else {
            // Verificar que no sea fecha futura
            $hoy = new DateTime();
            if ($fechaNacimiento > $hoy) {
                $validacionErrores[] = 'La fecha de nacimiento no puede ser futura.';
            }

            // Verificar edad mínima (8 años)
            $edad = $hoy->diff($fechaNacimiento)->y;
            if ($edad < 8) {
                $validacionErrores[] = 'Debes tener al menos 8 años para registrarte.';
            }
        }

        // Validación de contraseña
        if (strlen($password) < 6) {
            $validacionErrores[] = 'La contraseña debe tener al menos 6 caracteres.';
        }

        if (strlen($password) > 50) {
            $validacionErrores[] = 'La contraseña no puede exceder 50 caracteres.';
        }

        // Verificar que contenga al menos una letra y un número
        if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)/', $password)) {
            $validacionErrores[] = 'La contraseña debe contener al menos una letra y un número.';
        }


        // Si hay errores de validación, retornar
        if (!empty($validacionErrores)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => implode(' ', $validacionErrores)
            ]);
            return;
        }

        // Delegamos la creación al servicio
        $result = $this->authService->registrarUsuarioAdminService($nombreUsuario, $email, $nacimiento, $password);

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

        $identificador = $data['identificador'] ?? ($data['email'] ?? ($data['nombreUsuario'] ?? null));
        $password = $data['password'] ?? null;

        if (!$identificador || !$password) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Identificador (email o username) y contraseña son requeridos.'
            ]);
            return;
        }

        $identificador = trim((string)$identificador);
        $password = (string)$password;

        if ($identificador === '' || $password === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Identificador y contraseña no pueden estar vacíos.'
            ]);
            return;
        }

        $validacionErrores = [];

        if (strlen($identificador) < 3) {
            $validacionErrores[] = 'El identificador debe tener al menos 3 caracteres.';
        }

        if (strlen($password) < 6) {
            $validacionErrores[] = 'La contraseña debe tener al menos 6 caracteres.';
        }

        if (!empty($validacionErrores)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => implode(' ', $validacionErrores)
            ]);
            return;
        }


        $result = $this->authService->loginService($identificador, $password);

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

        $usuario_id = $data['id'] ?? null;
        $nombre = trim($data['nombreUsuario'] ?? '');
        $email = trim($data['email'] ?? '');
        $nacimiento = trim($data['nacimiento'] ?? '');




        if ($usuario_id <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'ID de usuario inválido.'
            ]);
            return;
        }

        if ($nombre === '' || $email === '' || $nacimiento === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Todos los campos son obligatorios.'
            ]);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Email inválido.'
            ]);
            return;
        }

        if (strlen($nombre) < 3) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'El nombre de usuario debe tener al menos 3 caracteres.'
            ]);
            return;
        }

        $usuarioModificado = $this->authService->modificarUsuarioService($usuario_id, $nombre, $email, $nacimiento);

        echo json_encode([
            'success' => true,
            'message' => $usuarioModificado,
        ]);
    }



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

        $usuario_id = $data['id'] ?? null;

        if (!$usuario_id) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Identificador (email o username) y contraseña son requeridos.'
            ]);
            return;
        }
        

        if ($usuario_id <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Identificador y contraseña no pueden estar vacíos.'
            ]);
            return;
        }

        
        $result = $this->authService->eliminarUsuarioService($usuario_id);

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




}