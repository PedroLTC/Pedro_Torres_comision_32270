const fs = require('fs')

class ProductManager {

    constructor(path) {
        this.path = path
    }

    // this method return all products in file, if file is not exist then create file

    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const products = JSON.parse(data)
                return products
            }
            await fs.promises.writeFile(this.path, '[]', 'utf-8')
            return []
        } catch (err) {
            console.error(err)
        }
    }

    // this method return data filter by limit

    getProductsByFilter = async (limit) => {
        try {
            const products = await this.getProducts()
            const product = products.filter(product => product.id <= limit)
            if (product) {
                return product
            }
            return `No se logró filtrar`
        } catch (err) {
            console.error(err)
            return
        }
    }

    // this method return a product by id

    getProductById = async (idsearch) => {
        try {
            const products = await this.getProducts()
            const product = products.find(product => product.id === idsearch)
            if (product) {
                return product
            }
            return false
        } catch (err) {
            console.error(err)
            return
        }
    }

    updateProduct = async (id, product) => { // parametros (id, objeto producto)
        try {
            let index = id - 1
            const products = await this.getProducts()
            const updateProduct = products.splice(index, 1, product)
            products[index].id = parseInt(id)
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
            console.log(id, product)
            return { status: 201, report: { message: "Producto actualizado con éxito", product: updateProduct } }
        } catch (err) {
            console.error(err)
        }
    }

    deleteProduct = async (id) => {
        try {
            let index = id - 1
            const products = await this.getProducts()
            const deleteProduct = products.splice(index, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
            return { status: 201, report: { message: "Producto borrado con éxito", product: deleteProduct } }
        } catch (err) {
            console.error(err)
        }
    }

    addProduct = async (newProduct) => {  // Este metodo agrega nuevos productos

        try {

            if (newProduct === undefined) {  // Verifica si el nuevo producto viene vacío 
                return { status: 400, report: { message: `No estas enviando datos` } }
            }

            if (!newProduct !== undefined) {  // Verifica que todos las propiedades del objeto producto esten completos

                const valuesNewProduct = Object.values(newProduct)

                for (let i = 0; i < valuesNewProduct.length; i++) {
                    if (valuesNewProduct[i].length === 0 || typeof (valuesNewProduct[i]) === undefined) {
                        return { status: 400, report: { message: `todos los campos deben estar completados` } }
                    }

                }

            }

            const products = await this.getProducts() // Llama al método getProducts para solicitar los productos que se encuentran en el archivo json

            const flagSearch = await products.find(element => element.code === newProduct.code)

            if (flagSearch) {   // Verifica si el code del producto ya se encuentra registrado 
                return { status: 400, report: { message: `El producto ${newProduct.code} ya se encuentra registrado` } }
            }

            if (!flagSearch) {  // Sino está registrado el producto entonces asigna el id correspondiente

                if (products.length === 0) {

                    newProduct.id = 1

                } else {

                    newProduct.id = products[products.length - 1].id + 1

                }
                products.push(newProduct) // agrega el nuevo producto al final del arreglo
                await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
                return { status: 201, report: { message: "Producto agregado con éxito", product: newProduct } }
            }

        } catch (error) {
            console.error(error)
        }

    }
}


module.exports = ProductManager