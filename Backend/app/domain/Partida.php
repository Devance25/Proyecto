<?php

class Partida {

    private string $caraDadoActual;
    private string $tiradorActual;

    public function tirarDado(string $tirador): string
    {
        $caras = ['bosque', 'pradera', 'rio', 'cafeteria', 'izquierda', 'derecha'];

        $this->tiradorActual = $tirador;
        $this->caraDadoActual = $caras[array_rand($caras)];

        return $this->caraDadoActual;
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
