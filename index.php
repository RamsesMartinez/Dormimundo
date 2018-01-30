<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="icon" href="webapp/icon.png">
    <meta http-equiv='Content-Type' content='text/html;charset=UTF-8'/>

    <title>dormimundo</title>

    <!-- Validación inicial para el login o alguna vista -->
    <?php
    session_name("loginUsuario");
    session_start();

    $session_user_name = (isset($_SESSION['username'])) ? $_SESSION['username']: '';
    $session_user_code = (isset($_SESSION['userCode'])) ? $_SESSION['userCode']: '';

    $TIEMPO_MAX_SESSION = 3600;  // Tiempo de duración máxima de la sesión (segundos)
    $TIEMPO_VALIDAR_SESSION = 3;  // Tiempo para verificar la sesión (segundos)

    if (isset($_SESSION['autentificado'])) {
        date_default_timezone_set('America/Mexico_City');
        // Calcula el tiempo transcurrido de la sesión activa
        $fechaUltimoAcceso = $_SESSION["ultimoAcceso"];
        $ahora = date("Y-n-j H:i:s");

        $tiempo_transcurrido = (strtotime($ahora) - strtotime($fechaUltimoAcceso));
        // Compara el tiempo transcurrido
        if ($tiempo_transcurrido >= $TIEMPO_MAX_SESSION) {
            //si pasaron n minutos o más
            session_destroy(); // Destruye la sesión
        } else {
            // Sino, actualiza la sesión
            $_SESSION["ultimoAcceso"] = $ahora;
        }
    }

    ?>
    <script type='text/javascript'>
        var sessionUsername='<?php echo $session_user_name;?>';

        if (sessionUsername !== '') {
            // Si hay sesión activa
            if (document.location.hash === '' || document.location.hash.indexOf('Login') !== -1) {
                // Redirige al home
                location.href = 'http://localhost/#/Dormimundo/Home/';
            }
        }
        else {
            // Si NO está en el login
            if (!(document.location.hash === '' || document.location.hash.indexOf('Login') !== -1)) {
                // Redirige al login
                location.href = 'http://localhost/';
            }
        }
    </script>

    <script id="sap-ui-bootstrap"
            src="/openui5/resources/sap-ui-core.js"
            data-sap-ui-libs="sap.m,sap.ui.layout,sap.ui.commons"
            data-sap-ui-theme="sap_bluecrystal"
            data-sap-ui-xx-supportedLanguages="es"
            data-sap-ui-xx-bindingSyntax="complex"
            data-sap-ui-compatVersion="edge"
            data-sap-ui-preload="async"
            data-sap-ui-resourceroots='{"com.sap.build.standard.dormimundo":"../webapp","sap.iot.dor":"/build/uilibraries/BRIDGE-CUSTOM-1.0.0/sap/iot/dor"}'>
    </script>

    <script>
        sap.ui.getCore().attachInit(function (){

            new sap.ui.core.ComponentContainer({
                name : 'com.sap.build.standard.dormimundo'
            }).placeAt("content");

        })
    </script>
</head>

<body class="sapUiBody" id="content" rootUiArea ></body>

<script type="text/javascript">
    var sessionUsername = '<?php echo $session_user_name;?>';
    var sessionUserCode='<?php echo $session_user_code;?>';
    // Tiempo para validar la sesión (en segundos por multiplo de 1000)
    var tiempoValidarSession = parseInt('<?php echo $TIEMPO_VALIDAR_SESSION;?>') * 1000;
    var tiempoMaxSession = parseInt('<?php  echo $TIEMPO_MAX_SESSION;?>');

    $(function() {
        document.onclick = actualizarSesion;

        // Verifica la sesión contínuamente
        var refreshIntervalId = setInterval(validarSesion, tiempoValidarSession);
        if (sessionUserCode !== '' && sessionUsername !== '') {
            actualizarModeloAgente(sessionUserCode, sessionUsername);
        }
    });

    /**
     * Script para detectar cambios de vistas en local y redirigir al login
     *  si es necesario cuando no haya una sesión activa
     *
     */
    jQuery(window).bind('hashchange', function () {
        if (sessionUsername !== '') { // Si hay sesión activa
            // Si hay sesión activa
            if (document.location.hash === '' || document.location.hash.indexOf('Login') !== -1) {
                // Redirige al home
                location.href = 'http://localhost/#/Dormimundo/Home/';
            }

        } else { // Si NO hay sesión activa)
            // Si NO está en el login
            if (!(document.location.hash === '' || document.location.hash.indexOf('Login') !== -1)) {
                // Redirige al login
                location.href = 'http://localhost/';
            }
        }
    });

    /**
     * Función que valida tiempo si la sesión aún es válida
     */
    function validarSesion() {
        // Si NO está en el login
        if (!(document.location.hash === '' || document.location.hash.indexOf('Login') !== -1)) {

            $.ajax({
                url: '/connect/SYS_PSesion.php',
                method: 'POST',
                type: 'json',
                data: {
                    'type': 'check_login',
                    'tiempo_max_session': tiempoMaxSession
                },
                success: function (result) {
                    if (result.session === false) { //Sesión caducada
                        clearInterval(refreshIntervalId);
                        location.reload();
                    }

                },
                error: function (err) {
                    "error: ".log
                    console.log(err);
                }
            });
        }
    }

    /**
     * Función que actualiza la sesión para que se mantenga activa
     */
    function  actualizarSesion() {
        $.ajax({
            url: '/connect/SYS_PSesion.php',
            method: 'POST',
            type: 'json',
            data: {
                'type': 'update_session'
            },
            success: function (result) {
                // console.log(result);
            },
            error: function (err) {
                console.log(err);
            }
        });

    }

    /**
     * Función que actualiza el modelo global para el agente activo
     * @param sCode - empId del agente
     * @param sNombre - nombre del agente
     */
    function actualizarModeloAgente(sCode, sNombre) {
        var oGModelAgente = {
            "code": sCode,
            "nombre":   sNombre
        };
        console.log(sap.ui.getCore());
        sap.ui.getCore().setModel(oGModelAgente, "/Agente");
    }
</script>
</html>
