<?php

class Partida {

    private static ?Partida $instance = null;


    private function __construct() {

    }

    public static function getInstance(): Partida
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }



    private string $caraDado;


    public function tirarDado(): string
    {
        $caras = ['bosque',
                  'roca', 
                  'baño', 
                  'cafeteria', 
                  'no-trex', 
                  'vacio'
                ];

        $this->caraDado = $caras[array_rand($caras)];

        return $this->caraDado;
    }



    public function crearBolsa(): array
    {
        $bolsaDinos = []; //bolsa de 60 dinos, que mueva los dinos de la bolsa main a la bosla creada
        
        $dino = [
            't-rex', 
            'triceratops', 
            'stegosaurus', 
            'parasaurolophus', 
            'diplodocus', 
            'pterodactilo'
        ];

        for($i = 0; $i < 6; $i++)
        {
            $bolsaDinos[] = $dino[array_rand($dino)];
        }

        return $bolsaDinos;
    }



    public function agruparPorRecinto(array $colocacionesJugador): array
    {
        $porRecintoJugador = [];

        foreach($colocacionesJugador as $c)
        {
            $recinto = $c['recinto'];
            $tipoDino = $c['tipo_dino'];
            $porRecintoJugador[$recinto][] = $tipoDino;
        }

        return $porRecintoJugador;

    }



    public function determinarGanador(int $jugador1_id, int $jugador2_id, int $puntajeJugador1, int $puntajeJugador2): ?int
    {   
        if ($puntajeJugador1 > $puntajeJugador2) {
            return $jugador1_id;
        } elseif ($puntajeJugador2 > $puntajeJugador1) {
            return $jugador2_id;
        } else {
            return null;
        }

    }

}
