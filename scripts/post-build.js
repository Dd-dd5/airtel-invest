const fs = require('fs');
const path = require('path');

// Post-build script for TrueHost compatibility
console.log('🔧 Running TrueHost post-build optimizations...');

const distPath = path.join(__dirname, '..', 'dist');

// Create .htaccess file for proper routing on TrueHost
const htaccessContent = `
# TrueHost Configuration
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
`;

fs.writeFileSync(path.join(distPath, '.htaccess'), htaccessContent.trim());

// Create a simple PHP file for server-side compatibility (optional)
const phpIndexContent = `<?php
// TrueHost PHP compatibility
// This file ensures the React app loads properly on TrueHost
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solar Invest - Loading...</title>
    <script>
        // Redirect to the main React app
        window.location.href = './index.html';
    </script>
</head>
<body>
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h2>Loading Solar Invest...</h2>
        <p>If you're not redirected automatically, <a href="./index.html">click here</a>.</p>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distPath, 'index.php'), phpIndexContent);

// Update index.html to use relative paths
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Ensure all paths are relative
    indexContent = indexContent.replace(/href="\//g, 'href="./');
    indexContent = indexContent.replace(/src="\//g, 'src="./');
    
    fs.writeFileSync(indexPath, indexContent);
}

// Create deployment instructions
const deploymentInstructions = `
# TrueHost Deployment Instructions

## Files to Upload
Upload all files from the 'dist' folder to your TrueHost public_html directory.

## Required Files
- index.html (main app file)
- index.php (PHP compatibility file)
- .htaccess (server configuration)
- assets/ (CSS, JS, and image files)

## TrueHost Setup Steps
1. Log into your TrueHost cPanel
2. Open File Manager
3. Navigate to public_html
4. Upload all files from the dist folder
5. Set proper file permissions (644 for files, 755 for directories)

## Domain Configuration
- Main domain: yoursite.com
- Admin access: yoursite.com/admin
- Make sure to update the ADMIN_DOMAINS in src/pages/Admin.tsx before building

## Environment Variables
For production, create a .env file with:
VITE_MPESA_CONSUMER_KEY=your_actual_key
VITE_MPESA_CONSUMER_SECRET=your_actual_secret
VITE_AIRTEL_CLIENT_ID=your_actual_id
VITE_AIRTEL_CLIENT_SECRET=your_actual_secret

## Build Command
npm run build:truehost

This will create optimized files in the 'dist' folder ready for TrueHost.
`;

fs.writeFileSync(path.join(distPath, 'DEPLOYMENT.md'), deploymentInstructions.trim());

console.log('✅ TrueHost optimization complete!');
console.log('📁 Files ready in ./dist folder');
console.log('📖 Check DEPLOYMENT.md for upload instructions');