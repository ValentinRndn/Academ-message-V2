import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { Server as HttpServer } from 'http'
import initSocketIO from '../socket'

export default defineNitroPlugin((nitroApp) => {
  // L'événement 'ready' est émis lorsque le serveur HTTP est prêt
  nitroApp.hooks.hook('request', (event) => {
    // Vérifier si le serveur Socket.io a été initialisé
    if (!nitroApp.socketInitialized && event.node.req.socket.server) {
      console.log('Initializing Socket.IO server')
      const httpServer = event.node.req.socket.server as HttpServer
      
      // Initialiser Socket.io avec le serveur HTTP
      const io = initSocketIO(httpServer)
      
      // Marquer comme initialisé pour éviter les réinitialisations
      nitroApp.socketInitialized = true
    }
  })
})