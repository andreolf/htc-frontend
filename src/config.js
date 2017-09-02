var config = {
  BASE_API: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'http://htc.washmypants.com/api',
  BASE_AUTH: 'Basic Z3Vlc3Q6Z3Vlc3Q='
}

module.exports = config
