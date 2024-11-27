const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.post('/data', (req, res) => {
    const { name } = req.body;
    res.send(`Hello, ${name}!`);
  });
  
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
