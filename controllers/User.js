const db = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const profile_pic = req.body.profile_pic;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const address = req.body.address;
  const phone_number = req.body.phone_number;
  try {
    const filters = { email: email }
    const user = await db.user.findOne({ where: filters })
    if (user) {
      res.status(400).send({ message: 'Invalid your E-mail' })
    } else {
      
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password,salt);
      const body = {
        email,
        password: hashedPassword,
        profile_pic,
        first_name,
        last_name,
        address,
        phone_number,
      }
      const created = await db.user.create(body)
      res.status(200).send({message : 'User created', created})
    }
  }

  catch (error) {
    console.log(error)
    res.send(error)
  }
}

const loginUser = async (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await db.user.findOne({where: {email: email}})
  if(!user){
    res.status(400).send({message: 'Invalid Username or Password'})
  } else {
    const isSuccess = bcryptjs.compareSync(password,user.password);
    if(isSuccess){
      const payload = {
        id: user.id,
        name: user.first_name,
      }
      const token = jwt.sign(payload,"superSecretKey",{expiresIn:10800});
      res.status(200).send({message: `It's OK`,isSuccess,token})
    }else{
      res.status(400).send({message: 'Invalid Username or Password'})
    }
  }
}

const getUser = async (req,res) => {
  const id = req.params.id;
  const userData = await db.user.findOne({where: {id: id}})
  try{
    res.send({userData:userData})
  } catch(e){
    console.log(e) 
    res.send("error")
  }
}

module.exports = { createUser, loginUser, getUser }