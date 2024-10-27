const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  },
  useNullAsDefault: true
})

const app = express()
const port = 3001

app.use(
  session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1 day
  })
)

app.use(bodyParser.json())
app.use(cors({ origin: true, credentials: true }))
app.use(express.static(path.join(__dirname, 'build')))

function isAuthenticated (req, res, next) {
  if (req.session.userId) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await knex('users').where({ email, password }).first()
    if (user) {
      req.session.userId = user.id
      res.json({ message: 'Login successful' })
    } else {
      res.status(400).json({ message: 'Wrong password or email' })
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
      return res
        .status(400)
        .json({ message: 'Email has already been registered' })
    }

    const newUserId = await knex('users').insert({ email, password })

    req.session.userId = newUserId[0]

    res.json({ message: 'Registration successful' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

app.post('/fitness-data', isAuthenticated, async (req, res) => {
  const { scores, type } = req.body
  const userId = req.session.userId
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

app.get('/fitness-data', isAuthenticated, async (req, res) => {
  const userId = req.session.userId

  try {
    const records = await knex('fitness_data').where('userId', userId)
    res.json(records)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

app.post('/fitness-stat', isAuthenticated, async (req, res) => {
  const { startTime, endTime } = req.body
  const userId = req.session.userId

  try {
    const data = await knex('fitness_data')
      .select('type')
      .count('type as count')
      .where({ userId })
      .andWhere('timestamp', '>=', startTime)
      .andWhere('timestamp', '<=', endTime)
      .groupBy('type')

    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err)
      res.status(500).json({ message: 'Logout failed' })
    } else {
      res.clearCookie('connect.sid')
      res.json({ message: 'Logged out successfully' })
    }
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
