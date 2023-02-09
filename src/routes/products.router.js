const { Router } = require('express')
const ProductManager = require('../Daos/productManager')


const path = (`./src/mockDB/data.json`)


const pm = new ProductManager(path)
const router = Router()


const getProductsFromModuleFiltered = async limit => {
    try {
        const products = await pm.getProductsByFilter(limit)
        return products
    } catch (err) {
        return console.error(`lo está rompiendo este #1 ${err}`)
    }
}

const getProductsFromModule = async () => {
    try {
        const products = await pm.getProducts()
        return products
    } catch (err) {
        return console.error(`lo está rompiendo este #2 ${err}`)
    }
}

const getProductFromModuleById = async pid => {
    try {
        const productById = await pm.getProductById(pid)
        return productById
    } catch (err) {
        return console.error(`Id de producto no encontrado`)
    }
}

const addProductToModule = async newProduct => {
    try {
        const resultProduct = await pm.addProduct(newProduct)
        return resultProduct
    } catch (err) {
        return console.error(`Producto no agregado`)
    }
}

const updateProductFromModule = async (pid, productToUpdate) => {
    try {
        const updateProduct = await pm.updateProduct(pid, productToUpdate)
        return updateProduct
    } catch (err) {
        return console.error(`Producto no Actualizado`)
    }
}

const deleteProductFromModule = async pid => {
    try {
        const deleteProduct = await pm.deleteProduct(pid)
        return deleteProduct
    } catch (err) {
        return console.error(`Producto no pudo ser borrado`)
    }
}


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

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productById = await getProductFromModuleById(parseInt(pid))
        if (!productById) return res.status(404).send({ mesagge: `Id del producto no existe` })
        res.status(200).send(productById)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al obtener producto ${productById}`)
    }
})

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


router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productById = await getProductFromModuleById(parseInt(pid))
        if (!productById) return res.status(404).send({ mesagge: `Id del producto no existe` })
        const productToUpdate = req.body
        const productUpdate = await updateProductFromModule(pid, productToUpdate)
        return res.status(productUpdate.status).send(productUpdate.report)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al intentar actualizar el producto`)
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productById = await getProductFromModuleById(parseInt(pid))
        if (!productById) return res.status(404).send({ mesagge: `Id del producto no existe` })
        const productDelete = await deleteProductFromModule(parseInt(pid))
        return res.status(productDelete.status).send(productDelete.report)
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error al intententar borrar el producto`)
    }
})


module.exports = router 