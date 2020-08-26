module.exports = {
  apps: [{
    name: "shortener",
    script: './bin/www',
    watch: true,
    env_production: {
      "PORT": "3000",
      "APP_URL": "https://yoururl.com",
      "MONGODB_URI": "mongodb://localhost:37017",
      "MONGODB_DB": "shortener"
    }
  }],
  
  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
