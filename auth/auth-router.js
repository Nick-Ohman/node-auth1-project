const router = require("express").Router();
const bcryptjs = require('bcryptjs');

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {


  const {username, password} = req.body;

  //has user password
  const rounds = process.env.HASH_ROUNDS || 8; // change to higher number in production
  const hash = bcryptjs.hashSync(password, rounds)

  Users.add({username, password: hash})
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(err => res.send(err));
});

router.post("/login", (req, res) => {

  const {username, password} = req.body;

  //verify user password

  Users.findBy({ username })
    .then(([user]) => {
      if(user && bcryptjs.compareSync(password, user.password)) {
        res.status(200).json({ welcome: user.username })
      } else {
        res.status(401).json({you: "cannot pass"})
      }
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;