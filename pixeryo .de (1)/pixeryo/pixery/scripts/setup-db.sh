#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Check if necessary environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Required environment variables not set."
  echo "Please set the following environment variables:"
  echo "  SUPABASE_URL                 - The URL of your Supabase project"
  echo "  SUPABASE_SERVICE_ROLE_KEY    - The service role key for your Supabase project"
  echo ""
  echo "Example usage:"
  echo "SUPABASE_URL=https://your-project-id.supabase.co SUPABASE_SERVICE_ROLE_KEY=your-service-role-key ./scripts/setup-db.sh"
  exit 1
fi

echo "Starting database setup..."
echo "URL: $SUPABASE_URL"

# Using node to run the setup script
node scripts/setup-production-db.js

# Check if the setup was successful
if [ $? -eq 0 ]; then
  echo "Database setup completed successfully!"
else
  echo "Database setup failed. Please check the error messages above."
  exit 1
fi 