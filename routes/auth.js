const { User } = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();
const _ = require("lodash");
const Idev = require("./../utils");

// ! auth post email and password
router.post("/", async (req, res) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({ email: req.body.email });
   if (!user) return res.status(400).send("Email yoki parol no to'g'ri");

   const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
   );
   if (!isValidPassword)
      return res.status(400).send("Email yoki parol no to'g'ri");
   const token = user.generateAuthToken();
   const data = {
      status: "success",
      data: {
         token,
         user,
      },
      error_text: "Error :(",
   };
   res.send(data);
});

function validate(req) {
   const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
   });
   return schema.validate(req);
}

module.exports = router;
