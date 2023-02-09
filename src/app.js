const express = require('express')
const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')
const viewsRouter = require('./routes/views.router.js')
const handlebars = require('express-handlebars')
const { Server, Socket } = require('socket.io')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/virtual' ,express.static(__dirname+'/public'))

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

let newProduct = {

    title: 'Teclado',
    precio: 100,
    codigo: 'ABCD'

}

io.on('connection', socket => {
    console.log('Nuevo cliente conectado') 

    socket.emit('newProduct', newProduct)    
    
})
