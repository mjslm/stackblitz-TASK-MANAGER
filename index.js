const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// ================= SYSTEM =================
const SYSTEM_NAME = "Focus Buddy ADHD API System";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ================= DATA =================
let items = [
  {
    id: 1,
    title: "Start project",
    description: "Initialize backend API",
    status: "pending",
    createdAt: new Date()
  },
  {
    id: 2,
    title: "Study Node.js",
    description: "Learn Express REST API",
    status: "completed",
    createdAt: new Date()
  }
];

let nextId = 3;

// ================= HELPERS =================
const send = (res, success, data = null, message = null, status = 200) => {
  res.status(status).json({ success, data, message });
};

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]/g, "");

// ================= ROOT =================
app.get("/", (req, res) => {
  send(res, true, null, SYSTEM_NAME);
});

// ================= GET ALL =================
app.get("/api/items", (req, res) => {
  send(res, true, items);
});

// ================= STATS =================
app.get("/api/items/stats", (req, res) => {
  send(res, true, {
    total: items.length,
    completed: items.filter(i => i.status === "completed").length,
    pending: items.filter(i => i.status === "pending").length
  });
});

// ================= SEARCH =================
app.get("/api/items/search", (req, res) => {
  const { title } = req.query;

  if (!title) {
    return send(res, false, null, "Search query required", 400);
  }

  const result = items.filter(i =>
    normalize(i.title).includes(normalize(title))
  );

  send(res, true, result);
});

// ================= COMPLETED =================
app.get("/api/items/completed", (req, res) => {
  send(res, true, items.filter(i => i.status === "completed"));
});

// ================= PENDING =================
app.get("/api/items/pending", (req, res) => {
  send(res, true, items.filter(i => i.status === "pending"));
});

// ================= GET BY ID =================
app.get("/api/items/:id", (req, res) => {
  const item = items.find(i => i.id == req.params.id);

  if (!item) {
    return send(res, false, null, "Item not found", 404);
  }

  send(res, true, item);
});

// ================= CREATE =================
app.post("/api/items", (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return send(res, false, null, "Title is required", 400);
  }

  const newItem = {
    id: nextId++,
    title,
    description: description || "",
    status: "pending",
    createdAt: new Date()
  };

  items.push(newItem);

  send(res, true, newItem, "Item created", 201);
});

// ================= UPDATE =================
app.put("/api/items/:id", (req, res) => {
  const item = items.find(i => i.id == req.params.id);

  if (!item) {
    return send(res, false, null, "Item not found", 404);
  }

  const { title, description, status } = req.body;

  if (title !== undefined) item.title = title;
  if (description !== undefined) item.description = description;
  if (status !== undefined) item.status = status;

  send(res, true, item, "Updated successfully");
});

// ================= DELETE =================
app.delete("/api/items/:id", (req, res) => {
  const index = items.findIndex(i => i.id == req.params.id);

  if (index === -1) {
    return send(res, false, null, "Item not found", 404);
  }

  const removed = items.splice(index, 1)[0];

  send(res, true, removed, "Deleted successfully");
});

// ================= START =================
app.listen(port, () => {
  console.log(`🚀 ${SYSTEM_NAME} running on http://localhost:${port}`);
});