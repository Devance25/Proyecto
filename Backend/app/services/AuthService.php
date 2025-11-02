<?php

class AuthService
{
    private static ?AuthService $instance = null;

    private ?UsuarioRepository $usuarioRepo;


    private function __construct()
    {

        $this->usuarioRepo = UsuarioRepository::getInstance();
    }

    public static function getInstance(): ?AuthService
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function registrarUsuarioAdminService(RegistroAdminDTO $dto): array
    {
        $nombreUsuario = $dto->nombreUsuario;
        $email = $dto->email;
        $nacimiento = $dto->nacimiento;
        $password = $dto->password;

        // Validación mínima de presencia de campos
        if ($nombreUsuario === '' || $email === '' || $nacimiento === '' || $password === '') {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Username, email y contraseña son requeridos.'
                ];
        }

        // Validación de nombre de usuario
        if (strlen($nombreUsuario) < 3 || strlen($nombreUsuario) > 15) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'El nombre de usuario debe tener entre 3 y 15 caracteres.'
                ];
        }
        // Validación de email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Email inválido.'
                ];
        }
        if (strlen($email) > 254) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'El email no puede exceder 254 caracteres.'
            ];
        }

        // Validación de contraseña
        if (strlen($password) < 6 || strlen($password) > 50) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La contraseña debe tener al menos 6 caracteres y no puede exceder los 50 caracteres.'
            ];
        }
        // Verificar que contenga al menos una letra y un número
        if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)/', $dto->password)) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La contraseña debe contener al menos una letra y un número.'
            ];
        }

        // Validación de fecha de nacimiento
        $fechaNacimiento = DateTime::createFromFormat('Y-m-d', $nacimiento);
         if (!$fechaNacimiento || $fechaNacimiento->format('Y-m-d') !== $nacimiento) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.'
            ];
        } else {
            // Verificar que no sea fecha futura
            $hoy = new DateTime();
            if ($nacimiento > $hoy) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La fecha de nacimiento no puede ser futura.'
            ];
            }
            // Verificar edad mínima (18 años)
            $edad = $hoy->diff($fechaNacimiento)->y;
            if ($edad < 18) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Debes tener al menos 18 años para registrarte.'
            ];
            }
        }

        $usuarioExiste = $this->usuarioRepo->buscarPorNombreUsuarioRepo($nombreUsuario);
        if ($usuarioExiste) {
            return [
                'success' => false, 
                'code' => 'duplicate', 
                'message' => 'El username ya está registrado.'
            ];
        }

        $emailExiste = $this->usuarioRepo->buscarPorEmailRepo($email);
        if ($emailExiste) {
            return [
                'success' => false, 
                'code' => 'duplicate', 
                'message' => 'El email ya está registrado.'
                ];
        }


        $hash = password_hash($password, PASSWORD_DEFAULT);
        if ($hash === false) {
            return [
                'success' => false, 
                'code' => 'error', 
                'message' => 'No se pudo procesar la contraseña.'
                ];
        }


        $created = $this->usuarioRepo->registrarUsuarioRepo($nombreUsuario, $email, $nacimiento, $hash);
        if ($created === false) {

            return [
                'success' => false, 
                'code' => 'error', 
                'message' => 'No se pudo crear el usuario.'
                ];
        }

        return [
            'success' => true,
            'message' => 'Usuario creado exitosamente.',
            'usuario' => [
                'id' => (int)$created['id'],
                'nombreUsuario' => $created['nombreUsuario'],
                'email' => $created['email'],
            ],
        ];
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function registrarUsuarioService(RegistroDTO $dto): array
    {
        $nombreUsuario = $dto->nombreUsuario;
        $email = $dto->email;
        $nacimiento = $dto->nacimiento;
        $password = $dto->password;
        $passwordConfirm = $dto->passwordConfirm;

        // Validación mínima de presencia de campos
        if ($nombreUsuario === '' || $email === '' || $nacimiento === '' || $password === '' || $passwordConfirm === '') {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Todos los campos son requeridos.'
            ];
        }

        // Validación de nombre de usuario (validar maximo!!!)
        if (strlen($nombreUsuario) < 3 || strlen($nombreUsuario) > 15) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'El nombre de usuario debe tener entre 3 y 15 caracteres.'
            ];
        }

        // Validación de email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'El email no tiene un formato válido.'
            ];
        }
        if (strlen($email) > 254) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'El email no puede exceder 254 caracteres.'
            ];
        }
        $emailExiste = $this->usuarioRepo->buscarPorEmailRepo($email);
        if ($emailExiste) {
            return [
                'success' => false, 
                'code' => 'duplicate', 
                'message' => 'El email ya está registrado.'
            ];
        }

        // Validación de fecha de nacimiento
        $fechaNacimiento = DateTime::createFromFormat('Y-m-d', $nacimiento);
         if (!$fechaNacimiento || $fechaNacimiento->format('Y-m-d') !== $nacimiento) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.'
            ];
        } else {
            // Verificar que no sea fecha futura
            $hoy = new DateTime();
            if ($nacimiento > $hoy) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La fecha de nacimiento no puede ser futura.'
            ];
            }
            // Verificar edad mínima (18 años)
            $edad = $hoy->diff($fechaNacimiento)->y;
            if ($edad < 18) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Debes tener al menos 18 años para registrarte.'
            ];
            }
        }

        // Validación de contraseña
        if (strlen($password) < 6 || strlen($password) > 50) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La contraseña debe tener al menos 6 caracteres y no puede exceder los 50 caracteres.'
            ];
        }
        // Verificar que contenga al menos una letra y un número
        if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)/', $dto->password)) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La contraseña debe contener al menos una letra y un número.'
            ];
        }

        // Validación de confirmación de contraseña
        if ($password !== $passwordConfirm) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Las contraseñas no coinciden.'
            ];
        }

        $usuarioExiste = $this->usuarioRepo->buscarPorNombreUsuarioRepo($nombreUsuario);
        if ($usuarioExiste) {
            return [
                'success' => false, 
                'code' => 'duplicate', 
                'message' => 'El username ya está registrado.'
            ];
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        if ($hash === false) {
            return [
                'success' => false, 
                'code' => 'error', 
                'message' => 'No se pudo procesar la contraseña.'
            ];
        }

        $created = $this->usuarioRepo->registrarUsuarioRepo($nombreUsuario, $email, $nacimiento, $hash);
        if ($created === false) {
            return [
                'success' => false, 
                'code' => 'error', 
                'message' => 'No se pudo crear el usuario.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Usuario creado exitosamente.',
            'usuario' => [
                'id' => (int)$created['id'],
                'nombreUsuario' => $created['nombreUsuario'],
                'email' => $created['email'],
                'nacimiento' => $nacimiento
            ],
        ];
    }
/*============================================================================================================*/

/*============================================================================================================*/
    private function verificarCredencialesService(LoginDTO $dto)
    {

        $usuario = $this->usuarioRepo->buscarPorEmailONombreRepo($dto->identificador);


        if (!$usuario || !isset($usuario['password']) || !is_string($usuario['password'])) {
            return false;
        }


        if (!password_verify($dto->password, $usuario['password'])) {
            return false;
        }


        return [
            'id' => (int)$usuario['id'],
            'nombreUsuario' => $usuario['nombreUsuario'] ?? null,
            'email' => $usuario['email'],
        ];
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function loginService(LoginDTO $dto): array
    {   
        
         if (!$dto->identificador || !$dto->password) {
            http_response_code(400);
            return [
                'success' => false,
                'code' => 'CAMPOS_FALTANTES',
                'message' => 'Identificador (email o username) y contraseña son requeridos.'
            ];
        }

        if ($dto->identificador === '' || $dto->password === '') {
            http_response_code(400);
            return[
                'success' => false,
                'code' => 'CAMPOS_FALTANTES',
                'message' => 'Identificador y contraseña no pueden estar vacíos.'
            ];
            
        }

         $basicUser = $this->verificarCredencialesService($dto);

        if (strlen($dto->identificador) < 3) {
            http_response_code(400);
            return[
                'success' => false,
                'code' => 'CAMPOS_INCOMPLETOS',
                'message' => 'El identificador debe tener al menos 3 caracteres.'
            ];
        }

         if (strlen($dto->password) < 6) {
            http_response_code(400);
            return[
                'success' => false,
                'code' => 'CAMPOS_INCOMPLETOS',
                'message' => 'La contraseña debe tener al menos 6 caracteres.'
            ];
        }

        if ($basicUser === false) {
            http_response_code(401);
            return [
                'success' => false, 
                'message' => 'Credenciales incorrectas.'];
        }

        $esAdmin = $this->usuarioRepo->esAdmin($basicUser['id']);
        http_response_code(200);
        return [
            'success' => true,
            'message' => 'Login exitoso.',
            'user' => [
                'id' => $basicUser['id'],
                'email' => $basicUser['email'],
                'nombreUsuario' => $basicUser['nombreUsuario'],
                'esAdmin' => $esAdmin,
            ],
        ];
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function getUsuariosService(): array
    {
        $usuarios = $this->usuarioRepo->getUsuariosRepo(); 

        return $usuarios;
    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function modificarUsuarioService(ModificaUsuarioDTO $dto): array
    {
         if ($dto->usuario_id <= 0) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'ID de usuario inválido.',
                'id' => $dto->usuario_id
            ];
            
        }

        if ($dto->nombre === '' || $dto->email === '' || $dto->nacimiento === '') {
            http_response_code(400);
            return[
                'success' => false,
                'message' => 'Todos los campos son obligatorios.'
            ];
            
        }

        if (!filter_var($dto->email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            return[
                'success' => false,
                'message' => 'Email inválido.'
            ];
            
        }

        if (strlen($dto->nombre) < 3) {
            http_response_code(400);
            return[
                'success' => false,
                'message' => 'El nombre de usuario debe tener al menos 3 caracteres.'
            ];
            
        }

         $usuarioModificado = $this->usuarioRepo->modificarUsuarioRepo($dto->usuario_id, $dto->nombre, $dto->email, $dto->nacimiento);

         return [
            'nombre' => $dto->nombre,
            'usuarioModificado' => $usuarioModificado
         ];

    }
/*============================================================================================================*/

/*============================================================================================================*/
    public function eliminarUsuarioService(EliminaUsuarioDTO $dto): array
    { 

        if ($dto->usuario_id <= 0) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'Identificador y contraseña no pueden estar vacíos.'
            ];
        }

        if ($dto->usuario_id <= 0) {
            return [
                'success' => false,
                'message' => 'ID inválido'
            ];
        }

        $resultado = $this->usuarioRepo->eliminarUsuarioRepo($dto);

        if ($resultado) {
            return [
                'success' => true,
                'message' => 'Usuario eliminado correctamente',
                'id' => $dto->usuario_id
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No se pudo eliminar el usuario'
            ];
        }
    }

}
