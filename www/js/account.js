/*
*   Este controlador es de uso general en las páginas web del sitio público. Se importa en la plantilla del pie del documento.
*   Sirve para manejar todo lo que tiene que ver con la cuenta del cliente.
*/

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API = 'http://34.125.63.184/api/public/clientes.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const ID_CLIENTE = params.get('id_cliente');

    let content = '';
    if (ID_CLIENTE > 0) {
        // Se establece el menú para cuando se inicia sesión.
        content = `
            <div class="navbar-fixed">
                <nav class="#2962ff blue accent-4">
                    <div class="nav-wrapper">
                        <a href="index_publico.php" class="brand-logo"><img src="../../resources/img/logo.jpg" height="60"></a>
                        <a href="#" data-target="mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                        <ul class="right hide-on-med-and-down">
                            <li><a href="#" onclick="openPasswordDialog()"><i class="material-icons left">security</i>Cambiar contraseña</a></li>
                            <li><a href="index_publico.php"><i class="material-icons left">view_module</i>Catálogo</a></li>
                            <li><a href="carrito.php"><i class="material-icons left">shopping_cart</i>Carrito</a></li>
                            <li><a href="historial.php"><i class="material-icons left">history</i>Actividad de sesión</a></li>
                            <li><a href="#" onclick="logOut()"><i class="material-icons left">close</i>Cerrar sesión</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <ul class="sidenav" id="mobile">
                <li><a href="#" onclick="openPasswordDialog()"><i class="material-icons left">security</i>Cambiar contraseña</a></li>
                <li><a href="index_publico.php"><i class="material-icons left">view_module</i>Catálogo</a></li>
                <li><a href="carrito.php"><i class="material-icons left">shopping_cart</i>Carrito</a></li>
                <li><a href="historial.php"><i class="material-icons left">history</i>Actividad de sesión</a></li>
                <li><a href="#" onclick="logOut()"><i class="material-icons left">close</i>Cerrar sesión</a></li>
            </ul>
        `;
    } else {
        // Se establece el menú para cuando no se ha iniciado sesión.
        content = `
            <div class="navbar-fixed">
                <nav class="#2962ff blue accent-4">
                    <div class="nav-wrapper">
                        <a href="index.html" class="brand-logo"><img src="../www/img/logo.jpg" height="60"></a>
                        <a href="#" data-target="mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                        <ul class="right hide-on-med-and-down">
                            <li><a href="carrito.html"><i class="material-icons left">add_shopping_cart</i>Carrito</a></li>
                            <li><a href="index.html"><i class="material-icons left">view_module</i>Catálogo</a></li>
                            <li><a href="register.html"><i class="material-icons left">person</i>Crear cuenta</a></li>
                            <li><a href="login.html"><i class="material-icons left">login</i>Iniciar sesión</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <ul class="sidenav" id="mobile">
                <li><a href="carrito.html"><i class="material-icons left">add_shopping_cart</i>Carrito</a></li>
                <li><a href="index.html"><i class="material-icons left">view_module</i>Catálogo</a></li>
                <li><a href="register.html"><i class="material-icons left">person</i>Crear cuenta</a></li>
                <li><a href="login.html"><i class="material-icons left">login</i>Iniciar sesión</a></li>
            </ul>
        `;
    }
    document.getElementById('encabezado').innerHTML = content;
});

/*document.addEventListener('click', function () {
    fetch(API + 'sessionTime', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    sweetAlert(4, response.message, 'login.php');
                } else {
                    console.log('Sesión activa');
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});
*/

// Función para mostrar el formulario de cambiar contraseña del usuario que ha iniciado sesión.
function openPasswordDialog() {
    // Se restauran los elementos del formulario.
    document.getElementById('password-form').reset();
    // Se abre la caja de dialogo (modal) que contiene el formulario para cambiar contraseña, ubicado en el archivo de las plantillas.
    let instance = M.Modal.getInstance(document.getElementById('password-modal'));
    instance.open();
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de cambiar clave.
document.getElementById('password-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    fetch(API + 'changePassword', {
        method: 'post',
        body: new FormData(document.getElementById('password-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cierra la caja de dialogo (modal) del formulario.
                    let instance = M.Modal.getInstance(document.getElementById('password-modal'));
                    instance.close();
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});


// Función para mostrar un mensaje de confirmación al momento de cerrar sesión.
function logOut() {
    // Se diseña la notificación
    swal({
        title: 'Advertencia',
        text: '¿Está seguro de cerrar la sesión?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
        if (value) {
            fetch(API + 'logOut', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'index_publico.php'); 
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            }).catch(function (error) {
                console.log(error);
            });
            // Se notifica que puede continuar con la sesión
        } else {
            sweetAlert(4, 'Puede continuar con la sesión', null);
        }
    });
}