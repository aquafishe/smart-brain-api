const sessUtil = require('../util/sessionUtil')

const handleRegister = (db, bcrypt, req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return Promise.reject('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  return db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .catch(err => Promise.reject('insert failed when registering user'))
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .then(() => {
    return db.select('*').from('users')
      .where('email', '=', email)
      .then(user => user[0])
      .catch(err => Promise.reject('unable to get user'))
  })
  .catch(err => Promise.reject('failed to register user'))
}

const registerAuthentication = (db, bcrypt) => (req, res) => {
  return handleRegister(db, bcrypt, req, res)
    .then(data => {
      return data.id && data.email ? sessUtil.createSessions(data) : Promise.reject(data)
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err))
}

module.exports = {
  registerAuthentication: registerAuthentication
};


