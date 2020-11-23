const dotenv = require('dotenv');
dotenv.config();

module.exports =  {
    port: process.env.PORT,
    secret: process.env.SECRET,
    sqlUser: process.env.SQL_DATABASE_USER,
    sqlPassword: process.env.SQL_DATABASE_PASSWORD,
    sqlDbName: process.env.SQL_DATABASE_NAME,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET
 }