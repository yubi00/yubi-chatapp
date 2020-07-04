const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, getAllRooms, removeRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = express.static(path.join(__dirname, '../public'))

app.use(publicDirectoryPath)

io.on('connection', (socket) => {
    console.log('after connecting, rooms: ', getAllRooms())
    socket.emit('totalrooms', getAllRooms())
    socket.on('join', ({username, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if( error ) {
            return callback(error)
        }
        socket.join(user.room)
        console.log('After joining rooms: ', getAllRooms())
        socket.emit('totalrooms', getAllRooms())

        socket.emit('message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
       
        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))  
        callback()
    })

    socket.on('disconnect', () => {
        console.log('disconnecting')
        const user = removeUser(socket.id)  
        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            
            if(getUsersInRoom(user.room).length === 0 ) {
                const rooms = removeRoom(user.room)
                console.log('After removing room, rooms: ', rooms)
                return socket.broadcast.emit('totalrooms',rooms)       
            }

            socket.broadcast.emit('totalrooms', getAllRooms())
        }
        console.log('After disconnecting, rooms: ', getAllRooms())
    })
    
})

server.listen(port, () => {
    console.log(`Server is runnig on port ${port}`)
})