const CartsModel = require('../models/carts.model.js')

class CartManagerMongo {

    addCart = async (newCart) => {
        try {
            // if (newCart === undefined) {
            //     return { status: 400, report: { message: `No estas enviando datos` } }
            // }
            let { product } = newCart

            const result = await CartsModel.create({ product })

            if (result) {
                return { status: 201, report: { message: `document was inserted`, cart: newCart } }
            }

            if (!result) {
                return { status: 400, report: { message: `cart not created` } }
            }
        } catch (err) {
            console.error(err)
        }
    }

    getCartById = async (idsearch) => {
        try {
            const cart = await CartsModel.findOne({ _id: idsearch })
            if (!cart) return { status: 400, report: { message: `This ID is invalid` } }
            if (cart) return { status: 201, report: { message: `cart found success`, cart: cart } }
        } catch (err) {
            console.error(err)
        }
    }

    addProductToCart = async (cid, pid) => {
        try {
            const cartById = await CartsModel.findOne({ _id: cid })
            if (!cartById) return { status: 400, report: { message: `This ID is invalid` } }

            if (cartById.products.length === 0) {
                // let objetUpdated = { product: pid, quantity: 1} 
                let result = await CartsModel.updateOne({ _id: cid }, { $addToSet: { products: { product: pid, quantity: 1 } } })
                if (!result) return { status: 400, report: { message: `cart not updated` } }
                if (result) return { status: 201, report: { message: `cart updated seccess` } }
            }

            if (cartById.products.length > 0) {
                const consult = cartById.products.filter(item => item.product.equals(pid))
                
                
                if (!consult) {
                    let result = await CartsModel.updateOne({ _id: cid }, { $addToSet: { products: { product: pid, quantity: 1 } } })
                    if (!result) return { status: 400, report: { message: `cart not updated` } }
                    if (result) return { status: 201, report: { message: `cart updated seccess` } }
                }
                
                if (consult) {
                    let result = await CartsModel.updateOne({ "products.product": pid }, { $inc: { "products.$.quantity": 1 } })
                    if (!result) return { status: 400, report: { message: `cart not updated` } }
                    if (result) return { status: 201, report: { message: `cart updated seccess` } }

                }
            }
        }
        catch (err) {
            console.error(err)
        }
    }
}

module.exports = CartManagerMongo

