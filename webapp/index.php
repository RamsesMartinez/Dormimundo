<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="icon" href="icon.png">
  <meta http-equiv='Content-Type' content='text/html;charset=UTF-8'/>

  <title>dormimundo</title>

  <!-- Validación incial para el login o alguna vista -->
  <?php 
    session_start();
    $session_value = (isset($_SESSION['username'])) ? $_SESSION['username']: ''; 
  ?>
  <script type='text/javascript'>
    var sesion_username='<?php echo $session_value;?>';
    
    // Si NO hay sesión activa
    if (sesion_username === '') {
      // Si NO hay sesión activa, y no está en el login, redirige al login
      if (document.location.hash !== '' || document.location.hash.indexOf('#') > -1) { 
        location.href = 'http://localhost/webapp/';
        
      }
      
      
    } else {
      // Si está en el login y hay sesión activa, redirige al home
      if (document.location.hash === '' || document.location.hash.indexOf('Login') !== -1) { 
        location.href = 'http://localhost/webapp/#/Dormimundo/Home/';

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
          data-sap-ui-resourceroots='{"com.sap.build.standard.dormimundo":"./","sap.iot.dor":"/build/uilibraries/BRIDGE-CUSTOM-1.0.0/sap/iot/dor"}'>
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
<!-- Script para detectar cambios en local -->
<script type="text/javascript">
  var sesion_username='<?php echo $session_value;?>';
  
  jQuery(window).bind('hashchange', function () {
  
    // Si NO hay sesión activa
    if (sesion_username === '') {
      // Si NO hay sesión activa, y no está en el login, redirige al login
      if (document.location.hash !== '' || document.location.hash.indexOf('#') > -1) { 
        location.href = 'http://localhost/webapp/';
        
      }
      
      
    } else {
      // Si está en el login y hay sesión activa, redirige al home
      if (document.location.hash === '' || document.location.hash.indexOf('Login') !== -1) { 
        location.href = 'http://localhost/webapp/#/Dormimundo/Home/';

      }

    }

    
  });
</script>
</html>

