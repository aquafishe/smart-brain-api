const redisClient = require('../util/sessionUtil').redisClient

//next tells Express to send logic to next parameter step
//middleware should always return next
//basic function which checks redis db if auth header token exists
const requireAuth = (req, res, next) => {
	const { authorization } = req.headers
	if (!authorization) {
			return res.status(401).json('Unauthorized')
	}
	return redisClient.get(authorization, (err, reply) => {
			if (err || !reply) {
					return res.status(401).json('Unauthorized')
			}
			console.log('you shall pass')
			return next();
	})
}

module.exports = {
	requireAuth: requireAuth
}