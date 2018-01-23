<?php
/**
 * Clase encargada de gestionar las conexiones a la base de datos
 */
Class DB {
    private $servidor = 'localhost';
    private $usuario = 'root';
    private $password = 'Passw0rd';
    private $base_datos = 'POS';
    private $link;
    private $stmt;
    private $array;
    static $_instance;
    /**
     * La función construct es privada para evitar que el objeto pueda ser creado mediante new
     */
    private function __construct(){
        $this->conectar();
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
     * Realiza la conexión a la base de datos.
     */
    private function conectar(){
        $this->link=mysqli_connect($this->servidor, $this->usuario, $this->password, $this->base_datos);
        //mysqli_select_db($this->base_datos,$this->link);
        //@mysql_query("SET NAMES 'utf8'");
    }
    /**
     * Método para ejecutar una sentencia sql
     * @param string $sql Sentencia SQL a ejecutar
     * @return mysqli_result Resultado de la ejecución del Query
     */
    public function ejecutar(string $sql){
        $this->stmt = mysqli_query($this->link, $sql);
        return $this->stmt;
    }
    /**
     * Método para obtener una fila de resultados de la sentencia sql
     * @param mysqli_result $stmt consulta de un query válido
     * @param int $fila Fila a recuperar de la consulta
     * @return array
     */
    public function obtener_fila(mysqli_result $stmt, int $fila){
        if ($fila == 0){
            $this->array = mysqli_fetch_array($stmt);
        } else {
            mysqli_data_seek($stmt, $fila);
            $this->array = mysqli_fetch_array($stmt);
        }
        return $this->array;
    }
}