
const router = require("express").Router();

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

require("../db");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});


router.post("/signup", async (req, res) => {
    console.log(req.body)
    
    const salt = await bcryptjs.genSalt(12);
const hash = await bcryptjs.hash(req.body.password, salt);
const user = new User({ username: req.body.username, password: hash });
await user.save();

res.send("signed up");
console.log(hash)
})

router.get("/login", (req, res) => {
  res.render("auth/login")
});

router.post("/login", async (req, res, next) => {
try {
  const user = await User.findOne({ username: req.body.username})
  if (!user){
    return res.render("auth/login", {error: "user non-exist"})
  } 
     const passwordMatch = await bcryptjs.compare(req.body.password, user.password);
if (!passwordMatch){
  return res.render("auth/login", {error: "password is incorrect"
});
}

 req.session.user = {
  username: user.username
 }



res.redirect("/profile")
} catch(err){
    console.log(err)
    next(err)
  }
 
});



module.exports = router;