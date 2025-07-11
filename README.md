# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/92240f05-866b-4cf5-ab73-5fecca554a49

## 🔧 Admin Dashboard Access

### For Production Deployment:

1. **Update Admin Configuration**:
   ```typescript
   // In src/pages/Admin.tsx, update these values:
   const ADMIN_DOMAINS = [
     'your-actual-domain.com',
     'admin.your-actual-domain.com', // Optional admin subdomain
   ];
   
   const ADMIN_ACCESS_KEY = 'your-secure-admin-key-2024';
   ```

2. **Access Methods**:
   - **Direct URL**: `https://your-domain.com/admin`
   - **Admin Subdomain**: `https://admin.your-domain.com/admin`
   - **Access Key**: Use the secure key you set above

3. **Security Setup**:
   - Change the `ADMIN_ACCESS_KEY` to a secure, unique value
   - Add your domain to the `ADMIN_DOMAINS` array
   - Consider implementing additional authentication layers

### Admin Dashboard Features:
- ✅ Real-time transaction monitoring
- ✅ User management and analytics
- ✅ Transaction filtering and search
- ✅ CSV export functionality
- ✅ Live activity tracking

## 📱 Mobile Money Integration

### Automatic Payment Processing:

1. **M-Pesa Integration**:
   - STK Push automatically triggered
   - Users receive payment prompt on their phone
   - Just need to enter PIN to complete

2. **Airtel Money Integration**:
   - Similar STK Push functionality
   - Automatic payment request to user's phone

3. **Setup for Production**:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your actual API credentials
   VITE_MPESA_CONSUMER_KEY=your_actual_key
   VITE_MPESA_CONSUMER_SECRET=your_actual_secret
   VITE_AIRTEL_CLIENT_ID=your_actual_id
   VITE_AIRTEL_CLIENT_SECRET=your_actual_secret
   ```

### Payment Flow:
1. User enters deposit amount
2. Clicks M-Pesa or Airtel Money button
3. STK push sent to their phone automatically
4. User enters PIN on their phone
5. Payment confirmed and balance updated instantly

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/92240f05-866b-4cf5-ab73-5fecca554a49) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/92240f05-866b-4cf5-ab73-5fecca554a49) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
