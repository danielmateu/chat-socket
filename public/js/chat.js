

const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-node-dmp.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null;

//Referencias HTMLº

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

//Validar token del localStorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: {'x-token': token}
    });

    const {usuario: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    // const socket = io();
    await conectarSocket();

}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token'),
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', () => {
        //TODO
    })

    socket.on('usuarios-activos', dibujarUsuarios)

    socket.on('mensaje-privado', () => {
        //TODO
    })
}

const dibujarUsuarios = (usuarios = []) => {

    let usersHtml = '';
    usuarios.forEach(({nombre,uid}) => {
        usersHtml += `
        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <span class="text-muted fs-6">${uid}</span>
            </p>
        </li>
        `
    })

    ulUsuarios.innerHTML = usersHtml;
}

const main = async() => {

    // validar JWT
    await validarJWT()

}


main();

