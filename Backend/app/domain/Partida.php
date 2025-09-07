<?php

    class Partida{

        private string $caraDadoActual;
        private string $tiradorActual;

        public function tirarDado(string $tirador) : string
        {
            $caras = ['bosque', 'pradera', 'rio', 'cafeteria', 'izquierda', 'derecha'];
            $this->tirador = $tiradorActual;
            $this->caraDadoActual = $caras[array_rand($caras)];
            return $this->caraDadoActual;

        }

    }