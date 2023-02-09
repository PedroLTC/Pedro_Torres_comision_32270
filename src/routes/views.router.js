const { Router } = require('express')
const ProductManager = require('../Daos/productManager')

const path = (`./src/mockDB/data.json`)

const pm = new ProductManager(path)
const router = Router()



const getProductsFromModule = async () => {
    try {
        const products = await pm.getProducts()
        return products
    } catch (err) {
        return console.error(`lo está rompiendo este #2 ${err}`)
    }
}



router.get('/', async (req, res) => {
    try {
        let testUser = { name: `Pedro`, last_name: `Torres`, role: `admin` }
        const products = await getProductsFromModule()
        res.status(200).render('home', {
            user: testUser,
            style: 'index.css',
            isAdmin: testUser.role === `admin`,
            products
        })
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al obtener los productos`)
    }



   
})

module.exports = router
