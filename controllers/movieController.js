const { asyncQuery } = require('../helpers/queryHelpers')

module.exports = {
    getAllMovies: async (_, res) => {
        try {
            let queryDB = `SELECT 
                                m.name,
                                m.release_date,
                                m.release_month,
                                m.release_year,
                                m.duration_min,
                                m.genre,
                                m.description,
                                mt.status,
                                l.location,
                                st.time
                            FROM
                                schedules s
                                    JOIN
                                locations l ON l.id = s.location_id
                                    JOIN
                                show_times st ON st.id = s.time_id
                                RIGHT JOIN
                                movies m ON m.id = s.movie_id
                                    JOIN
                                movie_status mt ON mt.id = m.status`
            const result = await asyncQuery(queryDB)
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    getMoviesQuery: async ({ query }, res) => {
        try {
            let value = []
            for (let key in query) {
                let temp=key==='status'?'mt.status':key==='location'?'l.location':key==='time'?'st.time':key
                value.push(`${temp} = '${query[key].replace(/[%]/g, ' ')}'`)
            }
            console.log(query)
            let queryDB = `SELECT 
                                m.name,
                                m.release_date,
                                m.release_month,
                                m.release_year,
                                m.duration_min,
                                m.genre,
                                m.description,
                                mt.status,
                                l.location,
                                st.time
                            FROM
                                schedules s
                                    JOIN
                                locations l ON l.id = s.location_id
                                    JOIN
                                show_times st ON st.id = s.time_id
                                RIGHT JOIN
                                movies m ON m.id = s.movie_id
                                    JOIN
                                movie_status mt ON mt.id = m.status where `+ value.join(' and ')
            const result = await asyncQuery(queryDB)
            if (!result.length) return res.status(400).send('not found')
            
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    addMovies: async ({ body }, res) => {
        // if (+user.role !== 1) return res.status(400).send('only admin can edit')
        try {
            delete body.token
            const queryDB1 = `insert into movies (${Object.keys(body).join(', ')}) values (?)`
            const result1 = await asyncQuery(queryDB1, [Object.values(body)])
            let queryDB2 = 'select * from movies where id=? '
            const result2 = await asyncQuery(queryDB2, [result1.insertId])
            res.status(200).send(result2)
        } catch (error) {
            res.status(400).send('invalid input')
        }
    },
    changeStatusMovies: async ({ body, params }, res) => {
        // console.log(body,params,user)
        // if(+user.role !== 1)return res.status(400).send('only admin can edit')
        
        try {
            let result = await asyncQuery(`update movies set status=? where id=?`, [body.status, params.id])
            if (result.affectedRows === 0) return res.status(200).send({ id: params.id, status: "unknown id" })
            res.status(200).send({id: params.id, status:'status has been changed'})
        
        } catch (error) {
            res.status(400).send(error.code === 'ER_NO_REFERENCED_ROW_2'? 'invalid input':'error')
        }
    },
    setSchedule: async ({ body,params }, res) => {
        // if (+user.role !== 1) return res.status(400).send('only admin can edit')
        try {
            // delete body.token
            let result = await asyncQuery(`insert into schedules (movie_id,location_id,time_id) values (?,?,?)`, [params.id,body.location_id,body.time_id])
            if (result.affectedRows === 0) return res.status(200).send({ id: params.id, status: "nothing was added to schedules" })
            res.status(200).send({ id: params.id, status:'schedule has been added'})
        } catch (error) {
            res.status(400).send('invalid input')
        }
    }
}