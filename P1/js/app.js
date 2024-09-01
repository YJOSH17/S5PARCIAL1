// Obtener elementos del DOM
var tPresupuesto = parseInt(localStorage.getItem("presupuesto")) || 0;
var gastos = JSON.parse(localStorage.getItem("gastos")) || [];
var totalGastado = 0;

var divPresupuesto = document.querySelector('#divPresupuesto');
var presupuestoInput = document.querySelector('#presupuesto');
var btnPresupuesto = document.querySelector('#btnPresupuesto');
var divGastos = document.querySelector('#divGastos');
var totalPresupuesto = document.querySelector("#totalPresupuesto");
var progress = document.querySelector("#progress");
var totalDisponible = document.querySelector("#totalDisponible");
var totalGastadoElement = document.querySelector("#totalGastado");


// Función para actualizar los totales y la barra de progreso
function pintarDatos(filtroCategoria = 'todos') {
    let totalGastadoCategoria = 0;

    if (filtroCategoria === 'todos') {
        totalGastado = gastos.reduce((total, gasto) => total + parseFloat(gasto.costo), 0);
        totalGastadoCategoria = totalGastado;
    } else {
        totalGastadoCategoria = gastos
            .filter(gasto => gasto.categoria === filtroCategoria)
            .reduce((total, gasto) => total + parseFloat(gasto.costo), 0);
    }

    const disponible = tPresupuesto - totalGastado;
    totalDisponible.innerHTML = `$ ${disponible.toFixed(2)}`;
    totalGastadoElement.innerHTML = `$ ${totalGastadoCategoria.toFixed(2)}`;
/*
    const disponibleCategoria = tPresupuesto - totalGastadoCategoria;
    totalDisponible.innerHTML = `$ ${disponibleCategoria.toFixed(2)}`;
    totalGastadoElement.innerHTML = `$ ${totalGastadoCategoria.toFixed(2)}`;*/

    // Calcular el porcentaje de presupuesto disponible para la categoría
    const porcentajeDisponibleCategoria = ((tPresupuesto - totalGastadoCategoria) / tPresupuesto) * 100;

    // Actualizar la barra de progreso
    progress.setAttribute('value', porcentajeDisponibleCategoria.toFixed(2));
}

// Función de inicio
const inicio = () => {
    if (tPresupuesto > 0) {
        divPresupuesto.classList.remove("d-block");
        divGastos.classList.remove("d-none");
        divPresupuesto.classList.add("d-none");
        divGastos.classList.add("d-block");
        totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
        pintarDatos();
    } else {
        divPresupuesto.classList.remove("d-none");
        divGastos.classList.remove("d-block");
        divPresupuesto.classList.add("d-block");
        divGastos.classList.add("d-none");
    }
}

// Evento al presionar el botón de iniciar presupuesto
btnPresupuesto.onclick = () => {
    tPresupuesto = parseInt(presupuestoInput.value);
    if (isNaN(tPresupuesto) || tPresupuesto <= 0) {
        Swal.fire({ title: "ERROR!", text: "El presupuesto debe ser mayor a 0", icon: "error" });
        return;
    }
    localStorage.setItem('presupuesto', tPresupuesto);
    divPresupuesto.classList.remove("d-block");
    divGastos.classList.remove("d-none");
    divPresupuesto.classList.add("d-none");
    divGastos.classList.add("d-block");
    totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
    pintarDatos();
}

// Función para guardar un nuevo gasto
const guardarGasto = () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let descripcion = document.querySelector("#descripcion").value.trim();
    let costo = parseFloat(document.querySelector("#costo").value.trim());
    let categoria = document.querySelector("#categoria").value;

    if (descripcion.trim()===""||costo===0) {
        Swal.fire({ title: "ERROR!", text: "Se detectaron campos vacios", icon: "error" });
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(descripcion)) {
        Swal.fire({ title: "ERROR!", text: "La descripción no debe contener números ni signos especiales.", icon: "error" });
        return;
    }

    if (isNaN(costo) || costo <= 0) {
        Swal.fire({ title: "ERROR!", text: "El costo debe ser un número positivo.", icon: "error" });
        return;
    }

    const disponible = tPresupuesto - totalGastado;
    if (costo > disponible) {
        Swal.fire({ title: "ERROR!", text: "No tienes suficiente presupuesto disponible.", icon: "error" });
        return;
    }

    const gasto = { descripcion, costo, categoria };
    gastos.push(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));

    mostrarGastos();
    pintarDatos();
}

