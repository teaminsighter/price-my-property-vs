#!/bin/bash

# ====================================================
# HOSTINGER VPS DEPLOYMENT SCRIPT
# ====================================================
# This script deploys the Next.js app to Hostinger VPS
# Run this on your VPS after uploading the project
# ====================================================

echo "🚀 Starting deployment for Price My Property..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
   print_error "Do not run as root. Run as your user account."
   exit 1
fi

# Set project directory
PROJECT_DIR="/var/www/price-my-property"

# Navigate to project directory
cd $PROJECT_DIR || { print_error "Project directory not found!"; exit 1; }

print_success "Project directory found"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found!"
    print_warning "Copy .env.production.example to .env.production and fill in your values"
    exit 1
fi

print_success ".env.production file found"

# Install dependencies
print_warning "Installing dependencies..."
npm ci --production=false || { print_error "Failed to install dependencies"; exit 1; }
print_success "Dependencies installed"

# Generate Prisma Client
print_warning "Generating Prisma Client..."
npx prisma generate || { print_error "Failed to generate Prisma client"; exit 1; }
print_success "Prisma Client generated"

# Run database migrations
print_warning "Running database migrations..."
npx prisma migrate deploy || { print_error "Failed to run migrations"; exit 1; }
print_success "Database migrations completed"

# Seed database (first time only)
read -p "Is this the first deployment? Seed database? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Seeding database..."
    npm run seed || print_warning "Seeding failed (might be already seeded)"
    print_success "Database seeded"
fi

# Build the application
print_warning "Building Next.js application..."
npm run build || { print_error "Build failed!"; exit 1; }
print_success "Build completed successfully"

# Create logs directory
mkdir -p logs
print_success "Logs directory created"

# Restart PM2
print_warning "Restarting PM2..."
pm2 delete price-my-property 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
print_success "PM2 restarted"

# Show PM2 status
print_success "Deployment complete!"
echo ""
pm2 status
echo ""
print_success "Application is running on port 3000"
print_warning "Make sure Nginx is configured to proxy to port 3000"
