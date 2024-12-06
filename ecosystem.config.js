module.exports = {
    apps: [{
      name: 'movie-archive',
      script: 'index.js',
      env_production: {
        NODE_ENV: 'production'
      }
    }]
  };
  