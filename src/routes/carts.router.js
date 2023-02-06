const { Router } = require('express')
const CartsManager = require(`../Daos/cartsManager`)


const path = (`./src/mockDB/datacarts.json`)


const cm = new CartsManager(path)
const router = Router()


const addCartsToModule = async newCart => {
    try {
        const carCreated = await cm.addCart(newCart)
        return carCreated
    } catch (err) {
        return console.error(`Carts no Creado`)
    }
}

const getCartFromModuleById = async cid => {
    try {
        const cartById = await cm.getCartById(cid)
        return cartById
    } catch (err) {
        return console.error(`Id del carrito no encontrado`)
    }
}

const addProductToCartToModule = async (cid, pid) => {
    try {
        const addProductToCart = await cm.addProductToCart(cid, pid)
        return addProductToCart
    } catch (err) {
        return console.error(`Producto no agregado`)
    }
}



router.post('/', async (req, res) => {
    try {
        const newCart = req.body
        newCart.products = []
        const cartCreated = await addCartsToModule(newCart)
        res.status(200).json({
            cartCreated,
            msg: `Carrito creado`
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            msg: `Error al crear el carrito`
        })
    }
})


router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartById = await getCartFromModuleById(parseInt(cid))
        if (!cartById) {
            return res.status(404).json({
                msg: `Carrito no encontrado`
            })
        }

        res.status(200).json({
            msg: `Productos del carrito ${cid}`,
            Products: cartById.products
        })
    } catch (error) {
        res.status(500).json({
            msg: `Error al obtener los productos del carrito ${cid}`,
        })
    }
})

// /:cid/product/:pid 

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const productToCart = await addProductToCartToModule(cid, pid)
        res.status(200).json({
            productToCart,
            msg: `Producto agregado al carrito`
        })
    }

    catch (error) {
        res.status(500).json({
            msr: `Error al intentar agregar un prodcuto al carrito`
        })
    }

})

module.exports = router 