<?php

require_once 'Reglas.php';


    class Puntaje{

        public function calcularPuntaje(array $porRecinto): int
        {
           /* $porRecitos =['bosque' => ['t-rex',
                                       'triceratops',
                                       't-rex'],
                            'rio' => ['brontosaurio',
                                    'brontosaurio'],
                            'cafeteria' => ['t-rex']
                         ]
            */

            $reglas = new Reglas();

            $puntaje = 0;

            foreach ($porRecinto as $recinto => $dinos) {

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
                        $puntaje += $this->reglas->reglasReyDeLaSelva($dinos);

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