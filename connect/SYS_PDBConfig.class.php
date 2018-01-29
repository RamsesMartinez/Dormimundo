<?php
/**
 * User: Ramsés Martínez
 * Date: 29/01/2018
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
     * @param string $serverName
     */
    public function setServerName(string $serverName)
    {
        $this->serverName = $serverName;
    }

    /**
     * @return string
     */
    public function getUserName(): string
    {
        return $this->userName;
    }

    /**
     * @param string $userName
     */
    public function setUserName(string $userName)
    {
        $this->userName = $userName;
    }

    /**
     * @return string
     */
    public function getPassCode(): string
    {
        return $this->passCode;
    }

    /**
     * @param string $passCode
     */
    public function setPassCode(string $passCode)
    {
        $this->passCode = $passCode;
    }

    /**
     * @return string
     */
    public function getDbName(): string
    {
        return $this->dbName;
    }

    /**
     * @param string $dbName
     */
    public function setDbName(string $dbName)
    {
        $this->dbName = $dbName;
    }


}
