const { getAuthTokenId, createSessions } = require('../util/sessionUtil')

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log('isValid: '+isValid)
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        return Promise.reject('wrong credentials')
      }
    })
    .catch(err => err)
}

//signinAuthentication is a function which returns a function (db, bcrypt) are Dependency Injection
const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers
  console.log('headers : ' + authorization)
  return authorization ? 
    getAuthTokenId(req, res)
      .then(data => {
        console.log('signinAuthentication data: '+ JSON.stringify(data))
        res.json(data)
      })
      .catch(err => res.status(400).json(err))
    :
    handleSignin(db, bcrypt, req, res)
      .then(data => {
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
}

/*Only function called by endpoint should send response to Client (success/error)
* Goal in this file to create small easily testable functions!
*
* signinAuthentication() is called by /signin endpoint thus its the only function which
* sends response back to client
* 
* handleSigin() the helper function returns Promises since thats what signinAuthentication() will expect
*
* createSessions() generates token and return token + data
*
* signToken() creates the JWT token using jwt
*/

module.exports = {
  signinAuthentication: signinAuthentication
}