// Función para mostrar los gastos en el DOM
const mostrarGastos = (filtroCategoria = 'todos') => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let gastosFiltrados = gastos;

    if (filtroCategoria !== 'todos') {
        gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtroCategoria);
    }

    let gastosHTML = '';
    let index = 0;

    gastosFiltrados.forEach(gasto => {
        gastosHTML += `
            <div class="card text-center w-80 m-auto mt-3 shadow p-2">
                <div class="row">
                    <div class="col"><br><img src="img/${gasto.categoria}.png" alt="Sin imagen" class="imgCategoria"></div>
                    <div class="col text-start">
                        <p><b>Descripción:</b><small> ${gasto.descripcion}</small></p>
                        <p><b>Costo:</b><small>$ ${parseFloat(gasto.costo).toFixed(2)}</small></p>
                    </div>
                    <div class="col"><br>
                        <button class="btn btn-danger" onclick="eliminarG(${index})"><i class="bi bi-trash2-fill"></i></button>
                    </div>
                    <div class="col"><br>
                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editarGasto" onclick="mostarG(${index})"><i class="bi bi-pencil"></i></button>
                    </div>
                </div>  
            </div>`;
        index++;
    });

    if (gastosFiltrados.length === 0) {
        gastosHTML = `<small>NO HAY GASTOS</small>`;
    }

    document.getElementById("listaGasto").innerHTML = gastosHTML;
    pintarDatos(filtroCategoria);
}

// Evento para filtrar por categoría
document.querySelector("#filtrarCategoria").addEventListener("change", (e) => {
    mostrarGastos(e.target.value);
});

// Función para eliminar un gasto
function eliminarG(index) {
    Swal.fire({
        title: "¿Estás seguro de eliminar este gasto?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            gastos.splice(index, 1);
            localStorage.setItem("gastos", JSON.stringify(gastos));
            Swal.fire("El gasto se eliminó exitosamente", "", "success");
            mostrarGastos();
        }
    });
}

var indiceGasto;
function mostarG(index) {
    indiceGasto = index;
    var gasto = gastos[index];

    document.querySelector("#edescripcion").value = gasto.descripcion;
    document.querySelector("#ecosto").value = gasto.costo;
    document.querySelector("#ecategoria").value = gasto.categoria;
}

const actualizarG = document.getElementById("actualizar");

actualizarG.onclick = () => {
    let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let gasto = gastos[indiceGasto];
    
    let descripcion = document.getElementById("edescripcion").value.trim();
    let costo = parseFloat(document.getElementById("ecosto").value.trim());
    let categoria = document.getElementById("ecategoria").value;
    
    if (!/^[a-zA-Z\s]+$/.test(descripcion)) {
        Swal.fire({ title: "ERROR!", text: "La descripción no debe contener números ni signos especiales.", icon: "error" });
        return;
    }

    if (isNaN(costo) || costo <= 0) {
        Swal.fire({ title: "ERROR!", text: "El costo debe contener un número positivo.", icon: "error" });
        return;
    }

    const totalGastos = gastos.reduce((total, gastoItem) => total + parseFloat(gastoItem.costo), 0);
    const disponible = tPresupuesto - totalGastos + parseFloat(gasto.costo); 

    if (costo > disponible) {
        Swal.fire({ title: "ERROR!", text: "No tienes suficiente presupuesto disponible para actualizar este gasto.", icon: "error" });
        return;
    }

    gasto.descripcion = descripcion;
    gasto.costo = costo;
    gasto.categoria = categoria;

    localStorage.setItem("gastos", JSON.stringify(gastos));
    mostrarGastos();
    pintarDatos();
}

// Función para resetear el presupuesto y gastos
const reset = () => {
    Swal.fire({
        title: "¿Estás seguro de resetar la página?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            Swal.fire("La página se reseteó exitosamente", "", "success");
            window.location.reload(true);
        }
    });
}

inicio();