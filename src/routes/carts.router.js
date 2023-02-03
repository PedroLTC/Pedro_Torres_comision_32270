const { Router} = require('express')

const router = Router()

router.get('/', (req, res) => {

    return res.status(200).send('Ingresado al archivo Carts')

})

//router.post('/', (req, res) => {}) // raíz crea un carrito 
//router.post('/', (req, res) => {}) // /:cid/product/:pid 
//router.get('/', (req, res) => {}) // /:cid 

module.exports = router 