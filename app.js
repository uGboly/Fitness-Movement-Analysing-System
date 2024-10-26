const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  },
  useNullAsDefault: true
})

const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')))

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await knex('users').where({ email, password }).first()
    if (user) {
      res.json({ message: 'Login in success', userId: user.id })
    } else {
      res.status(400).json({ message: 'Wrong password or email ' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

app.post('/register', async (req, res) => {
  const { email, password } = req.body
  try {
    const existingUser = await knex('users').where({ email }).first()
    if (existingUser) {
      return res.status(400).json({ message: 'Email has been registered' })
    }

    const newUser = await knex('users').insert({
      email,
      password
    })

    res.json({ message: 'Registered in success', userId: newUser[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

app.post('/fitness-data', async (req, res) => {
  const { scores, type, userId } = req.body
  scores.reverse()
  const timestamp = new Date()

  try {
    const insertedData = await Promise.all(
      scores.map(async score => {
        return knex('fitness_data').insert({
          userId,
          type,
          score,
          timestamp
        })
      })
    )

    res.json({ message: 'Data Uploaded', insertedData: insertedData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

app.get('/fitness-data/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const records = await knex('fitness_data').where('userId', userId)
    res.json(records)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

app.post('/fitness-stat', async (req, res) => {
  const { userId, startTime, endTime } = req.body
  try {
    const data = await knex('fitness_data')
      .select('type')
      .count('type as count')
      .where({
        userid: userId
      })
      .andWhere('timestamp', '>=', startTime)
      .andWhere('timestamp', '<=', endTime)
      .groupBy('type')

    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
