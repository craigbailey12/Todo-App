const sqllite3 = require("sqlite3").verbose()

const db = new sqllite3.Database("./todo.db")

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        status 
    )`)
  db.run(
    `
    CREATE TRIGGER IF NOT EXISTS update_completed_at
    AFTER UPDATE ON todo
    FOR EACH ROW
    BEGIN
      UPDATE todo SET completed_at = datetime('now') WHERE id = OLD.id;
    END;
  `,
    (err) => {
      if (err) console.error(err.message)
    }
  )
})

module.exports = db
