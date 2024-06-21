const express = require("express")
const bodyParser = require("body-parser")
const Todo = require("../model/todo-model")

const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
  try {
    const todos = await Todo.all()
    res.render("index", { todos })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.post("/add", async (req, res) => {
  const name = req.body.name
  const todo = new Todo(null, name, null, null)
  try {
    await todo.create()
    res.redirect("/")
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.post("/update", async (req, res) => {
  const id = req.body.id
  const status = req.body.status
  const created_at = req.body.created_at
  try {
    const todo = await Todo.get(id)
    await todo.update(status, created_at)
    res.redirect("/")
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.post("/delete", async (req, res) => {
  const id = req.body.id
  try {
    const todo = await Todo.get(id)
    await todo.delete()
    res.redirect("/")
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.get("/analytics", async (req, res) => {
  const start =
    req.query.start ||
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const end = req.query.end || new Date().toISOString()
  try {
    const todos = await Todo.all()
    const total = todos.filter(
      (todo) =>
        new Date(todo.createdAt) >= new Date(start) &&
        new Date(todo.createdAt) <= new Date(end)
    ).length
    const completed = todos.filter(
      (todo) =>
        todo.status === "completed" &&
        new Date(todo.createdAt) >= new Date(start) &&
        new Date(todo.createdAt) <= new Date(end)
    ).length
    res.json({ total, completed })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
