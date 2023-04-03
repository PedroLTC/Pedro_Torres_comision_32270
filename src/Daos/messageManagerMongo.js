const MessagesModel = require('../models/messages.model.js')

class MessageManagerMongo {

    addMessage = async (data) => {
        try {

            const { user, message } = data
            let result = MessagesModel.create({ user, message})
            // if (!result) return console.log(`Mesagge not added in class`)
            if (!result) return false
            // if (result) return console.log(`Mesagge added in class`)
            if (result) return true


            //if (!result) return { status: 400, report: { message: `Mesagge not added` } }
            //if (result) return { status: 201, report: { message: `Mesagge added` } }

        } catch (err) {
            console.error(err)
        }

    }
}

module.exports = MessageManagerMongo 