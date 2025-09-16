-- =====================================================
-- CONSULTAS
-- =====================================================

-- Ver todos los usuarios
SELECT nombre_usuario, email, admin FROM usuarios;

-- Ranking de jugadores
SELECT 
    usuario_nombre,
    partidas_jugadas,
    partidas_ganadas
FROM ranking_usuarios 
WHERE partidas_jugadas > 0
ORDER BY partidas_ganadas DESC;

-- Ver todas las partidas
SELECT 
    p.id,
    u1.nombre_usuario as jugador1,
    u2.nombre_usuario as jugador2,
    p.puntaje_jugador1,
    p.puntaje_jugador2,
    p.estado
FROM partidas p
JOIN usuarios u1 ON p.jugador1_id = u1.id
JOIN usuarios u2 ON p.jugador2_id = u2.id;

-- Ver partidas activas
SELECT 
    p.id,
    u1.nombre_usuario as jugador1,
    u2.nombre_usuario as jugador2,
    p.cara_dado_actual,
    p.turno,
    p.ronda
FROM partidas p
JOIN usuarios u1 ON p.jugador1_id = u1.id
JOIN usuarios u2 ON p.jugador2_id = u2.id
WHERE p.estado = 'activa';

-- Ver recintos ocupados
SELECT 
    rp.partida_id,
    u.nombre_usuario as jugador,
    rp.recinto,
    rp.tipo_dino
FROM recintos_partida rp
JOIN usuarios u ON rp.jugador_id = u.id
ORDER BY rp.partida_id;

-- Ver dinosaurios en bolsas
SELECT 
    b.partida_id,
    u.nombre_usuario as jugador,
    b.dino,
    COUNT(*) as cantidad
FROM bolsas b
JOIN usuarios u ON b.jugador_id = u.id
GROUP BY b.partida_id, u.nombre_usuario, b.dino
ORDER BY b.partida_id;