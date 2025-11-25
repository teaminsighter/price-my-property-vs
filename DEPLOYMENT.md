# Deployment Guide for Hostinger with MySQL

This guide covers deploying the Price My Property application to Hostinger hosting with MySQL database.

## Prerequisites

- Hostinger hosting account with Node.js support (VPS or Cloud hosting recommended)
- MySQL database access
- Domain configured and pointing to Hostinger

---

## Step 1: Set Up MySQL Database on Hostinger

1. **Login to Hostinger hPanel**
2. **Go to Databases > MySQL Databases**
3. **Create a new database:**
   - Database name: `yourprefix_property`
   - Username: `yourprefix_admin`
   - Password: (use a strong password)
4. **Note down these credentials** - you'll need them for the DATABASE_URL

Your DATABASE_URL will be:
```
mysql://yourprefix_admin:YourPassword@localhost:3306/yourprefix_property
```

---

## Step 2: Prepare Project for Production

### 2.1 Switch to MySQL Schema

```bash
# Backup current schema
cp prisma/schema.prisma prisma/schema.sqlite.prisma

# Use MySQL schema
cp prisma/schema.mysql.prisma prisma/schema.prisma
```

### 2.2 Update Environment Variables

Create a `.env` file with production settings:

```env
# Database - MySQL
DATABASE_URL="mysql://yourprefix_admin:YourPassword@localhost:3306/yourprefix_property"

# NextAuth
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
NEXTAUTH_URL="https://yourdomain.com"

# Google Maps (from your Google Cloud Console)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2.3 Generate Prisma Client & Migrate

```bash
# Generate Prisma client for MySQL
npx prisma generate

# Create database tables
npx prisma db push
```

### 2.4 Build the Application

```bash
npm run build
```

---

## Step 3: Deploy to Hostinger VPS

### Option A: Using Git Deploy

1. **Connect to VPS via SSH:**
```bash
ssh username@your-server-ip
```

2. **Install Node.js (if not installed):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone your repository:**
```bash
cd /var/www
git clone https://github.com/yourusername/price-my-property.git
cd price-my-property
```

4. **Install dependencies:**
```bash
npm install
```

5. **Set up environment:**
```bash
cp .env.example .env
nano .env  # Edit with production values
```

6. **Switch to MySQL schema:**
```bash
cp prisma/schema.mysql.prisma prisma/schema.prisma
```

7. **Set up database:**
```bash
npx prisma generate
npx prisma db push
```

8. **Build application:**
```bash
npm run build
```

9. **Start with PM2:**
```bash
npm install -g pm2
pm2 start npm --name "price-my-property" -- start
pm2 save
pm2 startup
```

### Option B: Manual File Upload

1. **Build locally:**
```bash
npm run build
```

2. **Upload these folders/files via FTP:**
   - `.next/` folder
   - `public/` folder
   - `prisma/` folder (with MySQL schema)
   - `node_modules/` folder
   - `package.json`
   - `package-lock.json`
   - `.env` (with production values)
   - `next.config.js` (if exists)

3. **Configure in Hostinger:**
   - Set Node.js version to 20.x
   - Set startup command: `npm start`
   - Set environment variables in hPanel

---

## Step 4: Configure Nginx (VPS)

Create nginx config `/etc/nginx/sites-available/price-my-property`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/price-my-property /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 5: Set Up SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Step 6: Create Admin User

After deployment, create your first admin user. The easiest method is using Prisma Studio:

```bash
# Connect to your server via SSH, then run:
npx prisma studio
```

This opens a web UI where you can create the admin user with these fields:
- username: `admin`
- email: `admin@yourdomain.com`
- password: (bcrypt hashed - use an online bcrypt generator)
- role: `SUPER_ADMIN`

---

## Important Security Checklist

- [ ] Change default admin password immediately
- [ ] Ensure `.env` is not committed to git
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable SSL/HTTPS
- [ ] Set up database backups
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Keep Node.js and npm packages updated

---

## Troubleshooting

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u yourprefix_admin -p -h localhost yourprefix_property
```

### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

### Application Logs
```bash
# View PM2 logs
pm2 logs price-my-property

# View error logs
pm2 logs price-my-property --err
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | MySQL connection string |
| NEXTAUTH_SECRET | Yes | Secret for JWT encryption |
| NEXTAUTH_URL | Yes | Your production URL |
| NEXT_PUBLIC_GOOGLE_MAPS_API_KEY | Yes | Google Maps API key |
| SMTP_HOST | No | Email SMTP server |
| SMTP_PORT | No | SMTP port (usually 465 or 587) |
| SMTP_USER | No | SMTP username |
| SMTP_PASSWORD | No | SMTP password |

---

## Maintenance Commands

```bash
# Update application
git pull origin main
npm install
npx prisma generate
npm run build
pm2 restart price-my-property

# Database migrations
npx prisma db push

# View database
npx prisma studio
```

---

## Support

- Check PM2 logs: `pm2 logs price-my-property`
- Check Nginx logs: `tail -f /var/log/nginx/price-my-property-error.log`

