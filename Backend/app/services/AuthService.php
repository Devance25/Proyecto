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


    public function registrarUsuarioAdminService(string $nombreUsuario, string $email, string $nacimiento,string $password): array
    {
        $nombreUsuario = trim($nombreUsuario);
        $email = trim($email);
        $nacimiento = trim($nacimiento);
        $password = (string)$password;


        if ($nombreUsuario === '' || $email === '' || $nacimiento === '' || $password === '') {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Username, email y contraseña son requeridos.'
                ];
        }


        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Email inválido.'
                ];
        }


        if (strlen($nombreUsuario) < 3) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'El username debe tener al menos 3 caracteres.'
                ];
        }


        if (strlen($password) < 6) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La contraseña debe tener al menos 6 caracteres.'
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


    public function registrarUsuarioService(string $nombreUsuario, string $email, string $nacimiento, string $password, string $passwordConfirm): array
    {
        $nombreUsuario = trim($nombreUsuario);
        $email = trim($email);
        $nacimiento = trim($nacimiento);
        $password = (string)$password;
        $passwordConfirm = (string)$passwordConfirm;

        if ($nombreUsuario === '' || $email === '' || $nacimiento === '' || $password === '' || $passwordConfirm === '') {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Todos los campos son requeridos.'
            ];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Email inválido.'
            ];
        }

        if (strlen($nombreUsuario) < 3) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'El username debe tener al menos 3 caracteres.'
            ];
        }

        if (strlen($password) < 6) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'La contraseña debe tener al menos 6 caracteres.'
            ];
        }

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
                'nacimiento' => $nacimiento
            ],
        ];
    }



    private function verificarCredencialesService(string $identificador, string $plainPassword)
    {

        $usuario = $this->usuarioRepo->buscarPorEmailONombreRepo($identificador);


        if (!$usuario || !isset($usuario['password']) || !is_string($usuario['password'])) {
            return false;
        }


        if (!password_verify($plainPassword, $usuario['password'])) {
            return false;
        }


        return [
            'id' => (int)$usuario['id'],
            'nombreUsuario' => $usuario['nombreUsuario'] ?? null,
            'email' => $usuario['email'],
        ];
    }



    
    public function loginService(string $identificador, string $password): array
    {   
        
        $basicUser = $this->verificarCredencialesService($identificador, $password);
        if ($basicUser === false) {
            return [
                'success' => false, 
                'message' => 'Credenciales incorrectas.'];
        }

        $esAdmin = $this->usuarioRepo->esAdmin($basicUser['id']);

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

    public function getUsuariosService(): array
    {
        $usuarios = $this->usuarioRepo->getUsuariosRepo(); 

        return $usuarios;
    }



    public function modificarUsuarioService(int $usuario_id, string $nombre, string $email, string $nacimiento): array
    {

         $usuarioModificado = $this->usuarioRepo->modificarUsuarioRepo($usuario_id, $nombre, $email, $nacimiento);

         return [
            'nombre' => $nombre,
            'usuarioModificado' => $usuarioModificado
         ];

    }




    public function eliminarUsuarioService(int $usuario_id): array
    {
        if ($usuario_id <= 0) {
            return [
                'success' => false,
                'message' => 'ID inválido'
            ];
        }

        $resultado = $this->usuarioRepo->eliminarUsuarioRepo($usuario_id);

        if ($resultado) {
            return [
                'success' => true,
                'message' => 'Usuario eliminado correctamente',
                'id' => $usuario_id
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No se pudo eliminar el usuario'
            ];
        }
    }

}
