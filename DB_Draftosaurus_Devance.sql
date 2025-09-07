CREATE DATABASE DB_Draftosaurus_Devance;

USE DB_Draftosaurus_Devance;

-- Usuarios
CREATE TABLE users (
  id 				 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username   		 VARCHAR(50)  NOT NULL UNIQUE,
  email      		 VARCHAR(100) NOT NULL UNIQUE,
  nacimiento 		 DATE NOT NULL,
  password   		 VARCHAR(255) NOT NULL,
  created_at 		 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB 	 DEFAULT CHARSET=utf8mb4;



-- Patidas
CREATE TABLE partidas (
  id                 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  jugador1_id        INT NOT NULL,               -- anfitrión/creador (registrado)
  jugador2_nombre    VARCHAR(50) NOT NULL,       -- invitado (no registrado)
  puntaje_jugador1   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  puntaje_jugador2   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  estado             ENUM(
	'activa',
    'finalizada',
    'cancelada'
    )NOT NULL DEFAULT 'activa',
  creado_el          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finalizado_el      TIMESTAMP NULL,
  cara_dado_actual 	 ENUM(
    'bosque',
    'pradera',
    'rio',
    'cafeteria',
    'izquierda',
    'derecha'
)                    DEFAULT NULL,
  tirador_actual 	 VARCHAR(10) DEFAULT NULL,
  turno 			 TINYINT UNSIGNED NOT NULL DEFAULT 1,
  ronda 			 TINYINT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT fk_partidas_jugador1
    FOREIGN KEY (jugador1_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT chk_j2_nombre_no_vacio
    CHECK (CHAR_LENGTH(jugador2_nombre) > 0),
    CONSTRAINT chk_tirador_valido
CHECK (tirador IN ('jugador1', 'jugador2'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




-- Índices útiles para consultas frecuentes
CREATE INDEX idx_partidas_estado   ON partidas(estado);
CREATE INDEX idx_partidas_creado   ON partidas(creado_el);
CREATE INDEX idx_partidas_j1       ON partidas(jugador1_id);




-- Ranking
CREATE TABLE ranking_usuarios (
  usuario_id         INT NOT NULL PRIMARY KEY,
  partidas_jugadas   INT UNSIGNED NOT NULL DEFAULT 0,
  partidas_ganadas   INT UNSIGNED NOT NULL DEFAULT 0,
  puntaje_total      INT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_ranking_user 
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




-- Recintos
CREATE TABLE recintos_partida (
  id 				 INT AUTO_INCREMENT PRIMARY KEY,
  partida_id 		 INT NOT NULL,
  jugador 			 VARCHAR(10) NOT NULL, -- 'jugador1' o 'jugador2'
  recinto 			 VARCHAR(50) NOT NULL, -- ej: 'bosque', 'cafeteria', etc.
  tipo_dino 		 VARCHAR(50) NOT NULL, -- ej: 'triceratops', 't-rex'
  turno 			 TINYINT UNSIGNED NOT NULL,
  colocado_el 		 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_recintos_partida_partida
    FOREIGN KEY (partida_id) REFERENCES partidas(id) ON DELETE CASCADE,

  CONSTRAINT chk_jugador_valido
    CHECK (jugador IN ('jugador1', 'jugador2'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




-- Bolsa
CREATE TABLE bolsas (
  id 				 INT AUTO_INCREMENT PRIMARY KEY,
  partida_id 		 INT NOT NULL,  -- ahora es INT sin UNSIGNED
  jugador            ENUM(
							'jugador1',
							'jugador2'
					 ) NOT NULL,
  dino 				 ENUM(
							'T-rex',
							'Triceratops',
							'Stegosaurus',
							'Parasaurolophus',
							'Diplodocus',
							'Pterodáctilo'
					 ) NOT NULL,
  INDEX idx_bolsa_partida (partida_id),
  CONSTRAINT fk_bolsa_partida
    FOREIGN KEY (partida_id) REFERENCES partidas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;


DELIMITER $$

CREATE TRIGGER trg_users_after_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO ranking_usuarios (usuario_id, partidas_jugadas, partidas_ganadas, puntaje_total)
    VALUES (NEW.id, 0, 0, 0);
END$$

DELIMITER ;






-- cambios

ALTER TABLE partidas
ADD COLUMN cara_dado_actual ENUM(
    'bosque',
    'pradera',
    'rio',
    'cafeteria',
    'izquierda',
    'derecha'
) DEFAULT NULL;

ALTER TABLE partidas
ADD COLUMN bolsa_dinos ENUM(
'T-rex',
 'Triceratops',
 'Stegosaurus',
 'Parasaurolophus',
 'Diplodocus',
 'Pterodáctilo'
 ) DEFAULT NULL;
 


-- Para obtener rápidamente todas las jugadas de una partida ordenadas
CREATE INDEX idx_recintos_partida_id_turno
  ON recintos_partida(partida_id, turno);

-- Para validar jugadas por jugador en una partida
CREATE INDEX idx_partida_jugador
  ON recintos_partida(partida_id, jugador);

-- Para validar restricciones o repeticiones por recinto
CREATE INDEX idx_partida_recinto
  ON recintos_partida(partida_id, recinto);
  
-- ALTER TABLE partidas DROP CHECK chk_tirador_valido;
-- ALTER TABLE partidas RENAME COLUMN tirador TO tirador_actual;
ALTER TABLE partidas
ADD CONSTRAINT chk_tirador_actual_valido
CHECK (tirador_actual IN ('jugador1', 'jugador2'));

ALTER TABLE partidas
DROP COLUMN bolsa_dinos;

ALTER TABLE partidas ADD bolsa_dinos ENUM(
    'bosque',
    'pradera',
    'rio',
    'cafeteria',
    'izquierda',
    'derecha'
) DEFAULT NULL;

RENAME TABLE bolsa TO bolsas;


select * from bolsas;

DROP DATABASE DB_Draftosaurus_Devance;

