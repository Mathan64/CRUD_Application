const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(cors());

let userdata = require('./sample.json');

app.get('/users', (req, res) => {
  res.json(userdata);
});

app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const filteredUsers = userdata.filter((user) => user.id !== id);

  fs.writeFile('./sample.json', JSON.stringify(filteredUsers, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error writing file' });
    }
    userdata = filteredUsers;
    res.json(filteredUsers);
  });
});

app.post("/users", (req, res) => {
  const { name, age, city } = req.body;
  if (!name || !age || !city) {
    return res.status(400).send({ message: 'All fields are required' });
  }
  const id = userdata.length ? userdata[userdata.length - 1].id + 1 : 1;
  const newUser = { id, name, age, city };
  userdata.push(newUser);

  fs.writeFile('./sample.json', JSON.stringify(userdata, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error writing file' });
    }
    res.json(userdata);
  });
});

app.patch("/users/:id", (req, res) => {
  const { name, age, city } = req.body;
  if (!name || !age || !city) {
    return res.status(400).send({ message: 'All fields are required' });
  }
  const id = Number(req.params.id);
  let index = userdata.findIndex((user) => user.id === id);
  if (index !== -1) {
    userdata[index] = { id, name, age, city };

    fs.writeFile('./sample.json', JSON.stringify(userdata, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing file' });
      }
      res.json(userdata);
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
