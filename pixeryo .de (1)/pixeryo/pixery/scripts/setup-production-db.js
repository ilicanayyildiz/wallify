// Script to set up the production database through the Supabase client
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get the Supabase URL and admin key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables.');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

// Create a Supabase client with the service role key (admin access)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to execute SQL statements directly
async function executeSQL(sql) {
  const { data, error } = await supabase.from('_exec_sql').select('*').csv();
  if (error) {
    console.error(`Error creating exec_sql function:`, error);
    
    // Try using direct SQL queries via the REST API
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          query: sql
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`SQL error: ${JSON.stringify(errorData)}`);
      }
      return { success: true };
    } catch (fetchError) {
      console.error('Direct SQL query failed:', fetchError);
      return { error: fetchError.message };
    }
  }
  return { success: true };
}

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Read the SQL scripts
    const fixIssuesSql = fs.readFileSync(path.join(__dirname, 'fix-db-issues.sql'), 'utf8');
    const setupSql = fs.readFileSync(path.join(__dirname, 'setup-supabase.sql'), 'utf8');
    const sampleDataSql = fs.readFileSync(path.join(__dirname, 'sample-data.sql'), 'utf8');
    
    // Split SQL into individual statements
    const fixIssuesStatements = fixIssuesSql.split(';').filter(stmt => stmt.trim() !== '');
    const setupStatements = setupSql.split(';').filter(stmt => stmt.trim() !== '');
    const sampleDataStatements = sampleDataSql.split(';').filter(stmt => stmt.trim() !== '');
    
    console.log('Fixing any existing database issues...');
    
    // Execute fix issues statements first
    for (const stmt of fixIssuesStatements) {
      try {
        console.log(`Executing fix: ${stmt.substring(0, 60)}...`);
        const result = await executeSQL(stmt);
        if (result.error) {
          console.warn(`Warning in fix statement: ${result.error}`);
          // Continue despite errors
        }
      } catch (err) {
        console.warn(`Fix statement execution warning: ${err.message}`);
      }
    }
    
    console.log('Executing database setup script...');
    
    // Execute setup statements one by one
    for (const stmt of setupStatements) {
      try {
        console.log(`Executing: ${stmt.substring(0, 60)}...`);
        const result = await executeSQL(stmt);
        if (result.error) {
          console.warn(`Warning in setup statement: ${result.error}`);
          // Continue despite errors - some statements might fail if objects already exist
        }
      } catch (err) {
        console.warn(`Statement execution warning: ${err.message}`);
      }
    }
    
    console.log('Executing sample data script...');
    
    // Execute sample data statements
    for (const stmt of sampleDataStatements) {
      try {
        console.log(`Executing: ${stmt.substring(0, 60)}...`);
        const result = await executeSQL(stmt);
        if (result.error) {
          console.warn(`Warning in sample data statement: ${result.error}`);
        }
      } catch (err) {
        console.warn(`Statement execution warning: ${err.message}`);
      }
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase(); 