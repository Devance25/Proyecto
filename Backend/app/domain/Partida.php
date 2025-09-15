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
        $caras = ['bosque', 'roca', 'baño', 'cafeteria', 'no-trex', 'vacio'];

        $this->caraDado = $caras[array_rand($caras)];

        return $this->caraDado;
    }




    public function crearBolsa(): array
    {
        $bolsaDinos = [];
        
        $dino = ['T-rex', 'Triceratops', 'Stegosaurus', 'Parasaurolophus', 'Diplodocus', 'Pterodáctilo'];

        for($i = 0; $i < 6; $i++)
        {
            $bolsaDinos[] = $dino[array_rand($dino)];
        }

        return $bolsaDinos;
    }
}
