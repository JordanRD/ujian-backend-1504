const { asyncQuery, HASH } = require('../helpers/queryHelpers')
const { createToken } = require('../helpers/tokenHelpers')
const { validationResult } = require('express-validator')

module.exports = {
    registerUser: async (req, res) => {
        const validation = validationResult(req)
        if (!validation.isEmpty()) return res.status(400).send(validation.array().map(i => i.msg))
        const { body } = req
        try {
            body.uid = Date.now()
            const query = `INSERT INTO users (${Object.keys(body).join(', ')}) VALUES (?)`
            const result1 = await asyncQuery(query, [Object.values(HASH(body))])
            // console.log(result1)
            // console.log(body)
            const result2 = await asyncQuery(`SELECT id,uid,username,email FROM users WHERE id = ${result1.insertId}`)

            res.status(200).send({ ...result2[0], token: createToken({ uid: body.uid, role: body.role }) })
        } catch (error) {
            res.status(400).send(
                error.code === "ER_DUP_ENTRY" ?
                    'username or email is taken' :
                    error.code === "ER_BAD_FIELD_ERROR" ?
                        'unknown input' :
                        error
            )
        }
    },
    loginUser: async ({ body }, res) => {
        try {
            body = HASH(body)
            const queryDB = `SELECT id,uid,username,email,status,role FROM users WHERE (username=? OR email=?) and password=? and status=1 `
            const [result] = await asyncQuery(queryDB, [body.username || 'rrer', body.email || 'rfreqfq', body.password])
            res.status(200).send(
                result.username ?
                    { ...result, token: createToken({ uid: result.uid, role: result.role }) } :
                    'wrong username or email or password or your acc is not active'
            )
        } catch (error) {
            res.status(400).send(error || 'wrong username or email or password or your acc is not active')
        }
    },
    deactiveUser: async ({ user }, res) => {
        try {
            // console.log(user)
            const query = `UPDATE users SET status=2 where uid=? and status=1`
            let validate = await asyncQuery(query, [user.uid])
            if (!validate.affectedRows) return res.status(200).send('your account already deactivate or close')
            const [result] = await asyncQuery('select uid,s.status from users u join status s on s.id=u.status where u.uid=? ', [user.uid])
            res.status(200).send([result])
        } catch (error) {
            res.status(400).send('something wrong in our server')
        }
    },
    activateUser: async ({ user }, res) => {
        try {
            const query = `UPDATE users SET status=1 where uid=? and status=2`
            const validate = await asyncQuery(query, [user.uid])
            if (!validate.affectedRows) return res.status(200).send('your account has been closed or already active')
            const [result] = await asyncQuery('select uid,s.status from users u join status s on s.id=u.status where u.uid=? ', [user.uid])
            res.status(200).send([result])
        } catch (error) {
            res.status(400).send('something wrong in our server')
        }
    },
    closeUser: async ({ user }, res) => {
        try {
            const query = `UPDATE users SET status=3 where uid=? and status !=3`
            const validate = await asyncQuery(query, [user.uid])
            if (!validate.affectedRows) return res.status(200).send('your account has been closed before')
            const [result] = await asyncQuery('select uid,s.status from users u join status s on s.id=u.status where u.uid=? ', [user.uid])
            res.status(200).send([result])
        } catch (error) {
            res.status(400).send('something wrong in our server')
        }
    },
}

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE2MTIzMzUyOTMyNzMsImlhdCI6MTYxMjMzNTI5M30.eSCJmdI7ZMlIbcp4gauoHEa6UGjiKsLIyZEUpxII3Yc"