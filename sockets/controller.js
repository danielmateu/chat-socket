const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require("../models");
// const { comprobarJWT } = require("../helpers");

const chatMensajes = new ChatMensajes();


const socketController = async (socket = new Socket(), io) => {

    // console.log('Cliente conectado', socket.id);
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if (!usuario) {
        return socket.disconnect()
    }

    //Agregar el usuario conectado 
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //Conectarlo a una sala especial
    socket.join(usuario.id); //global, socket.id, usuario.id

    //Limpiar cuando usuario se dewsconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {


        if (uid) {
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje })
        } else {

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);

        }
    })
}

module.exports = {
    socketController
}