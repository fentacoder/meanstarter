const mongoose = require('mongoose');

module.exports = async () => {
    try {
        const newConnection = await mongoose.connect(process.env.MONGO_URI,{
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`server is connected at ${newConnection.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
