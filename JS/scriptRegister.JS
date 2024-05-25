import { sesionOK, cerrarSesion } from "./scriptSesion.JS"

async function registrarse() {
    let nuevoUsuario = {
        nombre: document.getElementById("inputName").value,
        apellido: document.getElementById("inputLast").value,
        email: document.getElementById("inputEmail").value,
        ciudad: document.getElementById("inputCity").value,
        telefono: document.getElementById("inputTelephone").value,
        nombreUsuario: document.getElementById("inputUserReg").value,
        contraseña: document.getElementById("inputPswReg").value,
    }

    document.getElementById("formDatos").reset()
    document.getElementById("formUser").reset()

    let usuarios = await cargarUsuarios()

    let usuarioBD = usuarios.findIndex((user) => user.nombreUsuario === nuevoUsuario.nombreUsuario)

    if ((nuevoUsuario.nombre === '') || (nuevoUsuario.apellido === '') || (nuevoUsuario.email === '') || (nuevoUsuario.nombreUsuario === '') || (nuevoUsuario.contraseña === '')) {
        Swal.fire({
            title: '¡Error!',
            text: 'Agregar los datos obligatorios (*) para el registro',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#202022'
        })
    } else if ((usuarioBD !== -1)) {
        Swal.fire({
            title: '¡Error!',
            text: 'El usuario ya existe. ¡Prueba con otro!',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#202022'
        })
    } else {
        usuarios.push(nuevoUsuario);

        Swal.fire({
            title: '¡Felicitaciones!',
            text: `${nuevoUsuario.nombreUsuario} te has registrado correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#202022'
        })
    }
}

async function cargarUsuarios() {
    try {
        const response = await fetch("../data/dataUsuarios.json")
        const usuarios = await response.json()
        return usuarios
    } catch (error) {
        let problema = "Algo salió mal"
        return problema
    }
}

function main() {
    if (sesionOK()) {
        Swal.fire({
            text: 'Ya has iniciado sesión',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#202022'
        })
        let botonSesion = document.getElementById("botonSesion")
        botonSesion.innerText = "Cerrar Sesión"
        botonSesion.addEventListener("click", cerrarSesion)
    } else {
        let botonRegistrar = document.getElementById("botonRegistrar")
        botonRegistrar.addEventListener("click", registrarse)
    }
}

main()