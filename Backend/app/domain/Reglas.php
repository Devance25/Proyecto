<?php

class Reglas
{
    private static ?Reglas $instance = null;


    private function __construct() {

    }


    public static function getInstance(): Reglas
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function restriccionDado(string $caraDado, array $porRecinto): array //tiene que devolver los recintos en los cuales no se pueden colocar los dinos.
    {
        $recintosRestringidos = [];

        if ($caraDado === 'elBosque'){
        $recintosRestringidos = [
                                'pradoDiferencia',
                                'islaSolitaria',
                                'praderaDelAmor'
                                ];
        return $recintosRestringidos; 

        }elseif($caraDado === 'llanura'){
        $recintosRestringidos = [
                                'bosqueSemejanza',
                                'reySelva',
                                'trioFrondozo'
                                ];
        return $recintosRestringidos; 

        }elseif($caraDado === 'bagnos'){
        $recintosRestringidos = [
                                'bosqueSemejanza',
                                'trioFrondozo',
                                'praderaDelAmor'
                                ];

        return $recintosRestringidos;

        }elseif($caraDado === 'cafeteria'){
        $recintosRestringidos = [
                                'reySelva',
                                'pradoDiferencia',
                                'islaSolitaria'
                                ];
        
        return $recintosRestringidos;

        }elseif($caraDado === 'recintoVacio'){
            //Tengo que importar recintos con sus respectivos dinos, posiblemente desde getColocacionesRepo
        }elseif($caraDado === 'cuidadoTRex'){
            //Tengo que importar recintos con sus respectivos dinos, posiblemente desde getColocacionesRepo
        }
    }
    //==========================================================================================================================================================

    //==========================================================================================================================================================
    public function restericcionRecinto(string $recinto): array 
    {

    }

    //==========================================================================================================================================================
    public function reglasBosqueSemejanza(array $dinos): int  //Recibe un array con los dinos ubicados en el recinto desde Puntaje.php metodo: 'calcularPuntaje()'.
    {
        $cantDinos = 0;

        for($i = 0; $i<sizeof($dinos); $i++){    /* Ya se da por hecho que son todos de la MISMA!!! especie 
                                               y que no se ingresaron mas de 6 dinos al recinto por lo que no se verifica. */ 
            $cantDinos += 1;

        }

        if($cantDinos == 1){
            return 2;
        }elseif($cantDinos == 2){
            return 4;
        }elseif($cantDinos == 3){
            return 8;
        }elseif($cantDinos == 4){
            return 12;
        }elseif($cantDinos == 5){
            return 18;
        }elseif($cantDinos == 6){
            return 24;
        }elseif($cantDinos == 0){
            return 0;
        }
    }

    //==========================================================================================================================================================
    public function reglasPradoDiferencia(array $dinos): int
    {
        $cantDinos = 0;

        for($i = 0; $i<sizeof($dinos); $i++){    /* Ya se da por hecho que son todos de DIFERENTE!!! especie
                                               y que no se ingresaron mas de 6 dinos al recinto por lo que no se verifica. */ 
            $cantDinos += 1;

        }

        if($cantDinos == 1){
            return 1;
        }elseif($cantDinos == 2){
            return 3;
        }elseif($cantDinos == 3){
            return 6;
        }elseif($cantDinos == 4){
            return 10;
        }elseif($cantDinos == 5){
            return 15;
        }elseif($cantDinos == 6){
            return 21;
        }elseif($cantDinos == 0){
            return 0;
        }
    }
    
    //==========================================================================================================================================================
    public function reglasPraderaDelAmor(array $dinos): int
    {
        $parejas = 0;
        $usados = [];   //Se almacenan los indices que ya fueron emparejados.

    for($i = 0; $i < sizeof($dinos); $i++){
        if(in_array($i, $usados)) continue;         //'continue; finaliza la iteracion en caso de que $i sea un indice ya emparejado.'
        for($j = $i+1; $j < sizeof($dinos); $j++){
            if(in_array($j, $usados)) continue;     //'continue; finaliza la iteracion en caso de que $j sea un indice ya emparejado.'    
            if($dinos[$i] == $dinos[$j]){
                $parejas++;
                $usados[] = $i;
                $usados[] = $j;
                break;
            }
        }
    }
    return $parejas*5;  //Devuelve 5 puntos por pareja.
    }

    //==========================================================================================================================================================
    public function reglasTrioFrondoso(array $dinos): int
    {
        if(sizeof($dinos) == 3){    //Evalua si hay 3 dinosaurios en el recinto, si los hay, devuelve 7 puntos.
            return 7;
        }else{
            return 0;               //Si hay menos de 3 dinosaurios, devuelve 0 puntos. Se da por hecho que ya fue validado el limite de colocacion.
        }
    }

    //==========================================================================================================================================================
    public function reglasReyDeLaSelva(array $porRecinto1, array $porRecinto2): int
    {
        //Recibe los array de arrays de cada jugador. Hay que comparar la cantidad del tipo de dino en el recinto con los del otro jugador.!!!!!
    }

    //==========================================================================================================================================================
    public function reglasIslaSolitaria(array $dinos, array $porRecinto): int   //Recibe como parametro el dino de la isla y los demas recintos con sus respectivos dinos.
    {
        $dinoSolitario = $dinos[0];     //Guarda en la variable el dino 'solitario'
        $dinosEnTablero = [];           //Crea array para guardar a todos los dinos del tablero.

        foreach($porRecinto as $recinto => $ejemplar){  //Extrae todos los dinos del tablero y 
            foreach($ejemplar as $dino){                //los guarda en $dinosEnTablero
            $dinosEnTablero[] = $dino;
        }
    }
        $conteoDinosTablero = array_count_values($dinosEnTablero);  //Crea un array de arrays con el nombre de los dinos 
                                                                    //como cabecera, y la cantidad de dinos de ese tipo como elemento.
        if($conteoDinosTablero[$dinoSolitario]<2){  //Evalua si hay mas de 1 dino (del tipo del solitario) y devuelve el puntaje correspondiente.
            return 7;
        }else{
            return 0;
        }
    }

    //==========================================================================================================================================================
    public function reglasRio(array $dinos): int
    {
        $resultadoRio = count($dinos);

        return $resultadoRio;

    }
}