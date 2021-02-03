const cryptojs = require('crypto-js')
const db=require('../database')
const util = require('util')
const key='secret'
module.exports = {
    HASH:obj=> {
        if (obj.password) obj.password = cryptojs.HmacMD5(obj.password,key).toString()
        return obj
    },
    asyncQuery:util.promisify(db.query).bind(db)
}