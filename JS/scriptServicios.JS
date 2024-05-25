import { cerrarSesion, sesionOK } from "./scriptSesion.JS"

function obtenerCarritoLS() {
    let carrito = []

    let carritoLS = JSON.parse(localStorage.getItem("carrito"))
    if(carritoLS){
        carrito = carritoLS
    }

    return carrito
}

function agregarAlCarrito(servicios, e) {
    
    let carrito = obtenerCarritoLS()
    
    let idServicio = Number(e.target.id)
    let posicion = carrito.findIndex((service) => service.id === idServicio)
    let servicioBuscado = servicios.find((service) => service.id === idServicio)

    Toastify({
        className: "tostada",
        text: `Se agregó ${servicioBuscado.nombre}`,
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "#202022",
        },
        onClick: function(){} 
    }).showToast()

    if (posicion !== -1) {
        carrito[posicion].unidades++;
        carrito[posicion].subtotal = carrito[posicion].precio * carrito[posicion].unidades;
    } else {
        carrito.push({
            id: servicioBuscado.id,
            img: servicioBuscado.img,
            nombre: servicioBuscado.nombre,
            precio: servicioBuscado.precio,
            subtotal: servicioBuscado.precio,
            unidades: 1,
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito(carrito)
}

function crearTarjetas(servicios) {
    let sectionMantenimiento = document.getElementById("mantenimiento")
    let sectionReparacion = document.getElementById("reparacion")
    let sectionOptimizacion = document.getElementById("optimizacion")

    sectionMantenimiento.innerHTML = ""
    sectionReparacion.innerHTML = ""
    sectionOptimizacion.innerHTML = ""

    servicios.forEach(servicio => {
        let tarjetaServicio = document.createElement("article")

        tarjetaServicio.innerHTML = `
            <img src=../img/${servicio.img} class="card-img-top">
            <div class="card-body">
                <h3 class="card-title">${servicio.nombre}</h3>
                <p class="card-text">${servicio.descripcion}</p>
                <p class="card-text"> $${servicio.precio}</p>
                <button class="mi-button">Ver más</button>
                <button id="${servicio.id}" class="mi-button">Agregar al carrito</button>
            </div>
        `
        tarjetaServicio.className = "card mb-3 shadow"
        if(servicio.categoria === "MANTENIMIENTO"){
            sectionMantenimiento.append(tarjetaServicio)
        }else if(servicio.categoria === "REPARACION")
        {
            sectionReparacion.append(tarjetaServicio)
        }else{
            sectionOptimizacion.append(tarjetaServicio)
        }

        let botonCarrito = document.getElementById(servicio.id)
        botonCarrito.addEventListener("click", (e) => agregarAlCarrito(servicios, e))
    })
} 


function filtrarServicios(servicios, categoria) {
    let serviciosFiltrados = servicios.filter(servicio => servicio.categoria === categoria.toUpperCase())
    return serviciosFiltrados;
}

function renderizar(servicios, categoria) { 
    let serviciosFiltrados = ""

    if(categoria === ""){
        serviciosFiltrados = servicios
    }else{
        serviciosFiltrados = filtrarServicios(servicios, categoria)
    }

    crearTarjetas(serviciosFiltrados)
}

function eliminarServicio(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(7))
    
    carrito = carrito.filter((servicio) => servicio.id !== id)

    localStorage.setItem("carrito", JSON.stringify(carrito))

    e.target.parentElement.remove()
}

function totalCarrito() {
    let carrito = obtenerCarritoLS()
    let total = 0;
    carrito.forEach((carro) => {
        total = total + carro["subtotal"];
    });
    return total;
}

function textoCarrito(longitud){
    if(longitud > 0){
        return `Total de la compra:  $ ${totalCarrito()} `
    }
    return `Su carrito está vacío`
}

function renderizarCarrito(){
    let carrito = obtenerCarritoLS()

    let longitudCarrito = carrito.length

    let contenedor = document.getElementById("contenedorCarrito")
    contenedor.innerHTML = ""

    let total = document.createElement("h3")
    total.innerText = textoCarrito(longitudCarrito)

    carrito.forEach((servicio) => {
        let tarjetaCarrito = document.createElement("div")

        tarjetaCarrito.className = "tarjetaCarrito"
        tarjetaCarrito.innerHTML = `
            <img src=../img/${servicio.img}>
            <h3>${servicio.nombre}</h3>
            <p> Unidades: ${servicio.unidades}</p>
            <p> Precio: $${servicio.subtotal}</p>
            <button id="carrito${servicio.id}" class="mi-button">Eliminar</button>
        `
        contenedor.append(tarjetaCarrito)

        let botonEliminar = document.getElementById(`carrito${servicio.id}`)
        botonEliminar.addEventListener("click", function(e){
            eliminarServicio(e)
            longitudCarrito--
            total.innerText = textoCarrito(longitudCarrito)
        })
    })

    contenedor.append(total)
}


function switchCarrito(e) {
    let contenedorServicios = document.getElementById("contenedorServicios")
    let contenedorCarrito = document.getElementById("contenedorCarrito")

    contenedorCarrito.classList.toggle("oculto")
    contenedorServicios.classList.toggle("oculto")

    if(e.target.innerText === "Ver servicios"){
        e.target.innerText = "Ver carrito"
    }else{
        e.target.innerText = "Ver servicios"
    }
}

function finalizarCompra() {
    let carrito = obtenerCarritoLS()
    if (carrito.length === 0){
        Swal.fire({
            title: 'Error!',
            text: 'Su carrito está vacío',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#202022'
        })
    }else{
        Swal.fire({
            title: '¡Felicitaciones!',
            text: 'Compra finalizada con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#202022'
        })
        localStorage.removeItem("carrito")
        renderizarCarrito([])
    }
}

async function cargarServicios (){
    try {
        const response = await fetch ("../data/dataServicios.json")
        const servicios = await response.json()
        return servicios
    } catch (error) {
        let problema = "Algo salió mal"
        return problema
    }
}

async function main() {
    let servicios = await cargarServicios()

    let botonSesion = document.getElementById("botonSesion")
    let sectionServicios = document.getElementById("sectionServicios")

    if(sesionOK()){
        renderizarCarrito()

        let botonComprar = document.getElementById("comprar")
        botonComprar.addEventListener("click", finalizarCompra)

        let botonOcultar = document.getElementById("ocultar")
        botonOcultar.addEventListener("click", switchCarrito)

        let drop = document.getElementById("dropDown")
        renderizar(servicios, "")
        drop.addEventListener("change", () => renderizar(servicios, drop.value))
    }else{
        sectionServicios.innerHTML = ""
        sectionServicios.className = "container"

        Swal.fire({
            title: 'Inicia Sesión',
            text: 'Necesitas iniciar sesión para ver nuestros servicios',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#202022'
        })

        let noSesion = document.createElement ("div")
        noSesion.innerHTML = `
            <a href="./login.html"> Iniciar Sesión </a>
        `
        sectionServicios.append(noSesion)
    }

    botonSesion.addEventListener("click", cerrarSesion)
}

main();