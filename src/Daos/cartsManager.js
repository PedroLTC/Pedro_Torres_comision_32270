const fs = require('fs')

class CartsManager {

    constructor(path) {
        this.path = path
    }

    #getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf8')
                const carts = JSON.parse(data)
                return carts
            }
            await fs.promises.writeFile(this.path, `[]`, 'utf8')
            return []
        } catch (err) {
            console.error(err)
        }
    }

    addCart = async (newCart) => {
        try {
            const carts = await this.#getCarts()
            if (carts.length === 0) {
                newCart.id = 1
            } else {
                newCart.id = carts[carts.length - 1].id + 1
            }
            carts.push(newCart)
            await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf8')
            return newCart
        } catch (err) {
            console.error(err)
        }
    }

    getCartById = async idsearch => {
        try {
            const carts = await this.#getCarts()
            const cart = carts.find(cart => cart.id === idsearch)
            if (cart) {
                return cart
            }
            return false
        } catch (err) {
            console.error(err)
            return
        }
    }

    addProductToCart = async (cid, pid) => {
        try {
            let cindex = parseInt(cid - 1)
            const cartById = await this.getCartById(parseInt(cid))
            if (!cartById) return cartById

            if (cartById.products.length === 0) {
                cartById.products.push({ pid: parseInt(pid), quantity: 1 })
                const carts = await this.#getCarts()
                carts[cindex] = cartById
                await fs.promises.writeFile(this.path, JSON.stringify(carts), `utf-8`)
                return cartById
            }

            if (cartById.products.length > 0) {

                let propertyFound = false

                const newArrayProducts = cartById.products.map(product => {
                    if (product.pid === parseInt(pid)) {
                        product.quantity += 1
                        propertyFound = true
                    }
                    return product
                })

                if (!propertyFound) {
                    cartById.products.push({ pid: parseInt(pid), quantity: 1 })
                    const carts = await this.#getCarts()
                    carts[cindex] = cartById
                    await fs.promises.writeFile(this.path, JSON.stringify(carts), `utf-8`)
                    return cartById

                }

                cartById.products = newArrayProducts
                const carts = await this.#getCarts()
                carts[cindex] = cartById
                await fs.promises.writeFile(this.path, JSON.stringify(carts), `utf-8`)
                return cartById



            }

        } catch (err) {
            console.error(err)
            return
        }
    }
}

module.exports = CartsManager