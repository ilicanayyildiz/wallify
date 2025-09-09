#!/bin/bash

# Set default values for Supabase URL
SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-"https://yliyyjajdudvzdjupcyg.supabase.co"}

# Check if service key is provided
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY is required"
  echo ""
  echo "Please run this script with your Supabase service role key:"
  echo ""
  echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key ./scripts/setup-supabase-db.sh"
  echo ""
  echo "You can find this key in your Supabase dashboard:"
  echo "Project Settings > API > Project API keys > service_role key"
  exit 1
fi

echo "🔄 Setting up Supabase database..."
echo "URL: $SUPABASE_URL"

# Use the direct setup script
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL node scripts/direct-db-setup.js

# Check result
if [ $? -eq 0 ]; then
  echo "✅ Supabase database setup complete!"
else
  echo "❌ Supabase database setup failed"
  exit 1
fi 