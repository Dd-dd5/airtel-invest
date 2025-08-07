#!/usr/bin/env node

/**
 * Simple build script for TrueHost deployment
 * This bypasses the missing build:dev script issue
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Building Solar Invest for TrueHost...');

try {
  // Run the standard Vite build
  console.log('📦 Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit', cwd: process.cwd() });
  
  // Run post-build optimizations
  console.log('🔧 Running TrueHost optimizations...');
  execSync('node scripts/post-build.js', { stdio: 'inherit', cwd: process.cwd() });
  
  console.log('✅ Build complete! Ready for TrueHost deployment.');
  console.log('📁 Files are in the ./dist folder');
  console.log('📖 Check ./dist/DEPLOYMENT.md for upload instructions');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}