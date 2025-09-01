<?php

class RankingService
{   
    private static ?RankingService $instance = null; 

    private ?RankingRepository $partidaRepository;

    //DOMAIN
    private Partida $partida;
    private Reglas $reglas;
    private Puntaje $puntaje;

    private function __construct()
    {
        $this->rankingRepository = RankingRepository::getInstance();
        $this->partida = new Partida();
        $this->reglas = new Reglas();
        $this->puntaje = new Puntaje();
    }

    public static function getInstance(): ?RankingService
    {
        if (self::$instance === null) 
        {
            self::$instance = new self();
        }
        return self::$instance;
    }

     public function calcularPuntajesService(int $partida_id): array
    {   

        $colocacionesJugador1 = $this->rankingRepository->getColocacionesRepository($partida_id, 'jugador1');

        $colocacionesJugador2 = $this->rankingRepository->getColocacionesRepository($partida_id, 'jugador2');

        $porRecintoJugador1 = [];
        foreach($colocacionesJugador1 as $c)
        {
            $recinto = $c['recinto'];
            $tipoDino = $c['tipo_dino'];
            $porRecintoJugador1[$recinto][] = $tipoDino;
        }

        $porRecintoJugador2 = [];
        foreach($colocacionesJugador2 as $c)
        {
            $recinto = $c['recinto'];
            $tipoDino = $c['tipo_dino'];
            $porRecintoJugador2[$recinto][] = $tipoDino;
        }

        

        $puntajeJugador1 = $this->puntaje->calcularPuntaje('jugador1', $porRecintoJugador1);

        $puntajeJugador2 = $this->puntaje->calcularPuntaje('jugador2', $porRecintoJugador2);

        return [
                'jugador1' => $puntajeJugador1,
                'jugador2' => $puntajeJugador2
                ];

    }
}