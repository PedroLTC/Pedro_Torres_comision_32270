const mongoose = require('mongoose')

const url = 'mongodb+srv://pedroltch:7VLJyf2t4xfstGE6@cluster0.muyntrc.mongodb.net/ecommerce?retryWrites=true&w=majority'
//const url_local = 'mongodb://localhost:27017/ecommerce'

// Connection options settings
// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   };

const dbConnection = async () => {
    try {
        await mongoose.connect(url)
        console.log('Successful connection to MongoDB')
        // Aquí puedes hacer operaciones con la base de datos
      } catch (error) {
        console.error('Error de conexión a la base de datos', error)
      }
}


module.exports = { dbConnection }
