<?php


class UsuarioRepository
{

    private static ?UsuarioRepository $instance = null;


    private mysqli $conn;


    private function __construct()
    {

        $this->conn = Database::getInstance()->getConnection();
    }

    public static function getInstance(): ?UsuarioRepository
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    


    //INSERTS
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

    



    //UPDATES
    public function modificarUsuarioRepo(int $usuario_id, string $nombreUsuario, string $email, string $nacimiento): array
    {
        $query = "UPDATE usuarios 
                SET nombre_usuario = ?, 
                    email = ?, 
                    nacimiento = ? 
                WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("sssi", $nombreUsuario, $email, $nacimiento, $usuario_id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $filasModificadas = $stmt->affected_rows;

        $stmt->close();

        if ($filasModificadas === 0) {
            return [
                'success' => false,
                'message' => "No se encontró usuario con id $usuario_id o los datos son idénticos"
            ];
        }

        return [
            'success' => true,
            'message' => "Usuario actualizado correctamente",
            'id'      => $usuario_id
        ];
        
    }


    //GETS
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

        if ($usuario) {
            return [
                'id' => (int)$usuario['id'],
                'nombreUsuario' => $usuario['nombre_usuario'],
                'email' => $usuario['email'],
                'nacimiento' => $usuario['nacimiento'],
                'password' => $usuario['password'],
            ];
        }

        return null;
    }


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

        if ($usuario) {
            return [
                'id' => (int)$usuario['id'],
                'nombreUsuario' => $usuario['nombre_usuario'], // 👈
                'email' => $usuario['email'],
                'nacimiento' => $usuario['nacimiento'],
                'password' => $usuario['password'],
            ];
        }

        return null;
    }


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

        if ($usuario) {
            return [
                'id' => (int)$usuario['id'],
                'nombreUsuario' => $usuario['nombre_usuario'],
                'email' => $usuario['email'],
                'nacimiento' => $usuario['nacimiento'],
                'password' => $usuario['password'],
            ];
        }

        return null;
    }


    public function esAdmin(string $id): bool
    {
        $query = "SELECT admin 
                    FROM usuarios 
                   WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        $stmt->bind_param("i", $id);

        $stmt->execute();
            
        $result = $stmt->get_result();

        $row = $result->fetch_assoc();
            
        $stmt->close();
            
        return (bool)($row['admin'] ?? 0);
    }


    public function getUsuariosRepo(): array
    {
        $query = "SELECT id, nombre_usuario, email, nacimiento, admin FROM usuarios";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return [];
        }

        $stmt->execute();

        $result = $stmt->get_result();

        $usuarios = [];

        while ($row = $result->fetch_assoc()) {
            $usuarios[] = [
                'id' => (int)$row['id'],
                'nombreUsuario' => $row['nombre_usuario'],
                'email' => $row['email'],
                'nacimiento' => $row['nacimiento'],
                'admin' => (bool)$row['admin']
                ];
        }

        $result->free();

        $stmt->close();

        return $usuarios;
    }





    //DELETS
        public function eliminarUsuarioRepo(int $usuario_id): int
    {
        $query = "DELETE FROM usuarios 
                  WHERE id = ?
                  ";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $usuario_id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $filasEliminadas = $stmt->affected_rows;

        $stmt->close();

        if ($filasEliminadas === 0) {
            return [
                'success' => false,
                'message' => "No se encontro usuario con $usuario_id",
            ];
        }

        return $usuario_id;
        
    }


}
