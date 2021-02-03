const jwt = require('jsonwebtoken')
const key='secret'
module.exports = {
    createToken: data => jwt.sign(data, key),
    verifyToken: (req, res, next) => {
        if (!req.body.token) return res.status(400).send('please input the token')
        try {
            req.user = jwt.verify(req.body.token,key)
            next()
        } catch (error) {
            res.status(400).send('invalid token')
        }
    },
    verifyTokenMovies: (req, res, next) => {
        // console.log(jwt.verify(req.body.token, key))
        if(!req.body.token)return res.status(400).send('please input the token')
        try {
            let result = jwt.verify(req.body.token,key)
            if (+result.role !== 1) return res.status(400).send('only admin can edit')

            // console.log(body)
            // delete body.token
            next()
        } catch (error) {
            res.status(400).send('invalid token')
        }
    }
}