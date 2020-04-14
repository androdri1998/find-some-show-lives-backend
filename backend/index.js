const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended:false }));
app.use(cors());

app.get('/', async (req, res) => {
  res.send('hello world');
});

app.listen(8088);