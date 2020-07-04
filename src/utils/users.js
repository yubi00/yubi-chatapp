const users = []
let rooms = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser) {
        return {
            error: 'invalid username'
            
        }
    }

      //check for existing rooms
      const existingroom = rooms.find((userroom) => userroom === room)
      if(!existingroom) {
          rooms.push(room)
      }

    //store user
    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) =>  user.id === id) 

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id )
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

const getAllRooms = () => {
    return rooms
}

const removeRoom = (room) => {
    rooms = rooms.filter((userroom) => userroom !== room)
    return rooms
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAllRooms,
    removeRoom
}