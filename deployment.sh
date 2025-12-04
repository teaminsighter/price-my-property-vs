#!/bin/bash

#################################################
# Price My Property - Automated Deployment Script
# For Hostinger Production Deployment
#################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="pricemyproperty"
APP_DIR="$(pwd)"
# NODE_ENV and PORT will be loaded from .env file (defaults used if not set)
NODE_ENV="${NODE_ENV:-production}"
PORT="${PORT:-3000}"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

#################################################
# Pre-deployment checks
#################################################

log "🚀 Starting deployment for ${APP_NAME}..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "package.json not found. Are you in the correct directory?"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js first."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    error "npm is not installed. Please install npm first."
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    warning "PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2 || error "Failed to install PM2"
fi

#################################################
# Clean up old PM2 processes for THIS PROJECT only
#################################################

log "🧹 Cleaning up old PM2 processes for this project..."

# Delete processes matching this project (various naming patterns)
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 delete "pricemyproperty" 2>/dev/null || true
pm2 delete "price-my-property" 2>/dev/null || true
pm2 delete "price-my-property-vs" 2>/dev/null || true

# Save PM2 state after cleanup
pm2 save --force 2>/dev/null || true

log "✅ Old project processes cleaned"

#################################################
# Backup current deployment
#################################################

log "📦 Creating backup of current deployment..."

BACKUP_DIR="$HOME/backups/pricemyproperty"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"

mkdir -p "$BACKUP_DIR"

# Backup critical files
if [ -f ".env" ]; then
    mkdir -p "$BACKUP_PATH"
    cp .env "$BACKUP_PATH/.env.backup" || warning "Failed to backup .env"
    log "✅ Backed up .env file"
fi

if [ -f ".env.production" ]; then
    mkdir -p "$BACKUP_PATH"
    cp .env.production "$BACKUP_PATH/.env.production.backup" || warning "Failed to backup .env.production"
    log "✅ Backed up .env.production file"
fi

# Keep only last 5 backups
cd "$BACKUP_DIR"
ls -t | tail -n +6 | xargs -r rm -rf
cd "$APP_DIR"

#################################################
# Pull latest code from GitHub
#################################################

log "📥 Pulling latest code from GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    error "Not a git repository. Please initialize git first."
fi

# Stash any local changes
if [[ -n $(git status -s) ]]; then
    warning "Uncommitted changes detected. Stashing..."
    git stash save "Auto-stash before deployment $TIMESTAMP"
fi

# Pull latest code
git fetch origin || error "Failed to fetch from remote"
git pull origin main || error "Failed to pull from GitHub"

log "✅ Code updated successfully"

#################################################
# Install dependencies
#################################################

log "📦 Installing dependencies..."

# Remove node_modules for clean install
rm -rf node_modules || true

# Install all dependencies including devDependencies (needed for build)
# NODE_ENV=production would skip devDeps, so we explicitly include them
NODE_ENV=development npm install || error "Failed to install dependencies"

log "✅ Dependencies installed"

#################################################
# Environment Variables Check
#################################################

log "🔍 Checking environment variables..."

# Check for .env file (prefer .env.production if exists)
ENV_FILE=".env"
if [ -f ".env.production" ]; then
    ENV_FILE=".env.production"
    info "Using .env.production file"
elif [ ! -f ".env" ]; then
    error "No .env file found! Please create .env or .env.production with required variables (DATABASE_URL, PORT, etc.)"
fi

# Source environment file to make variables available
set -a
source "$ENV_FILE"
set +a

# Validate critical environment variables
if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL not set in $ENV_FILE. Please add it and run deployment again."
fi

if [ -z "$PORT" ]; then
    warning "PORT not set in $ENV_FILE, using default: 3000"
    export PORT=3000
fi

log "✅ Environment variables loaded from $ENV_FILE"

#################################################
# Prisma Client Generation
#################################################

log "🔧 Generating Prisma Client..."

