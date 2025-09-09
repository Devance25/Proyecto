<?php

class Partida {

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
