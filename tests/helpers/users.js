const { register, login } = require('./api');
function makeEmail(prefix) {
  return `${prefix || 'u'}_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;
}
async function signup(opts) {
  opts = opts || {};
  const body = {name: opts.name || 'Test User',email: opts.email || makeEmail(opts.role || 'user'),password: opts.password || 'Secret123!',role: opts.role || 'student',
};
const res = await register(body);
  return { res, body };
}
async function signupAndLogin(opts) {
  const { res, body } = await signup(opts);
  if (res.statusCode !== 201) {
    throw new Error('signup failed ' + res.statusCode);
  }
  const loggedIn = await login({ email: body.email, password: body.password });
  if (loggedIn.statusCode !== 200) {
    throw new Error('login failed ' + loggedIn.statusCode);
  }
  return {token: loggedIn.body.token,user: loggedIn.body.user,body};
}
module.exports = { makeEmail, signup, signupAndLogin };