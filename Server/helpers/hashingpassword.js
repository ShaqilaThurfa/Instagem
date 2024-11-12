const bcrypt = require('bcrypt')

function hashPassword(plainpassword){
  return bcrypt.hashSync(plainpassword, 10);
} 

function checkPassword(plainpassword, hash){
  return bcrypt.compareSync(plainpassword, hash);
}

module.exports = {hashPassword, checkPassword}