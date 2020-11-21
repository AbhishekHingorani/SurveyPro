const dotenv = require('dotenv');
dotenv.config();

module.exports =  {
    port: process.env.PORT,
    secret: process.env.SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET
 }