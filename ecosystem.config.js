// PM2 Configuration for Production
module.exports = {
  apps: [{
    name: 'price-my-property',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/price-my-property',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true
  }]
}
