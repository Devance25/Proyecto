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
    public function crearPartidaRepo(int $jugador1_id, int $jugador2_id) : int
    {
        $query = "INSERT INTO partidas 
                             (jugador1_id, 
                              jugador2_id, 
                              estado,
                              tirador_actual_id) 
                        VALUES (?, ?, 'activa', ?)"
                        ;

        $stmt = $this->conn->prepare($query);
    
        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("iii", $jugador1_id, $jugador2_id, $jugador1_id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }
    
        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $partida_id = $this->conn->insert_id;

        $stmt->close();
    
        return $partida_id;
    }



    public function crearBolsaRepo(int $partida_id, int $jugador_id, array $bolsaDinos): array
    {
        foreach ($bolsaDinos as $dino) {

            $query = "INSERT INTO bolsas
                                 (partida_id,
                                  jugador_id,
                                  dino
                                  )
                      VALUES (?, ?, ?)";

            $stmt = $this->conn->prepare($query);

            if (!$stmt) {
                throw new Exception("Error preparando la consulta: " . $this->conn->error);
            }

            if (!$stmt->bind_param("iis", $partida_id, $jugador_id, $dino)) {
                throw new Exception("Error en bind_param: " . $stmt->error);
            }

            if (!$stmt->execute()) {
                throw new Exception("Error ejecutando la consulta: " . $stmt->error);
            }

            $stmt->close();

        }   

        return [
            'success'    => true,
            'jugador'    => $jugador_id,
            'bolsaDinos' => $bolsaDinos,
        ];

    }



    public function colocarDinosaurioRepo(int $jugador_id, string $recinto, string $tipo_dino, int $partida_id): array
    {
        $query = "INSERT INTO recintos_partida
                              (partida_id,
                               jugador_id,
                               recinto, 
                               tipo_dino)
                  VALUES (?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("iiss", $partida_id, $jugador_id, $recinto, $tipo_dino)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->close();

        return [
            'success'    => true,
            'partida'    => $partida_id,
            'jugador_id' => $jugador_id,
            'recinto'    => $recinto,
            'tipo_dino'  => $tipo_dino,
        ];
    }

    



    //UPDATES
    public function tirarDadoRepo(int $partida_id, string $caraDadoActual, int $tirador_id): void
    {
        $query = "UPDATE partidas 
                     SET cara_dado_actual = ?, 
                        tirador_actual_id = ? 
                   WHERE id = ?";

        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("sii", $caraDadoActual, $tirador_id, $partida_id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->close();
    }



    public function sumarTurnoRepo(int $id): void
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



    public function sumarRondaRepo(int $id): void
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



    public function resetTurnosRepo(int $id): void
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
    
    


    public function sumarPartidaJugadaRepo(int $usuario_id) : array
    {
        $query = "UPDATE ranking_usuarios
                     SET partidas_jugadas = partidas_jugadas + 1
                   WHERE usuario_id = ?";

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

        if ($stmt->affected_rows === 0) {
            throw new Exception("No se encontró ranking para el usuario $usuario_id");
        }

        $stmt->close();

        return [
            'success' => true,
            'message' => "Partida jugada sumada al ranking del usuario $usuario_id"
        ];
    }



    public function sumarPartidaGanadaRepo(int $usuario_id) : array
    {
        $query = "UPDATE ranking_usuarios
                     SET partidas_ganadas = partidas_ganadas + 1
                   WHERE usuario_id = ?";

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

        // Chequear filas afectadas
        if ($stmt->affected_rows === 0) {
            throw new Exception("No se encontró ranking para el usuario $usuario_id");
        }

        $stmt->close();

        return [
            'success' => true,
            'message' => "Partida ganada sumada al ranking del usuario $usuario_id"
        ];
    }

    


    public function finalizarPartidaRepo(int $partida_id, int $puntajeJugador1, int $puntajeJugador2, ?int $ganador_id) : void
    {
        $query = "UPDATE partidas 
                     SET puntaje_jugador1 = ?,
                         puntaje_jugador2 = ?,
                               ganador_id = ?,
                                   estado = 'finalizada',
                            finalizado_el = NOW() 
                   WHERE id = ?";

        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("iiii", $puntajeJugador1, $puntajeJugador2, $ganador_id, $partida_id)) {
        throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
        throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
        throw new Exception("No se encontró la partida con id = $partida_id o ya estaba finalizada");
        }

        $stmt->close();

    }





    //GETS
    public function getCaraDadoActualRepo(int $id): string
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



    public function getTiradorActualRepo(int $id): int
    {
        $query = "SELECT tirador_actual_id 
                  FROM partidas 
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        $stmt->bind_param("i", $id);

        $stmt->execute();
        
        $stmt->bind_result($tirador);

        $stmt->fetch();
        
        return $tirador;
    }



    public function getTurnoActualRepo(int $id): int
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



    public function getRondaActualRepo(int $id): int
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



    public function getPartidaRepo(int $id): bool
    {
        $query = "SELECT 1 
                  FROM partidas 
                  WHERE id = ? 
                  LIMIT 1
                  ";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
           throw new Exception("Error preparando verificación de partida: " . $this->conn->error);
        }

        $stmt->bind_param("i", $id);

        $stmt->execute();

        $stmt->store_result();

        $existe = $stmt->num_rows > 0;

        $stmt->close();

        return $existe;
    }



    public function getNombreJugadorRepo(int $id): string
    {
        $query = "SELECT nombre_usuario 
                  FROM usuarios 
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

        $stmt->bind_result($nombreUsuario);
        $stmt->fetch();
        $stmt->close();

        if (!isset($nombreUsuario)) {
            throw new Exception("No se encontró el usuario con ID: $id");
        }

        return $nombreUsuario;
    }



    public function getJugador1IdRepo(int $partida_id): int
    {
        $query = "SELECT jugador1_id 
                  FROM partidas 
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $partida_id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->bind_result($jugador1_id);
        $stmt->fetch();
        $stmt->close();

        if ($jugador1_id === null) {
            throw new Exception("No se encontró la partida con ID: $partida_id");
        }

        return $jugador1_id;
    }



    public function getJugador2IdRepo(int $partida_id): int
    {
        $query = "SELECT jugador2_id 
                  FROM partidas 
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("i", $partida_id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $stmt->bind_result($jugador2_id);
        $stmt->fetch();
        $stmt->close();

        if ($jugador2_id === null) {
            throw new Exception("No se encontró la partida con ID: $partida_id");
        }

        return $jugador2_id;
    }
             

                                                        

    public function getBolsa(int $partida_id, int $jugador_id): array
    {
        $query = "SELECT dino 
                    FROM bolsas 
                   WHERE partida_id = ? 
                     AND jugador_id = ?
                     ";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("ii", $partida_id, $jugador_id)) {
            throw new Exception("Error en bind_param: " . $stmt->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Error ejecutando la consulta: " . $stmt->error);
        }

        $result = $stmt->get_result();
        $dinos = [];

        while ($row = $result->fetch_assoc()) {
            $dinos[] = $row['dino'];
        }

        $stmt->close();

        if (empty($dinos)) {
            throw new Exception("La bolsa del jugador está vacía.");
        }

        return $dinos;
    }



    public function getColocacionesRepo(int $partida_id, int $jugador_id): array
    {
        $query = "SELECT recinto, tipo_dino 
                  FROM recintos_partida 
                  WHERE partida_id = ?
                  AND jugador_id = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("ii", $partida_id, $jugador_id)) {
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






    //DELETS
    public function descartarDinoRepo(int $partida_id, int $jugador_id, string $dino): array
    {
        $query = "DELETE FROM bolsas 
                  WHERE partida_id = ?
                  AND   dino = ?
                  AND   jugador_id = ?
                  LIMIT 1
                  ";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Error preparando la consulta: " . $this->conn->error);
        }

        if (!$stmt->bind_param("isi", $partida_id, $dino, $jugador_id)) {
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
                'message' => "No se encontró el dino '$dino' en la bolsa de $jugador_id"
            ];
        }

        return [
            'success' => true,
            'dino_descartado' => $dino,
            ];
    }


}