#!/bin/bash

# Chat Server Deployment Script
# This script helps deploy the real-time chat server to your cloud server

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CHAT_SERVER_DIR="realtime-chat-server"
NODE_VERSION="16"
PORT="4000"

echo -e "${BLUE}🚀 Chat Server Deployment Script${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "$CHAT_SERVER_DIR" ]; then
    print_error "Chat server directory not found: $CHAT_SERVER_DIR"
    echo "Please run this script from the project root directory"
    exit 1
fi

print_status "Found chat server directory"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js version $NODE_VERSION or higher"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 16 ]; then
    print_error "Node.js version $NODE_VER is too old"
    echo "Please upgrade to Node.js version 16 or higher"
    exit 1
fi

print_status "Node.js version $(node -v) is compatible"

# Check npm installation
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_status "npm is available"

# Navigate to chat server directory
cd "$CHAT_SERVER_DIR"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if .env file exists, create if not
if [ ! -f ".env" ]; then
    print_warning "No .env file found, creating default configuration..."
    cat > .env << EOF
# Chat Server Configuration
PORT=$PORT
NODE_ENV=production

# CORS Configuration (update with your domain)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# Optional: Add your production domain here
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EOF
    print_status "Created .env file with default configuration"
    print_warning "Please update the ALLOWED_ORIGINS in .env with your actual domain"
else
    print_status ".env file already exists"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 is not installed. Installing PM2..."
    npm install -g pm2
    if [ $? -eq 0 ]; then
        print_status "PM2 installed successfully"
    else
        print_error "Failed to install PM2"
        exit 1
    fi
else
    print_status "PM2 is already installed"
fi

# Stop existing PM2 process if running
if pm2 list | grep -q "chat-server"; then
    print_status "Stopping existing chat server..."
    pm2 stop chat-server
    pm2 delete chat-server
fi

# Start the chat server with PM2
print_status "Starting chat server with PM2..."
pm2 start server.js --name "chat-server" --env production

if [ $? -eq 0 ]; then
    print_status "Chat server started successfully"
else
    print_error "Failed to start chat server"
    exit 1
fi

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
print_status "Setting up PM2 startup script..."
pm2 startup

print_status "Chat server deployment completed!"
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "=========================="
echo "• Chat server directory: $(pwd)"
echo "• Port: $PORT"
echo "• Process manager: PM2"
echo "• Environment: production"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "=========================="
echo "• Check status: pm2 status"
echo "• View logs: pm2 logs chat-server"
echo "• Restart server: pm2 restart chat-server"
echo "• Stop server: pm2 stop chat-server"
echo "• Monitor: pm2 monit"
echo ""
echo -e "${BLUE}🌐 Testing:${NC}"
echo "=========="
echo "• Health check: curl http://localhost:$PORT/health"
echo "• Server info: curl http://localhost:$PORT/"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "=================="
echo "1. Make sure port $PORT is open in your firewall"
echo "2. Update ALLOWED_ORIGINS in .env with your domain"
echo "3. Configure reverse proxy if needed (see deployment guide)"
echo "4. Monitor the server logs for any issues"
echo ""
print_status "Deployment completed successfully! 🎉" 