const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        if (error.message.includes('SSL alert number 80')) {
            console.log('TIP: This SSL error often happens on Windows with Node 17+. Try adding &tlsAllowInvalidCertificates=true to your MONGO_URI in .env'.yellow.bold);
        }
        process.exit(1);
    }
};

module.exports = connectDB;
