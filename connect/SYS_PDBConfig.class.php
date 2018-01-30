<?php
/**
 * Clase que incluye las configuraciones de la conección a la base de datos
 *
 * @author Ramsés Martínez
 * @date 29/01/2018
 */

class SYS_PDBConfig {
    protected $serverName;
    protected $userName;
    protected $passCode;
    protected $dbName;

    function __construct() {
        $this -> serverName = 'localhost';
        $this -> userName = 'root';
        $this -> passCode = 'Passw0rd';
        $this -> dbName = 'POS';
    }

    /**
     * @return string
     */
    public function getServerName(): string
    {
        return $this->serverName;
    }

    /**
     * @return string
     */
    public function getUserName(): string
    {
        return $this->userName;
    }

     /**
     * @return string
     */
    public function getPassCode(): string
    {
        return $this->passCode;
    }

    /**
     * @return string
     */
    public function getDbName(): string
    {
        return $this->dbName;
    }

}
