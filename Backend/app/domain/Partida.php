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



    //  Funcion que sirve para creae las bolsas de los jugadores
    public function crearBolsa(array &$bolsa_general): array
    {   
        //  Array donde se guardan los dinos de la bolsa para el jugaror
        $bolsa_jugador = [];

        //  Bucle que itera sobre la bolsa general con un random y guarda 6 dinos en la bolsa del jugador
        for($i = 0; $i < 6; $i++)
        {
            //  Selecciona un índice aleatorio
            $indice_aleatorio = array_rand($bolsa_general);
            
            //  Agrega el dinosaurio a la bolsa del jugador
            $bolsa_jugador[] = $bolsa_general[$indice_aleatorio];
            
            //  Remueve el dinosaurio de la bolsa general
            unset($bolsa_general[$indice_aleatorio]);
            
            //  Reindexa el array para evitar huecos
            $bolsa_general = array_values($bolsa_general);
        }

        return $bolsa_jugador;
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


class BolsaGeneral
{
    public array $bolsa_general;

    public function __construct()
    {
        $this->bolsa_general = [
            't-rex','t-rex','t-rex','t-rex','t-rex','t-rex','t-rex','t-rex',
            'triceratops','triceratops','triceratops','triceratops','triceratops','triceratops','triceratops','triceratops',
            'stegosaurus','stegosaurus','stegosaurus','stegosaurus','stegosaurus','stegosaurus','stegosaurus','stegosaurus',
            'parasaurolophus','parasaurolophus','parasaurolophus','parasaurolophus','parasaurolophus','parasaurolophus','parasaurolophus','parasaurolophus',
            'diplodocus','diplodocus','diplodocus','diplodocus','diplodocus','diplodocus','diplodocus','diplodocus',
            'pterodactilo','pterodactilo','pterodactilo','pterodactilo','pterodactilo','pterodactilo','pterodactilo','pterodactilo'
        ];
    }

    public function removerDinos(array $dinos): void
    {
        $this->bolsa_general = array_values(
            array_diff($this->bolsa_general, $dinos)
        );
    }

}
