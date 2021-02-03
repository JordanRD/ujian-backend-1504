const
    mysql = require('mysql'),
    connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password: 'jordan123',
        database:'backend_2021'
    })

module.exports=connection