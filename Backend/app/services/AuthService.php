<?php
/**
 * Responsabilidad:
 *  - Implementar la lógica de negocio para autenticación: registro y login.
 *  - Coordinar validaciones de negocio y llamar al repositorio de usuarios.
 *
 * Diseño:
 *  - Singleton: una sola instancia del servicio durante la ejecución.
 *  - El servicio NO conoce detalles de HTTP, retorna arrays que luego el controlador traduce.
 */

class AuthService
{
    /** Instancia única del servicio (patrón Singleton). */
    private static ?AuthService $instance = null; // instancia única

    /** Repositorio encargado del acceso a datos. */
    private ?UsuarioRepository $usuarioRepo;

    /**
     * Constructor privado: se inicializa el repositorio a utilizar.
     * Notar que UserRepository también es un Singleton y, a su vez, utiliza Database.
     */
    private function __construct()
    {
        // Inyectamos/obtenemos la dependencia del repositorio mediante su Singleton
        $this->usuarioRepo = UsuarioRepository::getInstance();
    }

    /**
     * Punto de acceso global a la instancia del servicio.
     */
    public static function getInstance(): ?AuthService
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Registra un nuevo usuario.
     * Flujo general:
     *  1) Normalizar/validar datos (username/email/password).
     *  2) Verificar duplicados (username y email).
     *  3) Hashear contraseña con password_hash.
     *  4) Delegar la creación al repositorio.
     * Devuelve un array con success, message y datos del usuario creado (sin contraseña).
     */
    public function registrarUsuarioService(string $nombreUsuario, string $email, string $nacimiento,string $password, string $passwordConfirm): array
    {
        $nombreUsuario = trim($nombreUsuario);
        $email = trim($email);
        $nacimiento = trim($nacimiento);
        $password = (string)$password;
        $passwordConfirm = (string)$passwordConfirm;

        // Validación de presencia
        if ($nombreUsuario === '' || $email === '' || $nacimiento === '' || $password === '' || $passwordConfirm === '') {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Username, email y contraseña son requeridos.'
                ];
        }

        // Validación de formato de email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Email inválido.'
                ];
        }

        // Validaciones simples adicionales (puedes endurecerlas según tu caso real)
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

        if ($password !== $passwordConfirm){
            return [
                'success' => false, 
                'code' => 'invalid', 
                'message' => 'Las contrasenias no coinciden.'
                ];
        }

        // Verificar duplicados por username
        $usuarioExiste = $this->usuarioRepo->buscarPorNombreUsuarioRepo($nombreUsuario);
        if ($usuarioExiste) {
            return [
                'success' => false, 
                'code' => 'duplicate', 
                'message' => 'El username ya está registrado.'
            ];
        }

        // Verificar duplicados por email
        $emailExiste = $this->usuarioRepo->buscarPorEmailRepo($email);

        if ($emailExiste) {
            return [
                'success' => false, 
                'code' => 'duplicate', 
                'message' => 'El email ya está registrado.'
                ];
        }

        // Hashear contraseña (PASSWORD_DEFAULT elige el algoritmo recomendado por PHP en tu versión)
        $hash = password_hash($password, PASSWORD_DEFAULT);

        if ($hash === false) {
            return [
                'success' => false, 
                'code' => 'error', 
                'message' => 'No se pudo procesar la contraseña.'
                ];
        }

        // Crear el usuario
        $created = $this->usuarioRepo->registrarUsuarioRepo($nombreUsuario, $email, $nacimiento, $hash);

        if ($created === false) {
            // Podría fallar por restricciones únicas u otros motivos
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

    /**
     * Verifica credenciales (usuario puede identificarse con username o email).
     * Retorna false si no coincide, o un arreglo con datos no sensibles si es correcto.
     */
    private function verificarCredenciales(string $identificador, string $plainPassword)
    {
        // Busca el usuario por username o email
        $usuario = $this->usuarioRepo->buscarPorEmailONombreRepo($identificador);

        // Validación de existencia y estructura mínima
        if (!$usuario || !isset($usuario['password']) || !is_string($usuario['password'])) {
            return false;
        }

        // Compara contraseña en texto plano con el hash almacenado
        if (!password_verify($plainPassword, $usuario['password'])) {
            return false;
        }

        // Datos mínimos para identificar la sesión/usuario (sin password)
        return [
            'id' => (int)$usuario['id'],
            'nombreUsuario' => $usuario['nombre_usuario'] ?? null,
            'email' => $usuario['email'],
        ];
    }

    /**
     * Autenticación (login) usando email o username como identificador.
     */
    public function login(string $identificador, string $password): array
    {
        $basicUser = $this->verificarCredenciales($identificador, $password);
        if ($basicUser === false) {
            return [
                'success' => false, 
                'message' => 'Credenciales incorrectas.'];
        }

        return [
            'success' => true,
            'message' => 'Login exitoso.',
            'user' => [
                'id' => $basicUser['id'],
                'email' => $basicUser['email'],
                'nombreUsuario' => $basicUser['nombreUsuario'],
            ],
        ];
    }
}
