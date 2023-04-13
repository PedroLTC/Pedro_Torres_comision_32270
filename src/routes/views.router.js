const { Router } = require('express')
const ProductManager = require('../Daos/productManager')
const ProductManagerMongo = require('../Daos/productManagerMongo')
const CartManagerMongo = require(`../Daos/cartsManagerMongo.js`)
const ProductsModel = require('../models/products.model.js')

//const path = (`./src/mockDB/data.json`)

//const pm = new ProductManager(path)
const pmDB = new ProductManagerMongo()
const cmDB = new CartManagerMongo()
const router = Router()




const getCartFromModuleById = async cid => {
    try {
        // const cartById = await cm.getCartById(cid)
        const cartById = await cmDB.getCartById(cid)
        return cartById
    } catch (err) {
        return console.error(`Id not found`)
    }
}



router.get('/', async (req, res) => {
    try {
        let testUser = { name: `Pedro`, last_name: `Torres`, role: `admin` }
        //const data = await getProductsFromModule()
        const products = await pmDB.getProducts()
        //console.log(products)
        res.status(200).render('home', {
            user: testUser,
            style: 'home.css',
            isAdmin: testUser.role === `admin`,
            products
        })
        //res.status(200).json(products)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al obtener los productos`)
    }
})

router.get('/chat', async (req, res) => {
    try {
        let testUser = { name: `Pedro`, last_name: `Torres`, role: `admin` }

        res.status(200).render('chat', {
            user: testUser,
            style: 'chat.css',
            isAdmin: testUser.role === `admin`,
            style: 'chat.css'

        })
    } catch (err) {
        console.log(err)
        res.status(500).render('chat no available')
    }
})


router.get('/realtimeproducts', async (req, res) => {
    try {
        let testUser = { name: `Pedro`, last_name: `Torres`, role: `admin` }
        const products = await getProductsFromModule()
        //const products = JSON.parse(data)
        //const products = await pmDB.getProducts()
        res.status(200).render('realTimeProducts', {
            user: testUser,
            style: 'realtimeproducts.css',
            isAdmin: testUser.role === `admin`,
            products
        })
        //res.status(200).json(products)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al obtener los productos`)
    }
})

router.get('/cart/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartById = await getCartFromModuleById(cid)

        if (!cartById) {
            return res.status(404).send({ message: 'Cart ID not found' })
        }


        res.status(200).render('cart', {
            style: 'cart.css',
            products: cartById.report.cart[0].products,
            style: 'cart.css'
        })

    } catch (error) {
        res.send(500).send(`Error getting the cart`)
    }
})


router.get('/products', async (req, res) =>{
    try {
        const { page = 1 } = req.query
        const {  docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await ProductsModel.paginate({ },{limit: 5, page, lean: true})
      
        res.status(200).render('products', {
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        })
    } catch (error) {
        // console.log(error) 
        res.status(500).send(`Error getting products`)
    }
})



module.exports = router
