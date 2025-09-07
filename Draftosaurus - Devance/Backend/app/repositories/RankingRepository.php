<?php

class RankingRepository
{
    private static ?RankingRepository $instance = null; 

    private mysqli $conn;

    private function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    public static function getInstance(): ?RankingRepository
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    //INSERTS
    

    
    //UPDATES
    public function sumarPartidaJugada(int $user_id) : array
    {
        $query = "UPDATE ranking_usuarios
                  SET partidas_jugadas = partidas_jugadas + 1
                  WHERE usuario_id = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $user_id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        // Chequear filas afectadas
        if ($stmt->affected_rows === 0) {
            throw new Exception("No se encontró ranking para el usuario $user_id");
        }

        $stmt->close();

        return [
            'success' => true,
            'message' => "Partida jugada sumada al ranking del usuario $user_id"
        ];
    }


    //GETS

    public function getColocacionesRepository(int $partida_id, string $jugador): array
    {
        $query = "SELECT recinto, tipo_dino 
                  FROM recintos_partida 
                  WHERE partida_id = ?
                  AND jugador = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("is", $partida_id, $jugador)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $result = $stmt->get_result();
        $colocaciones = [];

        while ($row = $result->fetch_assoc()) {
            $colocaciones[] = $row;
        }

        $stmt->close();

        return $colocaciones;
    
    }
}