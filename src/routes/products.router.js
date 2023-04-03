const { Router } = require('express')
const ProductManager = require('../Daos/productManager')
const ProductManagerMongo = require('../Daos/productManagerMongo')


const path = (`./src/mockDB/data.json`)


const pm = new ProductManager(path)
const pmDB = new ProductManagerMongo()
const router = Router()

//Done
const getProductsFromModuleFiltered = async limit => {
    try {
        const products = await pmDB.getProductsByFilter(limit)
        return products
    } catch (err) {
        return console.error(`lo está rompiendo este #1 ${err}`)
    }
}
//Done
const getProductsFromModule = async () => {
    try {
        const products = await pmDB.getProducts()
        return products
    } catch (err) {
        return console.error(`lo está rompiendo este #2 ${err}`)
    }
}
//Done
const getProductFromModuleById = async pid => {
    try {
        const productById = await pmDB.getProductById(pid)
        return productById
    } catch (err) {
        return console.error(`Id de producto no encontrado`)
    }
}
//Done
const addProductToModule = async newProduct => {
    try {
        const resultProduct = await pmDB.addProduct(newProduct)
        return resultProduct
    } catch (err) {
        return console.error(`Producto no agregado`)
    }
}
//Done
const updateProductFromModule = async (pid, productToUpdate) => {
    try {
        const updateProduct = await pmDB.updateProduct(pid, productToUpdate)
        return updateProduct
    } catch (err) {
        return console.error(`Producto no Actualizado`)
    }
}

const deleteProductFromModule = async pid => {
    try {
        const deleteProduct = await pmDB.deleteProduct(pid)
        return deleteProduct
    } catch (err) {
        return console.error(`Producto no pudo ser borrado`)
    }
}

//Done
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query
        const products = limit
            ? await getProductsFromModuleFiltered(limit)
            : await getProductsFromModule()
        res.status(200).send(products)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al obtener productos${limit ? " filtrados" : ""}`)
    }
})
//Done
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        // const productById = await getProductFromModuleById(parseInt(pid)) // Persistent File
        const productById = await getProductFromModuleById(pid)
        if (!productById) return res.status(404).send({ mesagge: `Id del producto no existe` })
        res.status(200).send(productById)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al obtener producto ${productById}`)
    }
})
// Done
router.post('/', async (req, res) => {
    try {
        const newProduct = req.body
        const resultProduct = await addProductToModule(newProduct)
        //io.emit('newProduct', newProduct)
        res.status(resultProduct.status).send(resultProduct.report)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al intentar crear el producto`)
    }
})

//Done
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        // const productById = await getProductFromModuleById(parseInt(pid))
        // if (!productById) return res.status(404).send({ mesagge: `Id del producto no existe` })
        const productToUpdate = req.body
        const productUpdate = await updateProductFromModule(pid, productToUpdate)
        return res.status(productUpdate.status).send(productUpdate.report)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al intentar actualizar el producto`)
    }
})
//Done
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        // const productById = await getProductFromModuleById(parseInt(pid))
        // if (!productById) return res.status(404).send({ mesagge: `Id del producto no existe` })
        //const productDelete = await deleteProductFromModule(parseInt(pid))
        const productDelete = await deleteProductFromModule(pid)

        return res.status(productDelete.status).send(productDelete.report)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al intententar borrar el producto`)
    }
})


module.exports = router 