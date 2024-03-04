const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./mydb.sqlite",
  },
  useNullAsDefault: true,
})

const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(cors())

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await knex("users").where({ email, password }).first()
    if (user) {
      res.json({ message: "登录成功", userId : user.id })
    } else {
      res.status(400).json({ message: "邮箱或密码错误" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "服务器错误" })
  }
})

app.post("/register", async (req, res) => {
  const { email, password } = req.body
  try {
    const existingUser = await knex("users").where({ email }).first()
    if (existingUser) {
      return res.status(400).json({ message: "邮箱已被注册" })
    }

    const newUser = await knex("users").insert({
      email,
      password,
    })

    res.json({ message: "注册成功", userId: newUser[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "服务器错误" })
  }
})

app.post("/fitness-data", async (req, res) => {
  const fitnessDataArray = req.body
  const timestamp = new Date()

  try {
    const insertedData = await Promise.all(
      fitnessDataArray.map(async (data) => {
        const { userId, type, score } = data
        return knex("fitness_data").insert({
          userId,
          type,
          score,
          timestamp,
        })
      })
    )

    res.json({ message: "数据上传成功", insertedData: insertedData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "服务器错误" })
  }
})

// 假设你已经设置了Express应用并且已经连接到数据库

app.get("/fitness-data/:userId", async (req, res) => {
  const { userId } = req.params

  try {
    const records = await knex("fitness_data").where("userId", userId)
    res.json(records)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "服务器错误" })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
