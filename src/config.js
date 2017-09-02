var config = {
  BASE_API: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'http://htc.washmypants.com/api/',
  BASE_AUTH: null
}

module.exports = config
