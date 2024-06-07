const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(cors());


mongoose.connect("mongodb+srv://yadavshivam7777:4muQp4d2V2uVxVuj@cluster0.labh1z0.mongodb.net/newtodo", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    done: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  });

const Todo = mongoose.model('Todo', todoSchema);


app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});
app.post('/todos', async (req, res) => {
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date || new Date()
    });
    await todo.save();
    res.json(todo);
  });
  

app.patch('/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
