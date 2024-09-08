let items = JSON.parse(localStorage.getItem('items')) || [];
let caloriasConsumidas = 0;
let caloriasEjercicio = 0;

const limpiar=()=>{
    document.querySelector("#act").value = "";
    document.querySelector("#cal").value = "";
}

function guardarAlimento() {
    const actividad = document.getElementById('act').value.trim();
    const calorias = parseInt(document.getElementById('cal').value.trim());
    const categoria = document.getElementById('categoria').value;

    // Validaciones
    if (actividad.trim()==="") {
        Swal.fire({ title: "ERROR!", text: "Se detectaron campos vacios", icon: "error" });
        limpiar();
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(actividad)) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'La actividad solo puede contener letras y espacios.' });
        limpiar();
        return;
    }

    if (isNaN(calorias) || calorias <= 0) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Las calorías deben ser un número positivo mayor que cero.' });
        limpiar();
        return;
    }

    const nuevoItem = { categoria, actividad, calorias };
    items.push(nuevoItem);
    localStorage.setItem('items', JSON.stringify(items));
    actualizarCalorias(nuevoItem, 'agregar');
    Swal.fire({ icon: 'success', title: 'Éxito', text: 'Datos guardados correctamente.' });
    mostrarDatos();
    limpiar();
}

function mostrarDatos() {
    const actividadesDiv = document.getElementById('Actividades');
    let tableHtml = ``;
    items.forEach((item, index) => {
        const colorEtiqueta = item.categoria === 'comida' ? 'bg-neon-naranja' : 'bg-neon-verde';
        tableHtml += `
            <div class="card w-100 m-auto mt-3 shadow p-2 ${colorEtiqueta}">
                <div class="row">
                    <p id="catcolor"><small><b>${item.categoria.toUpperCase()}</b></small></p>
                    <p><b>DESCRIPCIÓN:</b> <small>${item.actividad}</small></p>
                    <p><b><small><h1 style="color: #006eff;">${item.calorias} CALORÍAS</h1></small></b></p>
                    <div class="col">
                        <br>
                        <button class="btn btn-outline-dark" onclick="eliminarA(${index})"><i class="bi bi-trash2-fill"></i></button>
                    </div>
                    <div class="col">
                        <br>
                        <button class="btn btn-outline-dark" onclick="cargarDatosEdicion(${index})" data-bs-toggle="modal" data-bs-target="#editarA"><i class="bi bi-pencil-fill"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
    actividadesDiv.innerHTML = tableHtml;
}

function eliminarA(index) {
    const item = items[index];
    Swal.fire({
        title: "¿Estás seguro de eliminar este ítem?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            items.splice(index, 1);
            localStorage.setItem('items', JSON.stringify(items));
            actualizarCalorias(item, 'eliminar');
            mostrarDatos();
        }
    });
}

let indiceItem;
function cargarDatosEdicion(index) {
    indiceItem = index;
    const item = items[index];
    document.getElementById('eact').value = item.actividad;
    document.getElementById('ecal').value = item.calorias;
    document.getElementById('ecategoria').value = item.categoria;
}

function editAlimento() {
    const actividad = document.getElementById('eact').value.trim();
    const calorias = parseInt(document.getElementById('ecal').value.trim());
    const categoria = document.getElementById('ecategoria').value;

    // Validaciones
    if (!/^[a-zA-Z\s]+$/.test(actividad)) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'La actividad solo puede contener letras y espacios.' });
        return;
    }

    if (isNaN(calorias) || calorias <= 0) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Las calorías deben ser un número positivo mayor que cero.' });
        return;
    }

    // Obtener el ítem anterior para restar sus calorías
    const itemAnterior = items[indiceItem];

    // Actualizar el ítem en la lista
    items[indiceItem] = { categoria, actividad, calorias };
    localStorage.setItem("items", JSON.stringify(items));

    // Actualizar las calorías: restar las antiguas y sumar las nuevas
    actualizarCalorias(itemAnterior, 'eliminar');
    actualizarCalorias(items[indiceItem], 'agregar');

    // Actualizar la vista automáticamente
    mostrarDatos();
    Swal.fire({ icon: 'success', title: 'Éxito', text: 'Ítem actualizado correctamente.' });
}

function actualizarCalorias(item, accion) {
    const factor = (accion === 'eliminar') ? -1 : 1;
    if (item.categoria === 'comida') {
        caloriasConsumidas += factor * item.calorias;
    } else {
        caloriasEjercicio += factor * item.calorias;
    }
    actualizarResumen();
}

function actualizarResumen() {
    const caloriasDiferencia = caloriasConsumidas - caloriasEjercicio;
    document.getElementById('caloriasConsumidas').innerText = caloriasConsumidas;
    document.getElementById('caloriasEjercicio').innerText = caloriasEjercicio;
    document.getElementById('caloriasDiferencia').innerText = caloriasDiferencia;
}



// Inicializar datos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarDatos();
    items.forEach(item => actualizarCalorias(item, 'agregar'));
});
