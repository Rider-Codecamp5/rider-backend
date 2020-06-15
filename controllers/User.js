const db = require('../models')
const createUser = async (req, res) => {
  const email = req.body.email
  const first_name = req.body.first_name
  console.log('Hello')

  const body = {
    email,
    first_name,
  }
  try {
    await db.User.create(body)
    res.send("OKsc")
  }

  catch (error) {
    console.log(error)
    res.send(error)
  }
}

module.exports = { createUser }