const { Router } = require('express')
const ProductManager = require('../Daos/productManager')
const ProductManagerMongo = require('../Daos/productManagerMongo')


const path = (`./src/mockDB/data.json`)


const pm = new ProductManager(path)
const pmDB = new ProductManagerMongo()
const router = Router()


const getProductsFromModuleFiltered = async limit => {
    try {
        const products = await pmDB.getProductsByFilter(limit)
        return products
    } catch (err) {
        return console.error(`Error in function #1`)
    }
}

const getProductsFromModule = async () => {
    try {
        const products = await pmDB.getProducts()
        return products
    } catch (err) {
        return console.error(`Error in function #2`)
    }
}

const getProductFromModuleById = async pid => {
    try {
        const productById = await pmDB.getProductById(pid)
        return productById
    } catch (err) {
        return console.error(`Error ID not found with function #3`)
    }
}

const addProductToModule = async newProduct => {
    try {
        const resultProduct = await pmDB.addProduct(newProduct)
        return resultProduct
    } catch (err) {
        return console.error(`Error Product not Added with function #4`)
    }
}

const updateProductFromModule = async (pid, productToUpdate) => {
    try {
        const updateProduct = await pmDB.updateProduct(pid, productToUpdate)
        return updateProduct
    } catch (err) {
        return console.error(`Error Product not updated with function #5`)
    }
}

const deleteProductFromModule = async pid => {
    try {
        const deleteProduct = await pmDB.deleteProduct(pid)
        return deleteProduct
    } catch (err) {
        return console.error(`Error Product not deleted with function #6`)
    }
}

const advancedSearchProducts = async (parametersSearch) => {
    try {
        const resultOfSearch = await pmDB.advancedSearch(parametersSearch)
        return resultOfSearch
    } catch (err) {
        return console.error(`Error in Advanced Search Products`)
    }
}


//http://localhost:8080/api/products?limit=5&page=3&query=Electronics&sort=asc

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const query = req.query.query || ''
        const sort = req.query.sort || ''

        const parametersSearch = {
            limit,
            page,
            query,
            sort
        }

        const resultOfSearch = await advancedSearchProducts(parametersSearch)

        if (resultOfSearch) {

            // res.status(200).render('products', {
            //     products: resultOfSearch.payload,
            //     hasPrevPage: resultOfSearch.hasPrevPage,
            //     hasNextPage: resultOfSearch.hasNextPage,
            //     prevPage: resultOfSearch.prevPage,
            //     nextPage: resultOfSearch.nextPage,
            //     page: resultOfSearch.page
            // })

            res.status(200).send(resultOfSearch)

        }

    } catch (error) {
        console.error(error)
        res.status(500).send(`Error`)
    }
})

    //http://localhost:8080/api/products?limit=5
    // router.get('/', async (req, res) => {
    //     try {
    //         const { limit } = req.query
    //         const products = limit
    //             ? await getProductsFromModuleFiltered(limit)
    //             : await getProductsFromModule()
    //         res.status(200).send(products)
    //     } catch (error) {
    //         console.error(error)
    //         res.status(500).send(`Error al obtener productos${limit ? " filtrados" : ""}`)
    //     }
    // })

    // router.get('/:pid', async (req, res) => {
    //     try {
    //         const { pid } = req.params
    //         // const productById = await getProductFromModuleById(parseInt(pid)) // Persistent File
    //         const productById = await getProductFromModuleById(pid)
    //         if (!productById) return res.status(404).send({ mesagge: `Id del producto no existe` })
    //         res.status(200).send(productById)
    //     } catch (error) {
    //         console.error(error)
    //         res.status(500).send(`Error al obtener producto ${productById}`)
    //     }
    // })
    /
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