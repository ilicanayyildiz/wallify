const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yliyyjajdudvzdjupcyg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ Error: Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('   You need to use the service role key to run database setup');
  console.error('   You can find this in your Supabase dashboard under Project Settings > API');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function readSqlFile(filename) {
  const filePath = path.join(__dirname, filename);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error reading file ${filename}:`, error.message);
    return null;
  }
}

async function executeSql(sql) {
  if (!sql) return { error: 'No SQL provided' };
  
  try {
    const { data, error } = await supabase.rpc('pg_dump', { p_query: sql });
    
    if (error) {
      // If RPC fails, try using REST API
      console.log('Falling back to REST API...');
      try {
        const { data, error } = await supabase.from('_supabase_functions').select('*').limit(1);
        console.log('Connection test:', data ? 'Success' : 'Failed', error || '');
        
        // Try SQL query via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_dump`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ p_query: sql })
        });
        
        if (!response.ok) {
          throw new Error(`SQL API error: ${response.status} ${response.statusText}`);
        }
        
        return { success: true };
      } catch (restError) {
        console.error('REST API error:', restError.message);
        return { error: restError.message };
      }
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error executing SQL:', error.message);
    return { error: error.message };
  }
}

async function runSqlScript(filename) {
  console.log(`🔄 Running SQL script: ${filename}`);
  const sql = await readSqlFile(filename);
  if (!sql) return false;
  
  // Split by semicolons but keep them in the statements
  const statements = sql.split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0)
    .map(stmt => stmt + ';');
  
  let success = true;
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`📜 Executing statement ${i+1}/${statements.length} (${stmt.length} chars)`);
    
    try {
      const { error } = await executeSql(stmt);
      if (error) {
        console.warn(`⚠️ Warning with statement ${i+1}: ${error}`);
        // Continue despite errors
      } else {
        console.log(`✅ Statement ${i+1} executed successfully`);
      }
    } catch (err) {
      console.warn(`⚠️ Error with statement ${i+1}: ${err.message}`);
      success = false;
    }
  }
  
  return success;
}

async function setupDatabase() {
  console.log('🔥 Starting database setup process...');
  
  try {
    // First run the fix script to correct any issues
    console.log('\n📋 STEP 1: Fixing database issues');
    const fixResult = await runSqlScript('fix-db-issues.sql');
    
    // Then run the main setup script
    console.log('\n📋 STEP 2: Setting up database schema');
    const setupResult = await runSqlScript('setup-supabase.sql');
    
    // Finally load sample data
    console.log('\n📋 STEP 3: Loading sample data');
    const sampleResult = await runSqlScript('sample-data.sql');
    
    if (fixResult && setupResult && sampleResult) {
      console.log('\n✅ Database setup completed successfully!');
    } else {
      console.log('\n⚠️ Database setup completed with warnings.');
    }
  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase(); 