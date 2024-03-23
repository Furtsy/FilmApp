const User = require("../models/user");
const auth = require("./auth");

const owner = {}

owner.isOwner = async (req, res, next) => {
   const bearerHeader = req.headers['authorization'];
   if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken
      auth.decode(req.token).then(user => {
         if (user.email) {
            User.findOne({ email: user.email }).then(user => {
               if (user.owner === true) {
                  next()
               } else {
                  res.json({ status: 403, message: "Owner Değilsin" })
                  res.status(403)
               }
            })
         } else {
            res.json({ status: 403, message: "Giriş yap önce izin yok" })
            res.status(403)
         }
      })
   } else {
      res.json({ status: 403, message: "Giriş yap önce token yok" })
      res.status(403)
   }
}

module.exports = owner;