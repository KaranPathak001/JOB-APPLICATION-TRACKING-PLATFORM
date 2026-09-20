import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function checkAll() {
  console.log('=== JOBFLOW AI CONNECTION & CONFIG AUDIT ===\n');

  // 1. Environment & Keys
  console.log('[1/4] Environment Configurations:');
  console.log('  • PORT:', process.env.PORT || '5000 (default)');
  console.log('  • NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('  • CLIENT_URL:', process.env.CLIENT_URL || 'http://localhost:5173');
  console.log('  • JWT_SECRET:', process.env.JWT_SECRET ? `✓ Configured (${process.env.JWT_SECRET.length} chars)` : '✗ Missing');
  console.log('  • MONGODB_URI:', process.env.MONGODB_URI ? '✓ Configured' : '✗ Missing (Using fallback)');
  console.log('  • OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 0 ? `✓ Configured (${process.env.OPENROUTER_API_KEY.substring(0, 8)}...)` : '○ Empty (Local smart heuristic fallback active)');
  console.log('  • OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001 (default)');
  console.log('  • GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.trim().length > 0 ? '✓ Configured' : '○ Optional (Not set)');
  console.log('  • GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET.trim().length > 0 ? '✓ Configured' : '○ Optional (Not set)');
  console.log('');

  // 2. Database Connection
  console.log('[2/4] Testing MongoDB Connection:');
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobflow_ai';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`  ✓ MongoDB Connected Successfully!`);
    console.log(`    Host: ${conn.connection.host}`);
    console.log(`    Database: ${conn.connection.name}`);
    await mongoose.disconnect();
  } catch (err) {
    console.log(`  ⚠ MongoDB is unreachable (${err.message}).`);
    console.log(`    Note: The server has in-memory mock/demo resilience mode for offline testing.`);
  }
  console.log('');

  // 3. OpenRouter API Connection
  console.log('[3/4] Testing OpenRouter AI Connection:');
  if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 0) {
    try {
      const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY.trim()}`,
          'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'JobFlow AI',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Respond with only "OK"' }],
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const answer = data?.choices?.[0]?.message?.content?.trim();
      console.log(`  ✓ OpenRouter API Connected! Model: ${model}, Response: "${answer}"`);
    } catch (err) {
      console.log(`  ⚠ OpenRouter API Error: ${err.message}`);
    }
  } else {
    console.log('  ○ OpenRouter API key is not configured (Paste in server/.env when ready).');
  }
  console.log('');

  // 4. Summary
  console.log('[4/4] Final Verdict:');
  console.log('  Backend environment and connection check complete.\n');
  process.exit(0);
}

checkAll();
