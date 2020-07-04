const socket = io()
const $activeRooms = document.querySelector('#activerooms')

const $roomTemplate = document.querySelector('#room-template').innerHTML

socket.on('totalrooms', (rooms) => {
    console.log(rooms)
    const html = Mustache.render($roomTemplate, {rooms} )
     $activeRooms.innerHTML = html
})