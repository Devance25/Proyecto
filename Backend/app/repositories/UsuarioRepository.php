<?php
/**
 * Responsabilidad:
 *  - Encapsular el acceso a la base de datos para la entidad "users".
 *  - Proveer métodos de consulta e inserción usando consultas preparadas (prepared statements) para evitar SQL Injection.
 *
 * Diseño:
 *  - Singleton: comparte la misma conexión (mysqli) provista por Database.
 */

class UsuarioRepository
{
    /** Instancia única del repositorio. */
    private static ?UsuarioRepository $instance = null; // instancia única

    /** Conexión activa a MySQL (mysqli). */
    private mysqli $conn;

    /**
     * Constructor privado: obtiene la conexión desde Database (Singleton) para reutilizarla.
     */
    private function __construct()
    {
        // Obtenemos la conexión de la capa Database
        $this->conn = Database::getInstance()->getConnection();
    }

    /**
     * Acceso global a la instancia única del repositorio.
     */
    public static function getInstance(): ?UsuarioRepository
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Busca un usuario por email.
     * Retorna un array asociativo con las columnas solicitadas o null si no existe.
     */
    public function buscarPorEmailRepo(string $email)
    {
        $query = "SELECT id,
                         nombre_usuario, 
                         email, 
                         nacimiento, 
                         password 
                    FROM usuarios 
                    WHERE email = ?"
                    ;

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return null; // si falla la preparación, devolvemos null (no revelamos detalles de DB)
        }

        $stmt->bind_param("s", $email); // "s" indica string

        $stmt->execute();

        $result = $stmt->get_result();

        $usuario = $result ? $result->fetch_assoc() : null; // fetch_assoc devuelve array asociativo

        if ($result) {
            $result->free();
        }
        $stmt->close();

        return $usuario ?: null;
    }

    /**
     * Busca un usuario por username.
     */
    public function buscarPorNombreUsuarioRepo(string $nombreUsuario)
    {
        $query = "SELECT id,
                         nombre_usuario, 
                         email, 
                         nacimiento, 
                         password 
                    FROM usuarios 
                    WHERE nombre_usuario = ?"
                    ;

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return null;
        }

        $stmt->bind_param("s", $nombreUsuario);

        $stmt->execute();

        $result = $stmt->get_result();

        $usuario = $result ? $result->fetch_assoc() : null;

        if ($result) {
            $result->free();
        }

        $stmt->close();

        return $usuario ?: null;
    }

    /**
     * Busca un usuario por username o email (cualquiera que coincida).
     */
    public function buscarPorEmailONombreRepo(string $identificador)
    {
        $query = "SELECT id, 
                         nombre_usuario, 
                         email, 
                         nacimiento, 
                         password 
                    FROM usuarios 
                    WHERE nombre_usuario = ? 
                    OR email = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return null;
        }

        $stmt->bind_param("ss", $identificador, $identificador);

        $stmt->execute();

        $result = $stmt->get_result();

        $usuario = $result ? $result->fetch_assoc() : null;

        if ($result) {
            $result->free();
        }

        $stmt->close();

        return $usuario ?: null;
    }

    /**
     * Crea un nuevo usuario y devuelve datos básicos del registro insertado.
     * Importante: la contraseña debe llegar ya hasheada a este método.
     */
    public function registrarUsuarioRepo(string $nombreUsuario, string $email, string $nacimiento, string $hashedPassword)
    {
        $query = "INSERT INTO usuarios 
                            (nombre_usuario,
                             email, 
                             nacimiento, 
                             password) 
                        VALUES (?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return false; // si no se pudo preparar, devolvemos false (fallo genérico)
        }

        $stmt->bind_param("ssss", $nombreUsuario, $email, $nacimiento, $hashedPassword);

        $ok = $stmt->execute();

        if (!$ok) {
            $stmt->close();
            return false;
        }

        $insertId = $stmt->insert_id; // id autoincrement generado

        $stmt->close();

        return [
            'id' => (int)$insertId,
            'nombreUsuario' => $nombreUsuario,
            'email' => $email,
        ];
    }
}
