const { Router } = require('express')
const ProductManager = require('../Daos/productManager')
const ProductManagerMongo = require('../Daos/productManagerMongo')

//const ProductsModel = require('../models/products.model.js')

//const path = (`./src/mockDB/data.json`)

//const pm = new ProductManager(path)
const pmDB = new ProductManagerMongo()
const router = Router()



const getProductsFromModule = async () => {
    try {
        //const products = await pm.getProducts()
        const products = await pmDB.getProducts()
        return products
    } catch (err) {
        return console.error(`lo está rompiendo este #2 ${err}`)
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

module.exports = router
