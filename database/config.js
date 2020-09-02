const mongoose = require('mongoose');

const connectionDb = async () => {

    try {
    await mongoose.connect(process.env.DB_CNX, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('database online');
    }
    catch(error) {
        console.log(error);
        throw new Error('Error al iniciar la conexion con bd');
    }

}

module.exports = {
    connectionDb
}