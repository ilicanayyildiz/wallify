#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")/.."

echo "Preparing to deploy to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check for required environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "Error: Missing required environment variables for Supabase."
    echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    exit 1
fi

# Build the application
echo "Building the application..."
npm run build

# Set environment variables for Vercel
echo "Setting environment variables in Vercel..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete! Your application is now live on Vercel."

echo "Setting up production database..."
# For running the database setup, you need to set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
# Run this separately with proper credentials:
# SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npm run setup-db
echo "To set up the database, run:"
echo "SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npm run setup-db" 