const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        mongoose.connect(process.env.DB_CNN, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });   
        console.log('DB Online');
    } catch (error) {
        throw new Error('Error: ', error);
    }
};

module.exports = {
    dbConnection
}