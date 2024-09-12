const bcrypt = require('bcrypt');
const saltRounds = 2;

const hashPassword=async(password)=> {
  try {
    const hashedPassword = await bcrypt.hash(password,3);
    console.log('Hashed password:', hashedPassword);
    return hashPassword;
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

async function comparePassword(plainTextPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    console.log('Password match:', match);
  } catch (err) {
    console.error('Error comparing passwords:', err);
  }
}

module.exports ={hashPassword,comparePassword}
