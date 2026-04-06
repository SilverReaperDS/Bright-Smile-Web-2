function validatePassword(password) {
  if (
    !password ||
    password.length < 8 ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    return 'Password must be at least 8 characters and include a number and special character';
  }
  return null;
}

module.exports = { validatePassword };
