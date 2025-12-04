#!/bin/bash

# InterviewPrep.AI Frontend Setup Script
# This script helps set up the frontend development environment

set -e

echo "🚀 InterviewPrep.AI Frontend Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check if version is >= 16
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 16 ]; then
            print_warning "Node.js version 16 or higher is recommended. Current: $NODE_VERSION"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        echo "Download from: https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    if npm install; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Create environment file
create_env_file() {
    print_info "Creating environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        cat > .env.local << EOF
# Frontend Environment Configuration
# Update these values as needed

# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1

# Application Configuration
VITE_APP_NAME=InterviewPrep.AI
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-powered interview preparation platform

# Development Configuration
VITE_DEBUG=true
VITE_LOG_LEVEL=info

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_ENABLE_PERFORMANCE_MONITORING=false

# UI Configuration
VITE_DEFAULT_THEME=dark
VITE_ENABLE_ANIMATIONS=true
VITE_PARTICLE_COUNT=1000

# File Upload Configuration
VITE_MAX_FILE_SIZE_MB=5
VITE_ALLOWED_FILE_TYPES=pdf,doc,docx

# Interview Configuration
VITE_DEFAULT_QUESTION_COUNT=10
VITE_MAX_INTERVIEW_DURATION_MINUTES=60
VITE_ENABLE_VOICE_RECORDING=false
EOF
        print_status "Environment file created: .env.local"
    else
        print_warning "Environment file already exists: .env.local"
    fi
}

# Check Firebase configuration
check_firebase_config() {
    print_info "Checking Firebase configuration..."
    
    if [ -f "src/firebaseConfig.js" ]; then
        if grep -q "your-api-key" src/firebaseConfig.js; then
            print_warning "Firebase configuration needs to be updated"
            echo "Please update src/firebaseConfig.js with your Firebase project credentials"
        else
            print_status "Firebase configuration looks good"
        fi
    else
        print_error "Firebase configuration file not found: src/firebaseConfig.js"
        echo "Please create the Firebase configuration file"
    fi
}

# Check backend connection
check_backend() {
    print_info "Checking backend connection..."
    
    API_URL=$(grep "VITE_API_BASE_URL" .env.local | cut -d'=' -f2)
    if [ -z "$API_URL" ]; then
        API_URL="http://localhost:8000"
    fi
    
    if curl -s "$API_URL/health" > /dev/null 2>&1; then
        print_status "Backend is running at $API_URL"
    else
        print_warning "Backend is not running at $API_URL"
        echo "Please start the backend server before running the frontend"
    fi
}

# Run development server
start_dev_server() {
    print_info "Starting development server..."
    echo "The frontend will be available at: http://localhost:3000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    npm run dev
}

# Main setup function
main() {
    echo ""
    print_info "Starting setup process..."
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Create environment file
    create_env_file
    
    # Check configurations
    check_firebase_config
    check_backend
    
    echo ""
    print_status "Setup completed successfully!"
    echo ""
    print_info "Next steps:"
    echo "1. Update Firebase configuration in src/firebaseConfig.js"
    echo "2. Start the backend server (if not already running)"
    echo "3. Run 'npm run dev' to start the development server"
    echo ""
    
    # Ask if user wants to start dev server
    read -p "Would you like to start the development server now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_dev_server
    else
        print_info "You can start the development server later with: npm run dev"
    fi
}

# Run main function
main "$@"
