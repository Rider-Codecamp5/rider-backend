const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


db.sequelize.sync().then(()=>{
    app.listen(8000, ()=> {console.log("server is running in port 8000 ")})
});
