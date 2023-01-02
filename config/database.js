const MongoClient = require('mongodb').MongoClient  // ใช้งาน mongodb module
 
const url = 'mongodb://localhost:27017' // กำหนด url สำหรับ MongoDB Server
// const url = 'mongodb+srv://karaked:<password>@cluster0.fetdtku.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'club' // กำหนดชื่อฐานข้อมูลที่จะใช้งาน
 
// ส่งการเชื่อมต่อฐานข้อมูลไปใช้งาน
module.exports = new Promise((resolve, reject)=>{
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if (error) throw error
        var db = client.db(dbName)
        console.log("Connected successfully to server")
        resolve(db)
    })
})