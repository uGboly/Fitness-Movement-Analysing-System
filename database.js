const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./mydb.sqlite",
  },
  useNullAsDefault: true,
})

const setupUserTable = async () => {
  const hasTable = await knex.schema.hasTable("users")
  if (!hasTable) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary()
      table.string("email").notNullable().unique()
      table.string("password").notNullable()
    })
    console.log("用户表已创建")
  }
}

setupUserTable().then(() => console.log("数据库初始化完成"))

knex.schema
  .createTable("fitness_data", function (table) {
    table.increments("id").primary()
    table.integer("userId").notNullable()
    table.string("type").notNullable()
    table.integer("score").notNullable()
    table.timestamp("timestamp").defaultTo(knex.fn.now())
  })
  .then(() => console.log("健身数据表建立完毕"))

module.exports = knex
