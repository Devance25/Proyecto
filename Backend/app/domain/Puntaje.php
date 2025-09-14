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

    public function calcularPuntaje(array $porRecinto1, array $porRecinto2): int
    {
        // $porRecinto = [
        //     'bosque-semejanza' => ['T-rex', 'Triceratops', 'T-rex'],
        //     'rio' => ['Diplodocus', 'Diplodocus'],
        //     'pradera-amor' => ['T-rex']
        // ]
            foreach($porRecinto1 as $recinto => $dinos){
            $puntaje = 0;
                switch($recinto){

                    case 'bosque':
                        $puntaje += $this->reglas->reglasBosqueSemejanza($dinos);
                        break;

                    case 'prado':
                        $puntaje += $this->reglas->reglasPradoDiferencia($dinos);
                        break;

                    case 'pradera':
                        $puntaje += $this->reglas->reglasPraderaDelAmor($dinos);
                        break;

                    case 'trio-frondoso':
                        $puntaje += $this->reglas->reglasTrioFrondoso($dinos);
                        break;

                    case 'rey-selva':
                        $puntaje += $this->reglas->reglasReyDeLaSelva($porRecinto1, $porRecinto2);

                    case 'isla-solitaria':
                        $puntaje += $this->reglas->reglasIslaSolitaria($dinos, $porRecinto);
                        
                    case 'rio':
                        $puntaje += $this->reglas->reglasRio($dinos); 
                        break;
                }
            }
            return $puntaje;

    }

}
