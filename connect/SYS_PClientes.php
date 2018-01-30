<?php
/**
 * Archivo que permite obtener datos realacionados de los clientes
 * Created by Ramsés Martínez.
 * Fecha de creación: 26/01/2018
 */

require_once("SYS_PDB.class.php");

header('Content-type: application/json');
date_default_timezone_set('America/Mexico_City');

$conn = SYS_PDB::getInstance();

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

        case 'crear_cliente':
            // Campos obligatorios y opcionales
            $nuevo_cliente = array(
                'code' => $_POST['sCode'], 
                'membresia' => $_POST['sMembresia'],
                'sucursal' => $_POST['sSucursal'],
                'fecha' => '20180101',
                'nombre' => $_POST['sNombre'],
                'apellidoMaterno' => $_POST['sApellidoMaterno'],
                'apellidoPaterno' => $_POST['sApellidoPaterno'],
                'calle' => $_POST['sCalle'],
                'numeroExterior' => $_POST['sNumeroExterior'],
                'numeroInterior' => empty($_POST['sNumeroInterior'])  ? '' : $_POST['sNumeroInterior'],
                'colonia' => $_POST['sColonia'],
                'delegacion' => $_POST['sDelegacion'],
                'estado' => $_POST['sEstado'],
                'ciudad' => $_POST['sCiudad'],
                'codigoPostal' => $_POST['sCodigoPostal'],
                'pais' => $_POST['sPais'],
                'telefono1' => $_POST['sTelefono1'],
                'telefono2' => empty($_POST['sTelefono2']) ? '' : $_POST['sTelefono2'],
                'email' => empty($_POST['sEmail'])  ? '' : $_POST['sEmail'],
                'referencias' => empty($_POST['sReferencias'])  ? '' : $_POST['sReferencias'],
                'sincronizado' => 'N'
            );

            if (crearCliente($conn, $nuevo_cliente)) {
                echo json_encode(array("result"=>"Success", "Code"=>0));
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
                "U_SYS_FOLI" => 1 + 1);
        }

    } catch (Exception $e) {
        echo "Error: " . $e;

    } finally {
        return $result;

    }
}

/**
 * @param SYS_PDB $conn
 * @param array $nuevoCliente
 * @return bool
 */
function crearCliente(SYS_PDB &$conn, $nuevoCliente) {
    $sql =  "INSERT INTO pos.`@sys_pclientes`(Code, Name, U_SYS_MEMB, U_SYS_NOMB, U_SYS_APPA, U_SYS_APMA, U_SYS_CALL, U_SYS_NUEX, " .
            "   U_SYS_NUIN, U_SYS_COLO, U_SYS_DEMU, U_SYS_ESTA, U_SYS_CIUD, U_SYS_COPO, U_SYS_PAIS, U_SYS_TEL1, U_SYS_TEL2, " .
            "   U_SYS_MAIL, U_SYS_REFE, U_SYS_SUCU, U_SYS_FECH, U_SYS_SINC)" .
            "VALUES ('$nuevoCliente[code]', '$nuevoCliente[code]', '$nuevoCliente[membresia]', '$nuevoCliente[nombre]', '$nuevoCliente[apellidoPaterno]', " .
            "   '$nuevoCliente[apellidoMaterno]', '$nuevoCliente[calle]', '$nuevoCliente[numeroExterior]', '$nuevoCliente[numeroInterior]', " .
            "   '$nuevoCliente[numeroExterior]', '$nuevoCliente[colonia]', '$nuevoCliente[delegacion]', '$nuevoCliente[estado]', '$nuevoCliente[ciudad]', " .
            "   '$nuevoCliente[codigoPostal]', '$nuevoCliente[pais]', '$nuevoCliente[telefono1]', '$nuevoCliente[telefono2]'" .
            "   '$nuevoCliente[email]', '$nuevoCliente[referencias]', '$nuevoCliente[sucursal]', '$nuevoCliente[fecha]', '$nuevoCliente[sincronizado]')";


    try {
        if ( $conn->ejecutar($sql) ) {
         return true;
        } else {
            echo $conn->get_last_error();
        }

    } catch (Exception $e) {
        echo "Error: " . $e;
    }
    return false;
}
