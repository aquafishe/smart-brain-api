const jwt = require('jsonwebtoken');
const { removeAllListeners } = require('nodemon');
const redis = require('redis')

//setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (email) => {
	const jwtPayload = { email }
	return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days'}) //JWT_SECRET can be any secret
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
  //JWT token, return user data
  const { email, id } = user
  const token = signToken(email);
  return setToken(token, id)
    .then(() => { 
      return { success: 'true', userId: id, token }
    })
    .catch(err => console.log) //normally would return Promise.rejct() but console.log here for testing
}

//Need to use new Promise in this case
const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers
	return new Promise((resolve, reject) => {
		redisClient.get(authorization, (err, reply) => {
			if(err || !reply) {
				return reject("unable to get token")
			}
			return resolve({ id: reply })
		})
	})
}

module.exports = {
	redisClient: redisClient,
	signToken: signToken,
	setToken: setToken,
	createSessions: createSessions,
	getAuthTokenId: getAuthTokenId
}