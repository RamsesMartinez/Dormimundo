<?php
/**
 * Archivo encargado de realizar las consultas par avlaidar las sesiones
 *
 * Author: Ramses Martínez
 * Date: 22/01/2018
 * Time: 10:35 AM
 */

// Evita que se muestren logs
//error_reporting(0);

require_once("DB.class.php");
$conn = Db::getInstance();
date_default_timezone_set('America/Mexico_City');

// Select the Request Method
$requestMethod = $_SERVER['REQUEST_METHOD'];
if ($requestMethod == 'GET') {
    echo $requestMethod;

} elseif ($requestMethod == 'POST') {
    $type = $_POST['type'];

    switch ($type) {
        case 'userCode':
            $empId = $_POST["value"];

            if (mysqli_connect_errno()) {
                // Retorna un json con el mensaje del error
                printJsonResult(array("msg"=>mysqli_connect_error()), 1);

            } else {
                // Retorna un json con el resultado de la consulta
                $arrayEmpleado = getNombreEmpleado($conn, $empId);

                if (empty($arrayEmpleado)) {
                    printJsonResult($arrayEmpleado, 3);

                } else {
                    printJsonResult($arrayEmpleado,0 );

                }

            }
            break;

        case 'start_session':
            // Inicio de Sesión
            $sUserCode = $_POST['sUserCode'];
            $sUserName = $_POST['sUserName'];
            $sUserPassword = $_POST['sUserPassword'];

            if (iniciarSesion($conn, $sUserCode, $sUserPassword)) { // Existe el usuario
                // Crea la sesión
                session_name("loginUsuario");
                session_start();

                //defino la sesión que demuestra que el usuario está autorizado
                $_SESSION["autentificado"] = "Y";

                $_SESSION['username'] = $sUserName;

                // Define la fecha y hora de inicio de sesión en formato aaaa-mm-dd hh:mm:ss
                $_SESSION["ultimoAcceso"] = date("Y-n-j H:i:s");

                // Almacena el ultimo acceso del usuario en la BDD
                $result = registrarUltimoAcceso($conn, $sUserCode, $_SESSION["ultimoAcceso"]);
                if ($result) {
                    echo json_encode(array("session" => true), 0);
                } else {
                    echo json_encode(array("session" => false,
                        "result" => $result), 1);
                }
            } else {
                echo json_encode(array("session"=>false),1);
            }

            break;

        case 'check_login':
            $tiempoMaxSession = $_POST['tiempo_max_session'];
            session_name("loginUsuario");
            session_start();
            if (esSesionActiva($tiempoMaxSession)) {
                echo json_encode(array("session"=>true),0);
            } else {
                echo json_encode(array("session"=>false),1);
            }
            break;
        case 'update_session':
            session_name("loginUsuario");
            session_start();

            $_SESSION["ultimoAcceso"] = date("Y-n-j H:i:s");
            echo json_encode(array("session"=>true),0);
            break;
        case 'close_session':
            session_name("loginUsuario");
            session_start();
            session_destroy();
            echo json_encode(array("close_session"=>true),0);
            break;
    }

}

/**
 * Función que almacena en la BDD el último inicio de sesión del usuario
 *
 * @param DB $conn
 * @param string $sUserCode cadena que contiene el código del usuario
 * @param string $sUltimoAcceso cadena que contiene la fecha del ultimo acceso del usuario
 * @return mysqli_result
 */
function registrarUltimoAcceso(DB &$conn, string $sUserCode, string $sUltimoAcceso) {
    $sql =  "INSERT INTO `@sys_psesiones` SET U_SYS_AGEV = '$sUserCode', U_SYS_UCON = '$sUltimoAcceso' " .
            "ON DUPLICATE KEY UPDATE U_SYS_UCON = '$sUltimoAcceso'";

    return $conn->ejecutar($sql);
}

/**
 * Función que permite validar si el login del usuario es exitosa o no
 * @param DB $conn
 * @param string $sUserCode - Codigo del usuario
 * @param string $sUserPassword - Contraseña del usuario
 * @return bool
 */
function iniciarSesion(DB &$conn, string $sUserCode, string $sUserPassword) {
    // La contraseña no viene hasheada... por lo que se realiza la consulta directamente
    $sql = "SELECT empID, U_SYS_PASS FROM ohem WHERE empID=$sUserCode AND U_SYS_PASS=$sUserPassword";
    $res = $conn->ejecutar($sql);
    return ($res->num_rows > 0);
}

/**
 * Función que retorna un array con los datos del empleado
 *
 * @param DB $conn 
 * @param string $empId  - cadena que contiene el código del vendedor a buscar
 * @return array $result - en caso de que el mysqli_result esté vacío, el array retornado estará vacío.
 */
function getNombreEmpleado(DB &$conn, string $empId) {
    $sql = "SELECT empID, firstName, lastName FROM ohem WHERE empID = $empId";
    $res = $conn->ejecutar($sql);

    $result = array();

    while ($row = $conn->obtener_fila($res, 0)) {
        array_push($result, array(
                "empID"=>$row[0],
                'firstName'=>$row[1],
                'lastName'=>$row[2])
        );
    }
    return $result;
}

/**
 * Función que eretorna el password  y usuario para inicio de sesión
 * @param DB $conn
 * @param mysqli_result $sql
 * @return array
 */
function checkPassword(DB &$conn, mysqli_result $sql) {
    $result = array();

    while ($row = $conn->obtener_fila($sql, 0)) {
        array_push($result, array(
                "empID"=>$row[0],
                'firstName'=>$row[1])
        );
    }
    return $result;
}

/**
 * Función que permite validar si la sesión aún está activa o no
 *
 * @param int $tiempoMaxSession - tiempo máximo que puede estar una sesión activa
 * @return bool
 */
function esSesionActiva(int $tiempoMaxSession) {

    if (isset($_SESSION['autentificado'])) {
        // Calcula el tiempo transcurrido de la sesión activa
        $fechaUltimoAcceso = $_SESSION["ultimoAcceso"];
        $ahora = date("Y-n-j H:i:s");
        $tiempoTranscurrido = (strtotime($ahora) - strtotime($fechaUltimoAcceso));

        // Compara el tiempo transcurrido
        if ($tiempoTranscurrido >= $tiempoMaxSession) {
            // Si pasaron n segundos o más
            session_destroy(); // Destruye la sesión
            return false;
        }
        return true;
    }
    return false;
}

/**
 * @param array $res
 * @param int $code Código que indica el resultado de la consulta
 *      $code = 0 :
 *
 */
function printJsonResult(array $res, int $code) {
    echo json_encode(array(
            "code" => $code,
            "data" => $res)
    );

    exit(0);
}
