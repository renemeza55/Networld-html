// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CARRITO= 'http://34.125.63.184/api/public/carrito.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los productos del carrito de compras para llenar la tabla en la vista.
    readOrderDetail();
});

// Función para obtener el detalle del pedido (carrito de compras).
function readOrderDetail() {
    let params = new URLSearchParams(location.search);
    let IDC = params.get('id_cliente');
    let data = new FormData();
    data.append('id_cliente', IDC);
    fetch(API_CARRITO + 'readOrderDetail', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se declara e inicializa una variable para concatenar las filas de la tabla en la vista.
                    let content = '';
                    // Se declara e inicializa una variable para calcular el importe por cada producto.
                    let subtotal = 0;
                    // Se declara e inicializa una variable para ir sumando cada subtotal y obtener el monto final a pagar.
                    let total = 0;
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        subtotal = row.precio_producto * row.cantidad_producto;
                        total += subtotal;
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr>
                                <td>${row.nombre_producto}</td>
                                <td>${row.precio_producto}</td>
                                <td>${row.cantidad_producto}</td>
                                <td>${subtotal.toFixed(2)}</td>
                                <td>
                                    <a href="#" onclick="openUpdateDialog(${row.id_detalle_compra}, ${row.cantidad_producto})" class="btn waves-effect blue tooltipped" data-tooltip="Cambiar"><i class="material-icons">exposure</i></a>
                                    <a href="#" onclick="openDeleteDialog(${row.id_detalle_compra})" class="btn waves-effect red tooltipped" data-tooltip="Remover"><i class="material-icons">remove_shopping_cart</i></a>
                                </td>
                            </tr>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbody-rows').innerHTML = content;
                    // Se muestra el total a pagar con dos decimales.
                    document.getElementById('pago').textContent = total.toFixed(2);
                    // Se inicializa el componente Tooltip asignado a los enlaces para que funcionen las sugerencias textuales.
                    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
                    let params2 = new URLSearchParams(location.search);
                if(!params2.has('compra')){
                 var url = new URL(location);
                url.searchParams.append('compra', response.id_compra);
                location.href = url;
                }
                } else {
                    sweetAlert(4, response.exception, 'index.html?id_cliente=' + IDC);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

// Función para abrir una caja de dialogo (modal) con el formulario de cambiar cantidad de producto.
function openUpdateDialog(id, quantity) {
    // Se abre la caja de dialogo (modal) que contiene el formulario.
    let instance = M.Modal.getInstance(document.getElementById('item-modal'));
    instance.open();
    // Se inicializan los campos del formulario con los datos del registro seleccionado.
    document.getElementById('id_detalle_compra').value = id;
    document.getElementById('cantidad_producto').value = quantity;
    // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
    M.updateTextFields();
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de cambiar cantidad de producto.
document.getElementById('item-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    fetch(API_CARRITO + 'updateDetail', {
        method: 'post',
        body: new FormData(document.getElementById('item-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se actualiza la tabla en la vista para mostrar el cambio de la cantidad de producto.
                    readOrderDetail();
                    // Se cierra la caja de dialogo (modal) del formulario.
                    let instance = M.Modal.getInstance(document.getElementById('item-modal'));
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

// Función para mostrar un mensaje de confirmación al momento de finalizar el pedido.
function finishOrder() {
    // Se diseña la notificación
    swal({
        title: 'Aviso',
        text: '¿Está seguro de finalizar el pedido?',
        icon: 'info',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para realizar la petición respectiva, de lo contrario se muestra un mensaje.
        if (value) {
            fetch(API_CARRITO + 'finishOrder', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'index.html');
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
            sweetAlert(4, 'Puede seguir comprando', null);
        }
    });
}

// Función para mostrar un mensaje de confirmación al momento de eliminar un producto del carrito.
function openDeleteDialog(id) {
    // Se diseña la notificación
    swal({
        title: 'Advertencia',
        text: '¿Está seguro de remover el producto?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para realizar la petición respectiva, de lo contrario no se hace nada.
        if (value) {
            // Se define un objeto con los datos del registro seleccionado.
            const data = new FormData();
            data.append('id_detalle_compra', id);

            fetch(API_CARRITO + 'deleteDetail', {
                method: 'post',
                body: data
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            // Se cargan nuevamente las filas en la tabla de la vista después de borrar un producto del carrito.
                            readOrderDetail();
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
        }
    });
}