-- =====================================================
-- BASE DE DATOS DRAFTOSAURUS
-- =====================================================
DROP DATABASE IF EXISTS DB_Draftosaurus_Devance;
CREATE DATABASE DB_Draftosaurus_Devance;
USE DB_Draftosaurus_Devance;

-- =====================================================
-- TABLA: USUARIOS
-- =====================================================
CREATE TABLE usuarios (
    id              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario  VARCHAR(50) NOT NULL UNIQUE,
    email           VARCHAR(100) NOT NULL UNIQUE,
    nacimiento      DATE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    admin           BOOLEAN DEFAULT FALSE NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_usuarios_nombre_usuario ON usuarios(nombre_usuario);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- =====================================================
-- TABLA: PARTIDAS
-- =====================================================
CREATE TABLE partidas (
    id                  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    jugador1_id         INT NOT NULL,
    jugador2_id         INT NOT NULL,
    puntaje_jugador1    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    puntaje_jugador2    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    ganador_id          INT DEFAULT NULL,
    estado              ENUM('activa','finalizada') NOT NULL DEFAULT 'activa',
    creado_el           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finalizado_el       TIMESTAMP NULL,
    cara_dado_actual    ENUM('bosque','roca','baño','cafeteria','no-trex','vacio') DEFAULT 'vacio',
    tirador_actual_id   INT DEFAULT NULL,
    turno               TINYINT UNSIGNED NOT NULL DEFAULT 1,
    ronda               TINYINT UNSIGNED NOT NULL DEFAULT 1,

    CONSTRAINT fk_partidas_jugador1  FOREIGN KEY (jugador1_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_partidas_jugador2  FOREIGN KEY (jugador2_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_partidas_ganador   FOREIGN KEY (ganador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_partidas_tirador   FOREIGN KEY (tirador_actual_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_partidas_estado ON partidas(estado);
CREATE INDEX idx_partidas_creado ON partidas(creado_el);
CREATE INDEX idx_partidas_j1 ON partidas(jugador1_id);
CREATE INDEX idx_partidas_j2 ON partidas(jugador2_id);

-- =====================================================
-- TABLA: RANKING DE USUARIOS
-- =====================================================
CREATE TABLE ranking_usuarios (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id         INT NULL,
    usuario_nombre     VARCHAR(50) NOT NULL,
    partidas_jugadas   INT UNSIGNED NOT NULL DEFAULT 0,
    partidas_ganadas   INT UNSIGNED NOT NULL DEFAULT 0,
    
    CONSTRAINT fk_ranking_user 
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- =====================================================
-- TABLA: RECINTOS POR PARTIDA
-- =====================================================
CREATE TABLE recintos_partida (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    partida_id      INT NOT NULL,
    jugador_id      INT NOT NULL,
    recinto         ENUM('bosque-semejanza','pradera-amor','woody-trio','prado-diferencia','rey-jungla','isla-solitaria','rio') DEFAULT NULL,
    tipo_dino       ENUM('t-rex','triceratops','stegosaurus','parasaurolophus','diplodocus','pterodáctilo') DEFAULT NULL,
    colocado_el     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recintos_partida_partida FOREIGN KEY (partida_id) REFERENCES partidas(id) ON DELETE CASCADE,
    CONSTRAINT fk_recintos_partida_jugador FOREIGN KEY (jugador_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLA: BOLSAS
-- =====================================================
CREATE TABLE bolsas (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    partida_id  INT NOT NULL,
    jugador_id  INT NOT NULL,
    dino        ENUM('t-rex','triceratops','stegosaurus','parasaurolophus','diplodocus','pterodáctilo') NOT NULL,

    INDEX idx_bolsa_partida (partida_id),

    CONSTRAINT fk_bolsa_partida FOREIGN KEY (partida_id) REFERENCES partidas(id) ON DELETE CASCADE,
    CONSTRAINT fk_bolsa_jugador FOREIGN KEY (jugador_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

select * from partidas;

-- =====================================================
-- TRIGGER: CREAR RANKING AL INSERTAR USUARIO
-- =====================================================
DELIMITER $$
CREATE TRIGGER trg_usuarios_after_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO ranking_usuarios (usuario_id, usuario_nombre, partidas_jugadas, partidas_ganadas)
    VALUES (NEW.id, NEW.nombre_usuario, 0, 0);
END$$
DELIMITER ;

-- Verifica en tu base de datos:
SELECT dino FROM bolsas where partida_id = 1 and jugador_id = 3;

select * from usuarios;

UPDATE usuarios
SET admin = false
WHERE id = 6;

SELECT recinto, tipo_dino 
                  FROM recintos_partida 
                  WHERE partida_id = 67
                  AND jugador_id = 6;
