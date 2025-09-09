<?php

class RankingRepository
{
    private static ?RankingRepository $instance = null; 

    private mysqli $conn;

    private function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    public static function getInstance(): ?RankingRepository
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    //INSERTS
    

    
    //UPDATES
    


    //GETS

    

    //DELETES
}