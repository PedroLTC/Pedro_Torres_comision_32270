const CartsModel = require('../models/carts.model.js')
const ProductsModel = require('../models/products.model.js')

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
            // const cart = await CartsModel.findOne({ _id: idsearch })
            const cart = await CartsModel.find({ _id: idsearch }).populate('products.product').lean()
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
                const consult = cartById.products.find(item => item.product.toString() === pid)

                if (!consult) {
                    let result = await CartsModel.updateOne({ _id: cid }, { $addToSet: { products: { product: pid, quantity: 1 } } })
                    if (!result) return { status: 400, report: { message: `cart not updated` } }
                    if (result) return { status: 201, report: { message: `cart updated success` } }
                }

                if (consult) {
                    let result = await CartsModel.updateOne({ "products.product": pid }, { $inc: { "products.$.quantity": 1 } })
                    if (!result) return { status: 400, report: { message: `cart not updated` } }
                    if (result) return { status: 201, report: { message: `cart updated success` } }

                }
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    deleteProductCart = async (cid, pid) => {
        try {
            const cartById = await CartsModel.findOne({ _id: cid })
            if (!cartById) return { status: 404, report: { message: `This ID Cart is invalid` } }

            if (cartById.products.length === 0) return { status: 404, report: { message: `Cart is Empty` } }

            const consult = cartById.products.find(item => item.product.toString() === pid)

            if (!consult) return { status: 404, report: { message: `ID Product not found` } }

            if (consult) {
                let result = await CartsModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } })
                if (!result) return { status: 400, report: { message: `product not deleted from cart` } }
                if (result) return { status: 201, report: { message: `product removed from cart` } }
            }

        } catch (err) {
            console.error(err)
        }
    }

    addArrayProductsCart = async (ArrayProducts, cid) => {
        try {
            const cartById = await CartsModel.findOne({ _id: cid })
            if (!cartById) return { status: 400, report: { message: `cart does not exist` } }

            let result = await CartsModel.updateOne({ _id: cid }, { $push: { products: { $each: ArrayProducts } } })

            if (!result) return { status: 400, report: { message: `Array of product not Added` } }
            if (result) return { status: 201, report: { message: `Array of Products added to Cart` } }

        } catch (err) {
            console.error(err)
        }
    }

    updateQuantity = async (cid, pid, newQuantity) => {
        try {
            const cartById = await CartsModel.findOne({ _id: cid })
            if (!cartById) return { status: 400, report: { message: `cart does not exist` } }

            if (cartById.products.length === 0) return { status: 404, report: { message: `Cart is Empty` } }

            let result = await CartsModel.updateOne({ "products.product": pid }, { $set: { "products.$.quantity": newQuantity.quantity } })

            if (!result) return { status: 400, report: { message: `quantity not updated` } }
            if (result) return { status: 201, report: { message: `quantity updated success` } }
 
        } catch (err) {
            console.error(err)
        }
    }

    deleteProductCart = async (cid) => {
        try {
            const cartById = await CartsModel.findOne({ _id: cid })
            if (!cartById) return { status: 400, report: { message: `cart does not exist` } } 

            if (cartById.products.length === 0) return { status: 404, report: { message: `Cart is Empty` } }

            let result = await CartsModel.updateOne({_id: cid}, { $unset: {products: ""} })
            if (!result) return { status: 400, report: { message: `products of cart not deleted` } }
            if (result) return { status: 201, report: { message: `products deleted succes` } }

        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = CartManagerMongo

