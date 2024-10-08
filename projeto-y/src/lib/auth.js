const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}

module.exports = { hashPassword, verifyPassword };
