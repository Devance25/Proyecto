<?php

class Puntaje
{
    private static ?Puntaje $instance = null;

    private ?Reglas $reglas;


    private function __construct() {

        $this->reglas = Reglas::getInstance();
    }


    public static function getInstance(): Puntaje
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function calcularPuntaje(array $porRecinto): int
    {
        // $porRecinto = [
        //     'bosque-semejanza' => ['T-rex', 'Triceratops', 'T-rex'],
        //     'rio' => ['Diplodocus', 'Diplodocus'],
        //     'pradera-amor' => ['T-rex']
        // ]

        $puntaje = 0;

        foreach ($porRecinto as $recinto => $dinos) {

            if ($recinto === 'bosque-semejanza') {

                $puntaje += $this->reglas->reglasBosqueSemejanza($dinos);

            } elseif ($recinto === 'pradera-amor') {

                $puntaje += $this->reglas->reglasPraderaAmor($dinos);

            } elseif ($recinto === 'woody-trio') {

                $puntaje += $this->reglas->reglasWoodyTrio($dinos);

            } elseif ($recinto === 'prado-diferencia') {

                $puntaje += $this->reglas->reglasPradoDiferencia($dinos);

            } elseif ($recinto === 'rey-jungla') {

                $puntaje += $this->reglas->reglasReyJungla($dinos);

            } elseif ($recinto === 'isla-solitaria') {

                $puntaje += $this->reglas->reglasIslaSolitaria($dinos);

            } elseif ($recinto === 'rio') {

                $puntaje += $this->reglas->reglasRio($dinos);

            }
        }

        return $puntaje;
    }
}