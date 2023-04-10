const ProductsModel = require('../models/products.model.js')

class ProductManagerMongo {


    // this method return all products from MongoDB

    getProducts = async () => {
        try {
            let products = await ProductsModel.find().lean()
            return products
        } catch (e) {
            console.error(e)
        }
    }

    // this mwthod return data limited by "limit" from MongoDB

    getProductsByFilter = async (limit) => {
        try {
            //let products = await this.getProducts()
            let limitedProducts = await ProductsModel.find().limit(limit)
            return limitedProducts
        } catch (e) {
            console.error(e)
        }
    }

    // this methiod return a product by id from MongoDB

    getProductById = async (idsearch) => {
        try {
            const product = await ProductsModel.findOne({ _id: idsearch })
            if (!product) return { status: 400, report: { message: "This ID is invalid" } }
            if (product) return { status: 201, report: { message: "Producto encontrado con éxito", product: product } }
        } catch (e) {
            console.error(e)
        }
    }

    addProduct = async (newProduct) => {
        try {
            if (newProduct === undefined) {
                return { status: 400, report: { message: `No estas enviando datos` } }
            }
            if (!newProduct !== undefined) {
                const valuesNewProduct = Object.values(newProduct)

                for (let i = 0; i < valuesNewProduct.length; i++) {
                    if (valuesNewProduct[i].length === 0 || typeof (valuesNewProduct[i]) === undefined) {
                        return { status: 400, report: { message: `todos los campos deben estar completados` } }
                    }

                }

            }
            const flagSearch = await ProductsModel.findOne({ code: newProduct.code })



            if (flagSearch !== null) {
                if (flagSearch.code === newProduct.code) {
                    return { status: 400, report: { message: `El producto ${newProduct.code} ya se encuentra registrado` } }
                }
            }

            let { title, description, code, price, status, stock, category, thumbnail } = newProduct

            const result = await ProductsModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail
            })



            if (result) {
                return { status: 201, report: { message: `document was inserted`, product: newProduct } }
            }

            if (!result) {
                return { status: 400, report: { message: `product not added` } }
            }

        } catch (error) {
            console.error(error)
        }
    }

    updateProduct = async (id, product) => {
        try {
            if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
                return { status: 400, report: { message: "Enviar datos completos" } }
            }
            let result = await ProductsModel.updateOne({ _id: id }, product)

            if (result) {
                return { status: 201, report: { message: `document was updated`, product: product } }
            }

        } catch (error) {
            console.error(error)
        }
    }

    deleteProduct = async (id) => {
        try {
            let result = await ProductsModel.deleteOne({ _id: id })

            if (result) {
                return { status: 201, report: { message: `document was deleted` } }
            }

            if (!result) {
                return {
                    status: 400, report: { message: `invalid ID` }
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    advancedSearch = async (parametersSearch) => {
        try {

            if (parametersSearch.query === '') {
                const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink } = await ProductsModel.paginate({}, { limit: parametersSearch.limit, page: parametersSearch.page, sort: { price: parametersSearch.sort }, lean: true })

                if (docs) {
                    let resultSearch = {
                        status: 'success',
                        payload: docs,
                        totalPages,
                        prevPage,
                        nextPage,
                        page,
                        hasPrevPage,
                        hasNextPage,
                        prevLink,
                        nextLink
                    }
                    return resultSearch
                }

                if (!docs) {
                    let resultSearch = {
                        status: 'error'
                    }
                    return resultSearch
                }

            }

            const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink } = await ProductsModel.paginate({ category: parametersSearch.query }, { limit: parametersSearch.limit, page: parametersSearch.page, sort: { price: parametersSearch.sort }, lean: true })

            if (docs) {
                let resultSearch = {
                    status: 'success',
                    payload: docs,
                    totalPages,
                    prevPage,
                    nextPage,
                    page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink,
                    nextLink
                }
                return resultSearch
            }

            if (!docs) {
                let resultSearch = {
                    status: 'error'
                }
                return resultSearch
            }


        } catch (error) {
            console.error(error)
        }
    }

}

module.exports = ProductManagerMongo