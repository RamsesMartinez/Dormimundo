<?php
/**
 * Archivo que permite obtener datos realacionados de los clientes
 * Created by Ramsés Martínez.
 * Fecha de creación: 26/01/2018
 */

header('Content-type: application/json');

require_once("SYS_PDB.class.php");
$conn = SYS_PDB::getInstance();
date_default_timezone_set('America/Mexico_City');

// Select the Request Method
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod == 'POST') {
    $type = $_POST['type'];

    switch ($type) {
        case 'get_membresia_cliente':
            $sCodigoSucursal = $_POST["codigo_sucursal"];

            if (mysqli_connect_errno()) {
                // Retorna un json con el mensaje del error
                printJsonResult(array("msg"=>mysqli_connect_error()), 1);

            } else {
                // Retorna un json con el resultado de la consulta
                $arrayEmpleado = obtenerConsecutivoMembresiaCliente($conn, $sCodigoSucursal);
                echo json_encode($arrayEmpleado);
            }
            break;
    }
}

/**
 * Función que permite obtener el siguiente número consecutivo para el nuevo usuario
 *
 * @param SYS_PDB $conn
 * @param string $sCodigoSucursal
 * @return array Regresa el codigo de la sucursal y el siguiente número incremental para el nuevo cliente
 */
function obtenerConsecutivoMembresiaCliente(SYS_PDB &$conn, string $sCodigoSucursal) {
    $sql = "SELECT Code, U_SYS_FOLI FROM `@sys_pfolclientes` WHERE Code=$sCodigoSucursal";
    $result = array();

    try {
        $res = $conn->ejecutar($sql);

        while ($row = $conn->obtener_fila($res, 0)) {
            $result = array(
                "Code" => $row[0],
                "U_SYS_FOLI" => $row[1] + 1);
        }

        if (empty($result)) {
            $result = array("Code" => $sCodigoSucursal,
                "U_SYS_FOLI" => 1);
        }

    } catch (Exception $e) {
        echo "Error: " . $e;

    } finally {
        return $result;

    }
}
