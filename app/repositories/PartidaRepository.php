<?php

class PartidaRepository
{
    private static ?PartidaRepository $instance = null; 

    private mysqli $conn;

    private function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    public static function getInstance(): ?PartidaRepository
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    //INSERTS
    public function crearPartida(int $jugador1_id, string $jugador2_nombre) : int
    {
        $query = "INSERT INTO partidas (jugador1_id, jugador2_nombre, estado) 
              VALUES (?, ?, 'activa')";
        $stmt = $this->conn->prepare($query);
    
        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("is", $jugador1_id, $jugador2_nombre)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }
    
        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $partida_id = $this->conn->insert_id;
        $stmt->close();
    
        return $partida_id;
    }

    public function colocarDinosaurioRepository(string $jugador, string $recinto, string $tipo_dino, int $partida_id): array
    {
        $query = "INSERT INTO recintos_partida
                              (partida_id, jugador,
                               recinto, tipo_dino)
                  VALUES (?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("isss", $partida_id, $jugador, $recinto, $tipo_dino)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->close();

        return [
            'success' => true,
            'jugador' => $jugador,
            'recinto' => $recinto,
            'tipo_dino' => $tipo_dino,
        ];
    }

    
    //UPDATES

    public function guardarResultadoDado(int $id, string $caraDadoActual, string $tirador): void
    {
        $query = "UPDATE partidas 
                  SET cara_dado_actual = ?, 
                      tirador_actual = ? 
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("ssi", $caraDadoActual, $tirador, $id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->close();
    }

    public function sumarTurnoRepository(int $id): void
    {
        $query = "UPDATE partidas
                  SET turno = turno + 1
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->close();

    }    

    public function sumarRondaRepository(int $id): void
    {
        $query = "UPDATE partidas
                  SET ronda = ronda + 1
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->close();

    }    

    public function resetTurnosRepository(int $id): void
    {
        $query = "UPDATE partidas
                  SET turno = 1
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->close();

    }    

    


    public function finalizarPartida(int $id, int $puntaje_jugador1, int $puntaje_jugador2) : void
    {
        $query = "UPDATE partidas 
                  SET puntaje_jugador1 = ?,
                  puntaje_jugador2 = ?,
                  estado = 'finalizada',
                  finalizado_el = NOW() 
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("iii", $puntaje_jugador1, $puntaje_jugador2, $id)) {
        throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
        throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
        throw new Exception("No se encontró la partida con id = $id o ya estaba finalizada");
        }

        $stmt->close();

    }

        public function cancelarPartida(int $id) : void
    {
        $query = "UPDATE partidas 
                  SET estado = 'cancelada'
                  WHERE id = ? 
                  AND estado IN ('esperando','activa')";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $id)) 
        {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) 
        {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) 
            {
            throw new Exception("No se pudo cancelar: id inexistente o la partida ya estaba finalizada/cancelada.");
        }

        $stmt->close();

    }

    //GETS

    public function getCaraDadoActual(int $id): string
    {
        $query = "SELECT cara_dado_actual 
                  FROM partidas 
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $stmt->bind_result($cara);
        $stmt->fetch();
        
        return $cara;
    }

    public function getTiradorActual(int $id): string
    {
        $query = "SELECT tirador_actual 
                  FROM partidas 
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $stmt->bind_result($tirador);
        $stmt->fetch();
        
        return $tirador;
    }

    public function getTurnoActual(int $id): int
    {
        $query = "SELECT turno 
                  FROM partidas 
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->bind_result($turno);
        $stmt->fetch();
        $stmt->close();

        if (!isset($turno)) {
            throw new Exception("No se encontró la partida con ID: $id");
        }

        return $turno;
    }

    public function getRondaActual(int $id): int
    {
        $query = "SELECT ronda 
                  FROM partidas 
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->bind_result($ronda);
        $stmt->fetch();
        $stmt->close();

        if (!isset($ronda)) {
            throw new Exception("No se encontró la partida con ID: $id");
        }

        return $ronda;
    }

}