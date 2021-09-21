// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CATALOGO = 'http://34.125.63.184/api/public/catalogo.php?action=';
const API_CARRITO = 'http://34.125.63.184/api/public/carrito.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const ID = params.get('id');
    // Se llama a la función que muestra el detalle del producto seleccionado previamente.
    readOneProducto(ID);
});

// Función para obtener y mostrar los datos del producto seleccionado.
function readOneProducto(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id_producto', id);

    fetch(API_CATALOGO + 'readOne', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se colocan los datos en la tarjeta de acuerdo al producto seleccionado previamente.
                    document.getElementById('imagen').setAttribute('src', '../../resources/img/productos/' + response.dataset.imagen_producto);
                    document.getElementById('nombre').textContent = response.dataset.nombre_producto;
                    document.getElementById('descripcion').textContent = response.dataset.descripcion;
                    document.getElementById('precio').textContent = response.dataset.precio_producto;
                    // Se asignan los valores a los campos ocultos del formulario.
                    document.getElementById('id_producto').value = response.dataset.id_producto;
                    document.getElementById('precio_producto').value = response.dataset.precio_producto;
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    document.getElementById('title').innerHTML = `<i class="material-icons small">cloud_off</i><span class="red-text">${response.exception}</span>`;
                    // Se limpia el contenido cuando no hay datos para mostrar.
                    document.getElementById('detalle').innerHTML = '';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
        // Lanza el error de la consola
    }).catch(function (error) {
        console.log(error);
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de agregar un producto al carrito.
document.getElementById('shopping-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    fetch(API_CARRITO + 'createDetail', {
        method: 'post',
        body: new FormData(document.getElementById('shopping-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
                if (response.status) {
                    sweetAlert(1, response.message, 'carrito.php');
                } else {
                    // Se verifica si el cliente ha iniciado sesión para mostrar la excepción, de lo contrario se direcciona para que se autentique. 
                    if (response.session) {
                        sweetAlert(2, response.exception, null);
                    } else {
                        sweetAlert(3, response.exception, 'login_publico.php');
                    }
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
        // Lanza el error de la consola
    }).catch(function (error) {
        console.log(error);
    });
});

// Constantes para establecer las rutas y parámetros de comunicación con la API.
const API_VALORACIONES = '../../app/api/dashboard/valoraciones.php?action=';
const ENDPOINT_VALORACIONES = '../../app/api/dashboard/valoraciones.php?action=readAll2';
const ENDPOINT_CLIENTES = '../../app/api/dashboard/clientes.php?action=readAll';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_VALORACIONES);
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se establece un icono para el estado del producto.
        (row.estado_comentario) ? icon = '' : icon = '';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.nombre_cliente}</td>
                <td>${row.nombre_producto}</td>
                <td>${row.calificacion_producto}</td>
                <td>${row.comentario_producto}</td>
                <td><i class="material-icons ">${icon}</i></td>
                <td>
                    
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows').innerHTML = content;
    // Se inicializa el componente Material Box asignado a las imagenes para que funcione el efecto Lightbox.
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    // Se inicializa el componente Tooltip asignado a los enlaces para que funcionen las sugerencias textuales.
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
    // Se evita recargar la página web después de enviar el formulario.



// Función para preparar el formulario al momento de insertar un registro.
function openCreateDialog() {
    // Se restauran los elementos del formulario.
    document.getElementById('save-form').reset();
    // Se abre la caja de dialogo (modal) que contiene el formulario.
    let instance = M.Modal.getInstance(document.getElementById('save-modal'));
    instance.open();
    // Se asigna el título para la caja de dialogo (modal).
    document.getElementById('modal-title').textContent = 'Ingresar una valoracion';
    // Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js
    fillSelect(ENDPOINT_VALORACIONES, 'producto_valoracion', null);
    fillSelect(ENDPOINT_CLIENTES, 'cliente_valoracion', null);
}

// Función para preparar el formulario al momento de modificar un registro.
function openUpdateDialog(id) {
    // Se restauran los elementos del formulario.
    document.getElementById('save-form').reset();
    // Se abre la caja de dialogo (modal) que contiene el formulario.
    let instance = M.Modal.getInstance(document.getElementById('save-modal'));
    instance.open();
    // Se asigna el título para la caja de dialogo (modal).
    document.getElementById('modal-title').textContent = 'Actualizar valoración';

    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id_valoracion', id);

    fetch(API_VALORACIONES + 'readOne', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById('id_valoracion').value = response.dataset.id_valoracion;
                    document.getElementById('calificacion_producto').value = response.dataset.calificacion_producto;
                    document.getElementById('comentario_producto').value = response.dataset.comentario_producto;
                    fillSelect(ENDPOINT_VALORACIONES, 'producto_valoracion', response.dataset.id_producto);
                    fillSelect(ENDPOINT_CLIENTES, 'cliente_valoracion', response.dataset.id_cliente);
                    if (response.dataset.estado_comentario) {
                        document.getElementById('estado_comentario').checked = true;
                    } else {
                        document.getElementById('estado_comentario').checked = false;
                    }
                    // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
                    M.updateTextFields();
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
        // Lanza el error de la consola
    }).catch(function (error) {
        console.log(error);
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('save-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    if (document.getElementById('id_valoracion').value) {
        action = 'update';
    } else {
        action = 'create';
    }
    // Se guarda el modal
    saveRow(API_VALORACIONES, action, 'save-form', 'save-modal');
});

// Función para establecer el registro a eliminar y abrir una caja de dialogo de confirmación.
function openDeleteDialog(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id_valoracion', id);
    // Se llama a la función que elimina un registro. Se encuentra en el archivo components.js
    confirmDelete(API_VALORACIONES, data);
}