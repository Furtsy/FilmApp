const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

var auth = {}


auth.encode = async ( payload ) => {
    let token = new Promise((resolve, reject) => {
        jwt.sign(payload, 'ultra_mega_secret_key', { expiresIn: 31556926 }, (err, token) => {   // 1 yıl
            if(err){
                resolve(err)
            } else {
                resolve(token)
            }
        })  
    })

    let result = await token

    return result
}

auth.decode = async ( payload ) => {
    return jwt.verify(payload, 'ultra_mega_secret_key', (err, data) => {
        if (err) {
            return err
        } else {
            return data
        }
    })
}

auth.pwencode = async ( payload ) => {
    let hash = new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(payload, salt, (err, hash) => {
                if(err){
                    resolve(err)
                } else {
                    resolve(hash)
                }          
            });
          });
    })

    let result = await hash

    return result;
}

auth.pwdecode = async ( password, realpassword ) => {
    let match = new Promise((resolve, reject) => {
        bcrypt.compare(realpassword, password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              resolve(true)
            } else {
              resolve(false)
            }
          });
    })

    let result = await match

    return result;
}



module.exports = auth;