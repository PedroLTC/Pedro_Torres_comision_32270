const { Schema, model } = require('mongoose')

const cartCollection = 'carts'

const cartSchema = new Schema({
    // _id: 'objectId' -> lo crea mongo 
    // userId: {
    //     type: Schema.Types.objectId
//          ref: 'usuarios'      
    // },

    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number,
                ref: 'products'

            }
            
        }]
    }
})

// CartSchema.pre('find', function(){
//     this.populate('products.product')
// })

// const CartModel = model(collection, CartSchema)

// module.exports = {
//     CartModel
// }

module.exports = model(cartCollection, cartSchema)

