const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const  {ChatMensajes}  = require("../models");
// const { comprobarJWT } = require("../helpers");

const chatMensajes = new ChatMensajes();


const socketController = async(socket = new Socket(), io ) => {

    // console.log('Cliente conectado', socket.id);
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if(!usuario){ 
        return socket.disconnect()
    }

    //Agregar el usuario conectado 
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    
    //Limpiar cuando usuario se dewsconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })
}

module.exports = {
    socketController
}