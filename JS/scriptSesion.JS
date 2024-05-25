export function sesionOK() {
    let registro = JSON.parse(localStorage.getItem("registro"))
    let botonSesion = document.getElementById("botonSesion")
    if(registro){
        if (registro.login){
            botonSesion.innerText = "Cerrar Sesión"
            return true
        }
    }
    return false
}

export function cerrarSesion() {
    let registro = {
        login: false,
        usuario: " ",
        comentario: " "
    }
    localStorage.setItem("registro", JSON.stringify(registro))
}