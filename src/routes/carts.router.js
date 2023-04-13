const { Router } = require('express')
const CartsManager = require(`../Daos/cartsManager`)
const CartManagerMongo = require(`../Daos/cartsManagerMongo.js`)


const path = (`./src/mockDB/datacarts.json`)


const cm = new CartsManager(path)
const cmDB = new CartManagerMongo()
const router = Router()


const addCartsToModule = async newCart => {
    try {
        // const carCreated = await cm.addCart(newCart)
        const carCreated = await cmDB.addCart(newCart)
        return carCreated
    } catch (err) {
        return console.error(`Carts not created`)
    }
}

const getCartFromModuleById = async cid => {
    try {
        // const cartById = await cm.getCartById(cid)
        const cartById = await cmDB.getCartById(cid)
        return cartById
    } catch (err) {
        return console.error(`Id not found`)
    }
}

const addProductToCartToModule = async (cid, pid) => {
    try {
        // const addProductToCart = await cm.addProductToCart(cid, pid)
        const addProductToCart = await cmDB.addProductToCart(cid, pid)
        return addProductToCart
    } catch (err) {
        return console.error(`Product not added to cart`)
    }
}

const deleteProductFromCart = async (cid, pid) => {
    try {
        const deleteProductFromCart = await cmDB.deleteProductCart(cid, pid)
        return deleteProductFromCart
    } catch (err) {
        return console.error(`Product no deleted of cart`)
    }
}

const addProductArrayToCart = async (ArrayProducts, cid) => {
    try {
        const addProductArrayToCart = await cmDB.addArrayProductsCart(ArrayProducts, cid)
        return addProductArrayToCart
    } catch (err) {
        console.error(`Array of products not added to cart`)
    }
}

const updateQuantityProduct = async (cid, pid, newQuantity) => {
    try {
        const updateQuantityProduct = await cmDB.updateQuantity(cid, pid, newQuantity)
        return updateQuantityProduct
    } catch (err) {
        console.log(`Error updating quantity`)
    }
}

const deleteAllProducts = async (cid) => {
    try {
        const deleteAllProducts = await cmDB.deleteProductCart(cid)
        return deleteAllProducts
    } catch (err) {
        console.log(`Error deleting all products`)
    }
}



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
        res.status(500).send(`Error to create cart`)
    }
})


router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        // const cartById = await getCartFromModuleById(parseInt(cid))
        const cartById = await getCartFromModuleById(cid)

        if (!cartById) {
            // return res.status(404).json({msg: `Carrito no encontrado`})
            return res.status(404).send({ message: 'Cart ID not found' })
        }


        // res.status(200).render('cart', {
        //     products: cartById.report.cart[0].products,
        //     style: 'cart.css'
        // })
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

//api/carts/:cid/products/:pid
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const productDeleteCart = await deleteProductFromCart(cid, pid)
        if (!productDeleteCart) res.status(404).send({ message: `'Delete failed`})
        res.status(200).send(productDeleteCart)
    } catch (err) {
        console.log(err)
        res.status(500).send(`Error deleting`)
    }
})


router.put('/:cid', async (req, res) => {
    try {
       const { cid } = req.params
       const ArrayProducts = req.body
       const addArraytoCart = await addProductArrayToCart(ArrayProducts, cid)
       if(!ArrayProducts) res.status(404).send( {message: 'Products not Added'})
       res.status(200).send(addArraytoCart)
    } catch (err) {
        console.log(err)
    }
})


router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const newQuantity = req.body
        const updateQuantity = await updateQuantityProduct(cid, pid, newQuantity)
        if (!updateQuantity) res.status(404).send({ message: `Update failed`})
        res.status(200).send(updateQuantity)
    } catch (err) {
        console.log(err)
    }
})

//To do:
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const deleteAll = await deleteAllProducts(cid)
        if (!deleteAll) res.status(404).send({ message: `Delete failed`})
        res.status(200).send(deleteAll)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router 