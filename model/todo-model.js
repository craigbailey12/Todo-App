const db = require("../database/database")

class Todo {
  constructor(id, name, createdAt, completedAt, status) {
    this.id = id
    this.name = name
    this.createdAt = createdAt
    this.completedAt = completedAt
    this.status = status
  }

  static all() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM todo", (err, rows) => {
        if (err) reject(err)
        resolve(
          rows.map(
            (row) =>
              new Todo(
                row.id,
                row.name,
                row.created_at,
                row.completed_at,
                row.status
              )
          )
        )
      })
    })
  }

  static get(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM todo WHERE id = ?", [id], (err, row) => {
        if (err) reject(err)
        resolve(
          row
            ? new Todo(
                row.id,
                row.name,
                row.created_at,
                row.completed_at,
                row.status
              )
            : null
        )
      })
    })
  }

  create() {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO todo (name) VALUES (?)", [this.name], (err) => {
        if (err) reject(err)
        resolve(Todo.all())
      })
    })
  }

  update(status) {
    return new Promise((resolve, reject) => {
      const params = [status, this.id]
      db.run("UPDATE todo SET status = ? WHERE id = ?", params, (err) => {
        if (err) reject(err)
        else {
          if (status === "completed") {
            db.run(
              "UPDATE todo SET completed_at = datetime('now') WHERE id = ?",
              [this.id],
              (err) => {
                if (err) console.error(err.message)
                resolve(Todo.get(this.id))
              }
            )
          } else {
            resolve(Todo.get(this.id))
          }
        }
      })
    })
  }

  delete() {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM todo WHERE id = ?", [this.id], (err) => {
        if (err) reject(err)
        resolve()
      })
    })
  }
}

module.exports = Todo
