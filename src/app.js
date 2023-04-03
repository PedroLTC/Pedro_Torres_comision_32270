const express = require('express')
const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')
const viewsRouter = require('./routes/views.router.js')
const handlebars = require('express-handlebars')
const MessageManagerMongo = require('./Daos/messageManagerMongo.js')
const { Server, Socket } = require('socket.io')
const { dbConnection } = require('./config/conectionMongo.js')

dbConnection()

require('dotenv').config()

const app = express()
const PORT = 8080 || process.env.PORT
const mmDB = new MessageManagerMongo()



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/virtual', express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)


const httpServer = app.listen(PORT, err => {
    if (err) console.log(err)
    console.log(`Server up listening on port ${httpServer.address().port}`)
})


const io = new Server(httpServer)

const mensajes = []

const addMessagetoDB = async (data) => {
    try {
        const message = await mmDB.addMessage(data)
        if (!message) return console.log(`Mesagge not added`)
        if (message) return console.log(`Mesagge added`)
    } catch (err) {
        console.log(err)
    }
}


io.on('connection', socket => {
    console.log('new client connected')

    socket.on('message', data => {

        const messageToDataBase = addMessagetoDB(data)
        mensajes.push(data) 
        io.emit('messageLogs', mensajes)

    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data)
    })

    socket.on('disconnect', () => {
        console.log('server socket disconnected')
    })


})



// let productos = [
//     // {
//     //     title: 'pendrive',
//     //     description: '500 Gb',
//     //     price: '120',
//     //     stock: '250',
//     //     thumbnail: ''
//     // }
// ]

// io.on('connection', socket => {
//     console.log('Nuevo cliente conectado')

//     socket.on('newProduct', data => {
//         productos.push(data)

//         io.emit(`productsLogs`, productos)
//     })

// })