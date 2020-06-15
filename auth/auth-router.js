const router = require("express").Router();
const bcryptjs = require('bcryptjs');

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {


  const {username, password} = req.body;

  ///////////////has user password
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

  //////////verify user password

  Users.findBy({ username })
    .then(([user]) => {
      if(user && bcryptjs.compareSync(password, user.password)) {
        req.session.user = { id: user.id, username: user.username }
        res.status(200).json({ welcome: user.username , session: req.session })
      } else {
        res.status(401).json({you: "cannot pass"})
      }
    })
    .catch(err => res.status(500).send(err));
});

router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy(error => {
      if(error) {
        res.status(500).json({message: 'could not log out, please try again '})
      } else {
        res.status(204).end();
      }
    });

  } else {
    res. status(204).end();
  }
})

module.exports = router;