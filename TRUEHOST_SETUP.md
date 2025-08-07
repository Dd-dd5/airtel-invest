# TrueHost Deployment Guide for Solar Invest

## Prerequisites
1. TrueHost hosting account
2. Domain name configured with TrueHost
3. cPanel access

## Step 1: Build the Application
```bash
npm install
node build.js
```

Alternative if the above doesn't work:
```bash
npx vite build && node scripts/post-build.js
```

## Step 2: Upload Files to TrueHost
1. Log into your TrueHost cPanel
2. Open File Manager
3. Navigate to `public_html` directory
4. Upload ALL files from the `dist` folder to `public_html`
5. Extract if uploaded as ZIP

## Step 3: Set File Permissions
- Files: 644
- Directories: 755
- .htaccess: 644

## Step 4: Configure Domain
Update the admin domains in the code before building:
```javascript
const ADMIN_DOMAINS = [
  'yourdomain.com',
  'www.yourdomain.com',
  'admin.yourdomain.com'
];
```

## Step 5: Environment Variables
Create a `.env` file in your project root with your actual API credentials:
```
VITE_MPESA_CONSUMER_KEY=your_actual_key
VITE_MPESA_CONSUMER_SECRET=your_actual_secret
```

## Step 6: Test the Application
1. Visit your domain: `https://yourdomain.com`
2. Test admin access: `https://yourdomain.com/admin`
3. Test all functionality

## File Structure on TrueHost
```
public_html/
├── index.html          (Main React app)
├── index.php           (PHP compatibility)
├── .htaccess           (Server configuration)
├── assets/             (CSS, JS, images)
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── DEPLOYMENT.md       (Instructions)
```

## Important Notes
- The app uses localStorage for data storage
- No database setup required
- All payment processing is handled client-side
- Admin panel is accessible via `/admin` route
- Mobile-responsive design works on all devices

## Troubleshooting
1. **404 errors**: Check .htaccess file is uploaded and working
2. **Blank page**: Check browser console for JavaScript errors
3. **Admin access**: Verify domain is in ADMIN_DOMAINS array
4. **Mobile payments**: Ensure API credentials are correct

## Support
For TrueHost-specific issues, contact TrueHost support.
For application issues, check the browser console for errors.