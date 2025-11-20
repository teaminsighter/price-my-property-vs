# 🚀 HOSTINGER VPS DEPLOYMENT GUIDE
## Price My Property - Next.js Application

This guide will walk you through deploying your application to Hostinger VPS.

## 📋 PREREQUISITES

- ✅ Hostinger VPS plan
- ✅ SSH access to VPS
- ✅ Domain name pointed to VPS IP
- ✅ MySQL database created

## 🚀 QUICK START

1. Upload project to VPS
2. Configure .env.production
3. Run `./deploy-hostinger.sh`
4. Configure Nginx
5. Install SSL
6. Done!

For detailed instructions, see the full deployment guide in the project files.

## 📞 SUPPORT

Check PM2 logs: `pm2 logs price-my-property`
Check Nginx logs: `tail -f /var/log/nginx/price-my-property-error.log`

