
var Platillos = JSON.parse(localStorage.getItem("platillos")) || [];
var ordenes  = JSON.parse(localStorage.getItem("ordenes")) || [];
var propina=0, subtotal=0, total=0, porcentaje=10;
//CONSTANTE PARA LIMPIAR LOS INPUTS DE LA MODAL
const limpiar=()=>{
    document.querySelector("#descripcion").value = "";
    document.querySelector("#costo").value = "";
}

//GUARDA LOS PLATILLOS EN EL LOCAL STORAGE
const guardarAlimento=()=>{
Platillos= JSON.parse(localStorage.getItem("platillos")) || [];
let descripcion = document.querySelector("#descripcion").value.trim();
let costo = parseFloat(document.querySelector("#costo").value.trim());

if (descripcion.trim()==="") {
    Swal.fire({ title: "ERROR!", text: "Se detectaron campos vacios", icon: "error" });
    return;
    limpiar();
}

if (!/^[a-zA-Z\s]+$/.test(descripcion)) {
    Swal.fire({ title: "ERROR!", text: "La descripción no debe contener números ni signos especiales.", icon: "error" });
    return;
    limpiar();
}

if (isNaN(costo) || costo <= 0) {
    Swal.fire({ title: "ERROR!", text: "El costo debe ser un número positivo.", icon: "error" });
    return;
    limpiar();
}

const platillo = { descripcion, costo};
Platillos.push(platillo);
localStorage.setItem("platillos", JSON.stringify(Platillos));

mostrarPlatillos();
limpiar();

}


const mostrarPlatillos = () => {
    let index = 0;
    Platillos = JSON.parse(localStorage.getItem("platillos")) || [];

    let platillosHTML = '';
    

    Platillos.map(platillo => {
        platillosHTML += `
        <div class="d-flex justify-content-between">
            <button type="button" onclick="add(${index})" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">${platillo.descripcion}
            <span class="badge text-bg-primary rounded-pill ">$ ${parseFloat(platillo.costo).toFixed(2)}</span>
            <button class="btn btn-danger d-block btn-lg " onclick="eliminarP()"><i class="bi bi-x-octagon"></i></button>
            </button>
        </div><br>`;
        index++;
    });

    document.getElementById("PlatillosMENU").innerHTML = platillosHTML;
    cargarOrdenes();  
}

const add=(indexMenu)=>{
   ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
   Platillos = JSON.parse(localStorage.getItem("platillos")) || [];
   let indexActual=-1
   indexActual=ordenes.findIndex((orden)=>orden.index === indexMenu);
   if (indexActual == -1) {
    let orden = {index:indexMenu,cantidad:1}
    ordenes.push(orden);
   }else{
    ordenes[indexActual].cantidad++;
   }
   localStorage.setItem("ordenes",JSON.stringify(ordenes));
   cargarOrdenes();

}

const cargarOrdenes=()=>{
    subtotal=0;
    let indexOrden=0;
    ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    Platillos = JSON.parse(localStorage.getItem("platillos")) || [];
    let divOrden=document.getElementById("orden");
    let ordenHTML=``
    if (ordenes.length==0) {
        divOrden.innerHTML=`<h2 class="text-center"><b>NO HAY ORDENES</b></h2>`
        document.getElementById("subtotal").innerHTML=`$ 0.00`
        document.getElementById("propina").innerHTML=`$ 0.00`
        document.getElementById("total").innerHTML=`$ 0.00`
    }else{
        ordenes.map(o=>{
            ordenHTML+=`
            <div class="list-group-item list-group-item-action border my-2">
                <div class="d-flex w-100 justify-content-between">
                    <h4 class="align-middle">${Platillos[o.index].descripcion}</h4>
                </div>
                <div class="d-flex w-100 justify-content-between">
                    <h4 class="align-bottom">Cantidad: <b>${o.cantidad}</b></h4>
                    <h4 class="align-middle"><b>$ ${(parseFloat(Platillos[o.index].costo)*parseFloat(o.cantidad)).toFixed(2)}</b></h4>
                    <button class="btn btn-danger my-1" onclick="del(${indexOrden})"><i class="bi bi-x-octagon"></i></button>
                </div>
            </div>`;
            indexOrden++;
            subtotal+=(parseFloat(Platillos[o.index].costo)*parseFloat(o.cantidad));
        })
        divOrden.innerHTML=ordenHTML;
        propina=((porcentaje/100)*subtotal);
        document.getElementById("subtotal").innerHTML=`$ ${subtotal.toFixed(2)}`;
        document.getElementById("propina").innerHTML=`$ ${propina.toFixed(2)}`;
        document.getElementById("total").innerHTML=`$ ${(subtotal+propina).toFixed(2)}`;

    }
}

    const calcularPropina=()=>{
        let radioPropina = document.querySelector('input[name="propina"]:checked');
        if (radioPropina) {
            porcentaje=parseFloat(radioPropina.value);
        }
        cargarOrdenes();
    }

    const del=(index)=>{
        ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
        Swal.fire({
            title: "¿Estás seguro de eliminar este platillo de la orden?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Sí",
            denyButtonText: "No",
            cancelButtonColor: "#dc3545",
            confirmButtonColor: "#198754",
            denyButtonColor: "#dc3545",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("El platillo se eliminó exitosamente", "", "success");
                ordenes.splice(index, 1);
                localStorage.setItem("ordenes", JSON.stringify(ordenes));
                cargarOrdenes();
            }
        });
    }

    const terminar=()=>{
        Swal.fire({
            title: "¿Esta completa la orden?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Sí",
            denyButtonText: "No",
            cancelButtonColor: "#dc3545",
            confirmButtonColor: "#198754",
            denyButtonColor: "#dc3545",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("ordenes");
                subtotal=0;
                propina=0;
                total=0;
                cargarOrdenes();
                
                Swal.fire("ORDEN REALIZADA", "", "success");
            }
        });
    }

function eliminarP(index) {
    
    Swal.fire({
        title: "¿Estás seguro de eliminar este platillo?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            Platillos.splice(index, 1);
            localStorage.setItem("platillos", JSON.stringify(Platillos));
            Swal.fire("El platillo se eliminó exitosamente", "", "success");
            mostrarPlatillos();
        }
    });
}


mostrarPlatillos();