# Check if Prisma is available
if [ -f "prisma/schema.prisma" ]; then
    # Remove global Prisma 7.x which has breaking changes
    log "Removing global Prisma (if exists) to avoid version conflicts..."
    npm uninstall -g prisma 2>/dev/null || true

    # Install Prisma CLI with specific version (Prisma 7.x has breaking changes)
    log "Installing Prisma CLI v6.19.0 (compatible with current schema)..."
    npm install prisma@6.19.0 --save-dev || warning "Failed to install Prisma CLI"
    npm install @prisma/client@6.19.0 --save || warning "Failed to install Prisma Client"

    # Generate Prisma Client (CRITICAL: Must run before build)
    log "Generating Prisma Client..."
    npx prisma@6.19.0 generate || error "Failed to generate Prisma client - build will fail without this!"

    log "✅ Prisma Client generated successfully"
else
    info "No Prisma schema found, skipping Prisma client generation"
fi

#################################################
# Database Migration
#################################################

log "🗄️  Running database migrations..."

if [ -f "prisma/schema.prisma" ]; then
    # Check if this is first deployment (no migrations exist yet)
    if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
        log "📋 First deployment detected - creating initial migration..."

        # Create migrations directory
        mkdir -p prisma/migrations

        # Use db push for initial schema setup, then baseline
        npx prisma@6.19.0 db push || error "Failed to push initial schema to database"

        # Mark current schema as baseline (creates _prisma_migrations table)
        npx prisma@6.19.0 migrate resolve --applied "0000_init" 2>/dev/null || true

        log "✅ Initial database schema created"
    else
        # Normal deployment - run pending migrations
        log "📋 Running pending migrations..."
        npx prisma@6.19.0 migrate deploy || error "Failed to run database migrations"
        log "✅ Migrations applied successfully"
    fi
else
    info "No Prisma schema found, skipping migrations"
fi

#################################################
# Database Seeding
#################################################

log "🌱 Checking database seed..."

if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
    npm run seed || warning "Seeding failed (might be already seeded)"
    log "✅ Database seeding complete"
else
    info "No seed file found, skipping seeding"
fi

#################################################
# Build application
#################################################

log "🔨 Building application..."

# Clean previous build
rm -rf .next || true

# Build Next.js application
npm run build || error "Build failed! Check errors above."

log "✅ Build completed successfully"

#################################################
# PM2 Deployment
#################################################

log "🔄 Deploying with PM2..."

log "🆕 Starting PM2 process from $(pwd)..."

# Check if ecosystem.config.js exists
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js || error "Failed to start PM2 process"
else
    PORT=$PORT pm2 start npm --name "$APP_NAME" --cwd "$(pwd)" -- start || error "Failed to start PM2 process"
fi

# Save PM2 configuration
pm2 save || warning "Failed to save PM2 configuration"

# Set PM2 to start on system boot
pm2 startup || info "PM2 startup command needs to be run with sudo"

log "✅ PM2 deployment completed"

#################################################
# Health check
#################################################

log "🏥 Running health check..."

# Wait for application to start
sleep 5

# Check if PM2 process is running
if pm2 list | grep -q "$APP_NAME.*online"; then
    log "✅ Application is running"
else
    error "Application failed to start! Check PM2 logs: pm2 logs $APP_NAME"
fi

# Check if application is responding
if curl -f http://localhost:$PORT > /dev/null 2>&1; then
    log "✅ Application is responding on port $PORT"
else
    warning "Application may not be responding on port $PORT"
fi

#################################################
# Post-deployment tasks
#################################################

log "🧹 Running post-deployment cleanup..."

# Create logs directory
mkdir -p logs || true

# Clear old logs
pm2 flush || true

# Show PM2 status
log "📊 Current PM2 Status:"
pm2 list

# Show application info
log "📝 Application Info:"
pm2 info "$APP_NAME"

#################################################
# Deployment complete
#################################################

log "✅ Deployment completed successfully! 🎉"
log ""
log "📊 Quick Commands:"
log "   View logs:    pm2 logs $APP_NAME"
log "   Stop app:     pm2 stop $APP_NAME"
log "   Restart app:  pm2 restart $APP_NAME"
log "   Monitor:      pm2 monit"
log ""
log "🌐 Your application should be live at: http://localhost:$PORT"
log ""
log "🔍 If there are any issues, check logs with: pm2 logs $APP_NAME"
