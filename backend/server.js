// server.js
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

//middlewares
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(bodyParser.json())

const users = [
  { id: 1, username: 'vinayakan', password: 'vina@2003' },
  { id: 2, username: 'user2', password: 'password2' },
];

app.post('/api/login',(req,res)=>{
  const { username, password} = req.body;
  console.log(username,password)

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (!user){
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful',user})
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
