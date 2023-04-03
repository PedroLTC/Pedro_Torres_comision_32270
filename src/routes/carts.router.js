const { Router } = require('express')
const CartsManager = require(`../Daos/cartsManager`)
const CartManagerMongo = require(`../Daos/cartsManagerMongo.js`)


const path = (`./src/mockDB/datacarts.json`)


const cm = new CartsManager(path)
const cmDB = new CartManagerMongo()
const router = Router()

//Done
const addCartsToModule = async newCart => {
    try {
        // const carCreated = await cm.addCart(newCart)
        const carCreated = await cmDB.addCart(newCart)
        return carCreated
    } catch (err) {
        return console.error(`Carts no Creado`)
    }
}
//Done
const getCartFromModuleById = async cid => {
    try {
        // const cartById = await cm.getCartById(cid)
        const cartById = await cmDB.getCartById(cid)
        return cartById
    } catch (err) {
        return console.error(`Id del carrito no encontrado`)
    }
}

const addProductToCartToModule = async (cid, pid) => {
    try {
        // const addProductToCart = await cm.addProductToCart(cid, pid)
        const addProductToCart = await cmDB.addProductToCart(cid, pid)
        return addProductToCart
    } catch (err) {
        return console.error(`Producto no agregado`)
    }
}


//Done
router.post('/', async (req, res) => {
    try {
        const newCart = req.body
        newCart.products = []
        const cartCreated = await addCartsToModule(newCart)
        // res.status(200).json({
        //     cartCreated,
        //     msg: `Carrito creado`
        // })
        res.status(cartCreated.status).send(cartCreated.report)
    } catch (error) {
        console.error(error)
        // res.status(500).json({
        //     msg: `Error al crear el carrito`
        // })
        res.status(500).send(`Error al crear el carrito: ${error.message}`)
    }
})

//Done 
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        // const cartById = await getCartFromModuleById(parseInt(cid))
        const cartById = await getCartFromModuleById(cid)

        if (!cartById) {
            // return res.status(404).json({msg: `Carrito no encontrado`})
            return res.status(404).send({ message: 'Cart ID not found' })
        }
        res.status(200).send(cartById)
        // res.status(200).json({
        //     msg: `Productos del carrito ${cid}`,
        //     Products: cartById.products
        // })
    } catch (error) {
        // res.status(500).json({
        //     msg: `Error al obtener los productos del carrito ${cid}`,
        // })
        res.send(500).send(`Error getting the cart`)
    }
})

// /:cid/product/:pid 

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const productToCart = await addProductToCartToModule(cid, pid)
        //console.log(productToCart)
        // res.status(200).json({
        //     productToCart,
        //     msg: `Producto agregado al carrito`
        // })
        if(!productToCart) res.status(404).send({ message: `Update failed`})
        
        res.status(200).send(productToCart)
    }

    catch (error) {
        // res.status(500).json({
        //     msr: `Error al intentar agregar un prodcuto al carrito`
        // })
        res.status(500).send(`Error updating the cart`)
    }

})

module.exports = router 