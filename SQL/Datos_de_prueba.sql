-- =====================================================
-- DATOS DE PRUEBA SIMPLES - DRAFTOSAURUS
-- =====================================================

USE DB_Draftosaurus_Devance;

-- =====================================================
-- USUARIOS
-- =====================================================
INSERT INTO usuarios (nombre_usuario, email, nacimiento, password, admin) VALUES
('admin', 'admin@draftosaurus.uy', '1985-03-15', '123456', TRUE),
('juan', 'juan@gmail.com', '1992-07-22', '123456', FALSE),
('ana', 'ana@gmail.com', '1988-11-08', '123456', FALSE),
('diego', 'diego@gmail.com', '1995-04-12', '123456', FALSE),
('lucia', 'lucia@gmail.com', '1990-09-25', '123456', FALSE),
('martin', 'martin@gmail.com', '1987-12-03', '123456', FALSE);

-- =====================================================
-- PARTIDAS
-- =====================================================
INSERT INTO partidas (jugador1_id, jugador2_id, puntaje_jugador1, puntaje_jugador2, ganador_id, estado, cara_dado_actual, tirador_actual_id, turno, ronda) VALUES
-- Partida finalizada
(2, 3, 45, 38, 2, 'finalizada', 'vacio', NULL, 12, 6),
(4, 5, 30, 42, 5, 'finalizada', 'vacio', NULL, 12, 6),

-- Partida activa
(6, 2, 15, 18, NULL, 'activa', 'bosque', 2, 5, 3);

-- =====================================================
-- ALGUNOS RECINTOS
-- =====================================================
INSERT INTO recintos_partida (partida_id, jugador_id, recinto, tipo_dino) VALUES
(3, 6, 'bosque-semejanza', 't-rex'),
(3, 2, 'pradera-amor', 'triceratops'),
(3, 6, 'woody-trio', 'stegosaurus');

-- =====================================================
-- ALGUNAS BOLSAS
-- =====================================================
INSERT INTO bolsas (partida_id, jugador_id, dino) VALUES
(3, 6, 'parasaurolophus'),
(3, 6, 'diplodocus'),
(3, 2, 'stegosaurus'),
(3, 2, 'pterodáctilo');