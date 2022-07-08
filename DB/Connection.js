const mongoose = require ("mongoose")

const ConnectDB = ()=>{
    return mongoose.connect(process.env.DBURL)
    .then(result=>console.log(`connect DB on URL.......... ${process.env.DBURL}`))
    .catch(error=>console.log(`fail to connect DB`))
}


module.exports = ConnectDB