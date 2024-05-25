import { cerrarSesion, sesionOK } from "./scriptSesion.JS"

function main() {
    if (sesionOK()) {
        let botonSesion = document.getElementById("botonSesion")
        botonSesion.addEventListener("click", cerrarSesion)
    }
}

main()