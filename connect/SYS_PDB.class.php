<?php
/**
 * Clase encargada de gestionar las conexiones a la base de datos
 *
 * @user Ramsés Martinez
 * @date 22/01/2018
 */

require_once("SYS_PDBConfig.class.php");

Class SYS_PDB {
    private $servidor;
    private $usuario;
    private $password;
    private $base_datos;
    private $link;
    private $stmt;
    private $array;
    static $_instance;

    /**
     * La función construct es privada para evitar que el objeto pueda ser creado mediante new
     */
    private function __construct(){
        $dbConfig = new SYS_PDBConfig();
        $this->servidor = $dbConfig->getServerName();
        $this->usuario = $dbConfig->getUserName();
        $this->password = $dbConfig->getPassCode();
        $this->base_datos =  $dbConfig->getDbName();
        $this->link= new mysqli($this->servidor, $this->usuario, $this->password, $this->base_datos);
    }
    /**
     * Evita el clonaje del objeto. Patrón Singleton
     */
    private function __clone(){ }
    /**
     * Función encargada de crear, si es necesario, el objeto.
     * Esta es la función que debemos llamar desde fuera de la clase para instanciar el objeto,
     * y así, poder utilizar sus métodos
     */
    public static function getInstance(){
        if (!(self::$_instance instanceof self)){
            self::$_instance=new self();
        }
        return self::$_instance;
    }

    /**
     * Método para ejecutar una sentencia sql
     * @param string $sql Sentencia SQL a ejecutar
     * @return mysqli_result Resultado de la ejecución del Query
     */
    public function ejecutar(string $sql)
    {
        $this->stmt = mysqli_query($this->link, $sql);
        return $this->stmt;
    }
    /**
     * Método para obtener una fila de resultados de la sentencia sql
     * @param mysqli_result $stmt - consulta de un query válido
     * @param int $fila - fila a recuperar de la consulta
     * @return array
     */
    public function obtener_fila(mysqli_result $stmt, int $fila)
    {
        if ($fila == 0){
            $this->array = mysqli_fetch_array($stmt);
        } else {
            mysqli_data_seek($stmt, $fila);
            $this->array = mysqli_fetch_array($stmt);
        }
        return $this->array;
    }

    /**
     * Métpdp encargado de cerrar la conexión
     */
    public function close_connection()
    {
        if (isset($this->connection)) {
            $this->connection->close();
            unset($this->connection);
        }
    }

    /**
     * @param $transactionType - indica el tipo de transaccion que ejecutará
     */
    public function start_transaction($transactionType)
    {
        $this->link->begin_transaction($transactionType);
    }

    /**
     * Función para cerrar la transacción
     */
    public function commit_transaction()
    {
        $this->link->commit();
    }

    /**
     * Función para deshacer la transacción
     */
    public function rollback_transaction()
    {
        $this->link->rollback();
    }

    /**
     * @return string Obtiene el último error de las sentencias ejecutadas
     */
    public function get_last_error()
    {
        return $this->link->error;
    }
}