
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use('/auth', require('./routes/auth'));
app.use('/jobs', require('./routes/jobs'));

app.get('/', (req,res)=>{ res.send('Nova Cloud API is running'); });

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Server running on '+port));
