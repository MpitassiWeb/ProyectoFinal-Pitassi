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

async function login() {
  let usuarioIngresado = document.getElementById("inputUser").value
  let contraseñaIngresada = document.getElementById("inputPsw").value

  document.getElementById("formLogin").reset()

  let usuarios = await cargarUsuarios()

  let indice = usuarios.findIndex((user) => user.nombreUsuario === usuarioIngresado)

  let registro = {
    login: false,
    usuario: " ",
    comentario: " "
  }

  if (indice === -1) {
    registro.comentario = "No existe el usuario ingresado"
    localStorage.setItem("registro", JSON.stringify(registro))
    Swal.fire({
      title: '¡Error!',
      text: `El usuario ${usuarioIngresado}, no existe`,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#202022'
    })
  } else if (usuarios[indice].contraseña === contraseñaIngresada) {
    registro.login = true;
    registro.usuario = usuarios[indice].nombreUsuario;
    localStorage.setItem("registro", JSON.stringify(registro))
    Swal.fire({
      title: '¡Sesión iniciada!',
      text: `Disfrutá ${registro.usuario} `,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#202022'
    })
    let botonSesion = document.getElementById("botonSesion")
    botonSesion.innerText = "Cerrar Sesión"
  } else {
    registro.comentario = "La contraseña ingresada es Incorrecta"
    localStorage.setItem("registro", JSON.stringify(registro))
    Swal.fire({
      title: '¡Error!',
      text: 'La contraseña ingresada es incorrecta',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#202022'
    })
  }
}

function main() {
  let botonIniciar = document.getElementById("botonIniciar")
  botonIniciar.addEventListener("click", login)
}

main()