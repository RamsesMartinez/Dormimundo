<?php
/**
 * Archivo que permite obtener datos realacionados de los clientes
 *
 * @author  Ramsés Martínez.
 * @date 22/01/2018
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
            $nuevoCliente = array(
                'code' => $_POST['sCode'], 
                'membresia' => $_POST['sMembresia'],
                'sucursal' => $_POST['sSucursal'],
                'fecha' => $_POST['sFecha'],
                'nombre' => $_POST['sNombre'],
                'apellidoMaterno' => $_POST['sApellidoMaterno'],
                'apellidoPaterno' => $_POST['sApellidoPaterno'],
                'calle' => $_POST['sCalle'],
                'numeroExterior' => $_POST['sNumeroExterior'],
                'numeroInterior' => empty($_POST['sNumeroInterior'])  ? 'NULL' : $_POST['sNumeroInterior'],
                'colonia' => $_POST['sColonia'],
                'delegacion' => $_POST['sDelegacion'],
                'estado' => $_POST['sEstado'],
                'ciudad' => $_POST['sCiudad'],
                'codigoPostal' => $_POST['sCodigoPostal'],
                'pais' => $_POST['sPais'],
                'telefono1' => $_POST['sTelefono1'],
                'telefono2' => empty($_POST['sTelefono2']) ? 'NULL' : $_POST['sTelefono2'],
                'email' => empty($_POST['sEmail'])  ? NULL : $_POST['sEmail'],
                'referencias' => empty($_POST['sReferencias'])  ? 'NULL' : $_POST['sReferencias'],
                'sincronizado' => 'N'
            );

            $json_result = crearCliente($conn, $nuevoCliente);
            if ($json_result['Code'] === 0) {
                echo json_encode(array("result"=>"Success", "Code"=>0));
            } else {
                echo json_encode(array($json_result, "Code"=>1));
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

/**
 * @param SYS_PDB $conn
 * @param array $nuevoCliente
 * @return array
 */
function crearCliente(SYS_PDB &$conn, &$nuevoCliente) {
    try {
        $Code = $nuevoCliente["code"];
        $Name = $nuevoCliente["code"];
        $U_SYS_MEMB = $nuevoCliente["membresia"];
        $U_SYS_NOMB = $nuevoCliente["nombre"];
        $U_SYS_APPA = $nuevoCliente["apellidoPaterno"];
        $U_SYS_APMA = $nuevoCliente["apellidoMaterno"];
        $U_SYS_CALL = $nuevoCliente["calle"];
        $U_SYS_NUEX = $nuevoCliente["numeroExterior"];
        $U_SYS_NUIN = $nuevoCliente["numeroInterior"];
        $U_SYS_COLO = $nuevoCliente["colonia"];
        $U_SYS_DEMU = $nuevoCliente["delegacion"];
        $U_SYS_ESTA = $nuevoCliente["estado"];
        $U_SYS_CIUD = $nuevoCliente["ciudad"];
        $U_SYS_COPO = $nuevoCliente["codigoPostal"];
        $U_SYS_PAIS = $nuevoCliente["pais"];
        $U_SYS_TEL1 = $nuevoCliente["telefono1"];
        $U_SYS_TEL2 = $nuevoCliente["telefono2"];
        $U_SYS_MAIL = $nuevoCliente["email"];
        $U_SYS_REFE = $nuevoCliente["referencias"];
        $U_SYS_SUCU = $nuevoCliente["sucursal"];
        $U_SYS_FECH = $nuevoCliente["fecha"];
        $U_SYS_SINC = $nuevoCliente["sincronizado"];

        $sqlCrearNuevoCliente =  "INSERT INTO pos.`@sys_pclientes`(Code, Name, U_SYS_MEMB, U_SYS_NOMB, U_SYS_APPA, U_SYS_APMA, " .
                "   U_SYS_CALL, U_SYS_NUEX, U_SYS_NUIN, U_SYS_COLO, U_SYS_DEMU, U_SYS_ESTA, U_SYS_CIUD, U_SYS_COPO, U_SYS_PAIS, " .
                "   U_SYS_TEL1, U_SYS_TEL2, U_SYS_MAIL, U_SYS_REFE, U_SYS_SUCU, U_SYS_FECH, U_SYS_SINC)" .
                "VALUES ('$Code', '$Name', '$U_SYS_MEMB', '$U_SYS_NOMB', '$U_SYS_APPA', '$U_SYS_APMA', '$U_SYS_CALL', '$U_SYS_NUEX', $U_SYS_NUIN, " .
                "   '$U_SYS_COLO', '$U_SYS_DEMU', '$U_SYS_ESTA', '$U_SYS_CIUD', '$U_SYS_COPO', '$U_SYS_PAIS', '$U_SYS_TEL1', '$U_SYS_TEL2', " .
                "   '$U_SYS_MAIL', $U_SYS_REFE, '$U_SYS_SUCU', '$U_SYS_FECH', '$U_SYS_SINC')";

        $sqlUpdateFolio = "INSERT INTO  pos.`@sys_pfolclientes`(Code, Name, U_SYS_FOLI) " .
                "VALUES ($U_SYS_SUCU, $U_SYS_SUCU, $Code) " .
                "ON DUPLICATE KEY UPDATE U_SYS_FOLI = $Code";

        $array_result = array();

        // Inicia transactio nde tipo escritura
        $conn->start_transaction(MYSQLI_TRANS_START_READ_WRITE);

        if ($conn->ejecutar($sqlCrearNuevoCliente) && $conn->ejecutar($sqlUpdateFolio)) {
            // Termina la transaccion
            $array_result = array("result"=>"Success", "Code"=>0);
            $conn->commit_transaction();
        } else {
            $array_result = array("error"=>"crearCliente()", "result"=>$conn->get_last_error(), "Code"=>1);
            $conn->rollback_transaction();
        }

    } catch (Exception $e)  {
        $array_result = array("result" => $e, "Error" => $conn->get_last_error(), "Code"=>1);

    } finally {
        return $array_result;
    }
}
