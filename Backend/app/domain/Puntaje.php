<?php

require_once 'Reglas.php';


    class Puntaje{

        public function calcularPuntaje(array $porRecinto): int
        {
            // $porRecitos =['bosque' => ['t-rex',
            //                            'triceratops',
            //                            't-rex'],
            //               'rio' => ['brontosaurio',
            //                         'brontosaurio'],
            //               'cafeteria' => ['t-rex']
            //              ]

            $reglas = new Reglas();

            $puntaje = 0;

            foreach ($porRecinto as $recinto => $dinos) {

                if($recinto === 'bosque')
                {
                    $puntaje += $this->reglas->reglasBosque($dinos);

                }elseif ($recinto === 'pradera')
                {
                    $puntaje += $this->reglas->reglasPradera($dinos);

                }elseif ($recinto === 'rio')
                {
                    $puntaje += $this->reglas->reglasRio($dinos);

                }elseif ($recinto === 'cafeteria')
                {
                    $puntaje += $this->reglas->reglasCafeteria($dinos);

                }elseif ($recinto === 'izquierda')
                {
                    $puntaje += $this->reglas->reglasIzquierda($dinos);

                }elseif ($recinto === 'derecha')
                {
                    $puntaje += $this->reglas->reglasDerecha($dinos);

                }
            }

            return $puntaje;

        }

    }