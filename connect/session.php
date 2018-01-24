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

session_start();

// Select the Request Method
switch($_SERVER['REQUEST_METHOD']) {
    case 'GET': $the_request = &$_GET;
        echo $the_request;
        break;

    case 'POST': $the_request = &$_POST;
        $type = $_POST['type'];

        // Obtención de nombre de usuario
        if ($type == 'userCode') {
            $empId = $_POST["value"];
            $sql = "SELECT empID, firstName, lastName FROM ohem WHERE empID = $empId";
            $res = $conn->ejecutar($sql);

            if (mysqli_connect_errno()) {
                // Retorna un json con el mensaje del error
                printJsonResult(array("msg"=>mysqli_connect_error()), 1);
            } else {
                // Retorna un json con el resultado de la consulta
                $arrayEmpleado = getNombreEmpleado($conn, $res);
                if (empty($arrayEmpleado)) {
                    printJsonResult($arrayEmpleado, 3);
                } else {
                    printJsonResult($arrayEmpleado,0 );
                }
            }
        // Inicio de Sesión
        } elseif ($type == 'start_session') {
            $userCode = $_POST['sUserCode'];
            $userName = $_POST['sUserName'];
            $userPassword = $_POST['sUserPassword'];

            // La contraseña no viene hasheada... por lo que se realiza la consulta directamente
            $sql = "SELECT empID, U_SYS_PASS FROM ohem WHERE empID=$userCode AND U_SYS_PASS=$userPassword";
            $res = $conn->ejecutar($sql);

            if ($res->num_rows > 0) { // Existe el usuario
                // Crea la sesión
                $_SESSION['username'] = $userName;

                echo json_encode(array("session"=>true),0);
            } else {
                echo json_encode(array("session"=>false),1);
            }

        } elseif ($type == 'close_session') {
            session_destroy();
            echo json_encode(array("close_session"=>true),0);
        }

        break;
}

/**
 * Función que retorna un array con los datos del empleado
 * en caso de que el parámetro @mysqli_result esté vacío,
 * el array retornado estará vacío.
 *
 * @param DB $conn
 * @param mysqli_result $sql
 * @return array
 */
function getNombreEmpleado(DB $conn, mysqli_result $sql) {
    $result = array();

    while ($row = $conn->obtener_fila($sql, 0)) {
        array_push($result, array(
                "empID"=>$row[0],
                'firstName'=>$row[1],
                'lastName'=>$row[2])
        );
    }
    return $result;
}

function checkPassword(DB $conn, mysqli_result $sql) {
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
