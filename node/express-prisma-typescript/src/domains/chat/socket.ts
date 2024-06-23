import { Server as SocketIOServer } from 'socket.io';
import { Constants, db } from '@utils';
import { ChatService, ChatServiceImpl } from './service';
import { ChatRepositoryImpl } from './repository';


//initializes the Socket.IO server
const socketHandler = (io: SocketIOServer) => {

  const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))
  
  // This event handler runs when a new client connects.
  io.on('connection', (socket) => {
    
    //This event handler runs when a client disconnects.
    socket.on('disconnect', () => {
      //console.log(`User ${socket.data.user.userId} disconnected`)
    })

    //This event handler runs when a client sends a message.
    socket.on('sendMessage', async (message) => {
      const { receiverId, content } = message
      const senderId = socket.data.user.userId; //TODO check this
      
      try {
        const newMessage = await service.sendMessage(senderId, receiverId, content)
        io.to(receiverId).emit('receiveMessage', newMessage)
        socket.emit('receiveMessage', newMessage)
      } catch (err: any) {
        socket.emit('error', err.message)
      }
    })

    //This event handler runs when a client wants to join a specific room
    socket.on('join', (userId) => {
      const senderId = socket.data.user.userId
      const roomId = generateRoomId(senderId, userId)
      socket.join(roomId)
    })
  })
}

// Generate a unique room ID based on two user IDs
const generateRoomId = (userId1: string, userId2: string) => {
  return [userId1, userId2].sort().join('_')
}

export default socketHandler;