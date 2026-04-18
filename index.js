const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const SYSTEM_NAME = "Focus Buddy ADHD Task System"

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ===== DATA =====
let tasks = []
let id = 1

console.log(`🚀 ${SYSTEM_NAME} starting...`)

// ===== CREATE =====
app.post('/tasks', (req, res) => {
  const { title, description } = req.body

  if (!title) {
    return res.status(400).json({ message: 'Title is required' })
  }

  const newTask = {
    id: id++,
    title,
    description: description || "",
    status: "pending",
    createdAt: new Date()
  }

  tasks.push(newTask)
  res.status(201).json(newTask)
})

// ===== READ ALL =====
app.get('/tasks', (req, res) => {
  res.json(tasks)
})

// ===== SEARCH (NEW FEATURE) =====
app.get('/tasks/search', (req, res) => {
  const { title } = req.query

  if (!title) {
    return res.status(400).json({ message: "Search query required" })
  }

  const results = tasks.filter(t =>
    t.title.toLowerCase().includes(title.toLowerCase())
  )

  res.json(results)
})

// ===== UPDATE =====
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id)

  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }

  const { title, description, status } = req.body

  if (title) task.title = title
  if (description) task.description = description
  if (status) task.status = status

  res.json(task)
})

// ===== DELETE =====
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id == req.params.id)

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' })
  }

  tasks.splice(index, 1)
  res.json({ message: 'Deleted' })
})

// ===== SERVER =====
app.listen(port, () => {
  console.log(`✅ ${SYSTEM_NAME} running on http://localhost:${port}`)
})