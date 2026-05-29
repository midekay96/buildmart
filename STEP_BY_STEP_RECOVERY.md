# 🔧 BUILDMART RECOVERY - STEP BY STEP GUIDE

**Total Time:** 20-30 minutes  
**Difficulty:** Easy  
**Risk Level:** 🟢 LOW (No files will be deleted)

---

## SECTION 1: PREPARATION (5 minutes)

### Step 1️⃣: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter
- Or use PowerShell

**Mac/Linux:**
- Press `Ctrl + Alt + T` (Linux) or `Cmd + Space` (Mac)
- Search for "Terminal"

### Step 2️⃣: Navigate to Your BuildMart Folder

```bash
cd C:\Users\HP\Buildmart
```

Or if you're on Mac/Linux:
```bash
cd ~/Buildmart
```

**What to see:** Your prompt should show you're in the Buildmart directory

### Step 3️⃣: Verify You're in the Right Place

```bash
dir
```

**You should see:**
```
backend/
frontend/
.claude/
.gitignore
package.json
README.md
RECOVERY_ACTION_PLAN.md
```

---

## SECTION 2: CLEAN GIT STAGING (5 minutes)

### Step 4️⃣: Check Current Git Status

```bash
git status --short
```

**You should see something like:**
```
AD "../.vscode/My Portfolio/images/..."
AD "../.bash_history"
AM "../.gitconfig"
...
```

This shows the foreign files that need to be removed.

### Step 5️⃣: Remove Foreign Files from Git Staging

**Copy and paste each command one at a time:**

```bash
git reset HEAD ../.bash_history
```

**Wait for it to complete, then:**

```bash
git reset HEAD ../.gitconfig
```

**Wait for it to complete, then:**

```bash
git reset HEAD "../.vscode"
```

**Wait for it to complete, then:**

```bash
git reset HEAD "../.vscode/argv.json"
```

### Step 6️⃣: Verify the Cleanup

```bash
git status --short
```

**Expected result:** 
- Should show empty, OR
- Should only show BuildMart files (if any)
- Should NOT show anything from `../.vscode` or `../.bash_history`

---

## SECTION 3: UPDATE .gitignore (2 minutes)

### Step 7️⃣: Add Foreign Files to .gitignore

This prevents these files from being staged again in the future.

**Windows (Command Prompt):**
```bash
echo. >> .gitignore
echo # Parent directory files - prevent staging foreign projects >> .gitignore
echo ../.vscode/ >> .gitignore
echo ../.bash_history >> .gitignore
echo ../.gitconfig >> .gitignore
```

**Mac/Linux (Terminal):**
```bash
cat >> .gitignore << 'EOF'

# Parent directory files - prevent staging foreign projects
../.vscode/
../.bash_history
../.gitconfig
EOF
```

### Step 8️⃣: Verify .gitignore Was Updated

```bash
tail .gitignore
```

**You should see the last few lines contain:**
```
../.vscode/
../.bash_history
../.gitconfig
```

---

## SECTION 4: INSTALL DEPENDENCIES (5 minutes)

### Step 9️⃣: Install All Dependencies

This installs npm packages for the root, frontend, and backend.

```bash
npm run install-all
```

**What to expect:**
- Takes 3-5 minutes
- Will download hundreds of packages
- You'll see "added X packages" at the end
- May show some warnings (these are normal)

**If it fails:**
Try this alternative:
```bash
npm install
cd frontend
npm install
cd ../backend
npm install
cd ..
```

### Step 🔟: Verify Installation

```bash
npm list --depth=0
```

**You should see:**
```
buildmart@ 1.0.0
├── concurrently@8.2.1
└── ...
```

---

## SECTION 5: START THE APPLICATION (3 minutes)

### Step 1️⃣1️⃣: Start Both Frontend and Backend

```bash
npm run dev
```

**What to expect:**
- Terminal will show both servers starting
- Takes 30-60 seconds
- You should see messages like:
  ```
  ✓ Database connected
  ✓ Models synced
  ✓ Server running on http://localhost:5000
  ```

**If you see errors, scroll down to "TROUBLESHOOTING" section**

### Step 1️⃣2️⃣: Keep Terminal Open

**Important:** Leave this terminal window open while you test the app. Do NOT close it.

---

## SECTION 6: TEST IN BROWSER (5 minutes)

### Step 1️⃣3️⃣: Open Browser and Go to Frontend

Open your web browser (Chrome, Firefox, Safari, Edge) and go to:

```
http://localhost:3000
```

**You should see:**
- BuildMart homepage
- Teal color scheme
- Products displayed
- Navbar with navigation

### Step 1️⃣4️⃣: Test These Features

**✓ Product Shop:**
- Click "Shop" in navbar
- See product grid
- Try searching for a product
- Try filtering by category

**✓ Cost Estimator:**
- Click "Estimator" in navbar
- Fill in some values
- See calculations update
- Try exporting (PDF/Excel button)

**✓ Shopping Cart:**
- Click on a product
- Click "Add to Cart"
- Click "Cart" in navbar
- See item in cart
- Increase/decrease quantity
- Remove items

**✓ Orders Tab:**
- Click "Orders" in navbar
- See order history (will be empty if new)

**✓ Suppliers:**
- Click "Suppliers" in navbar
- See supplier list

**✓ Theme Toggle:**
- Look for theme toggle button (usually top-right)
- Click it to switch between dark/light mode

### Step 1️⃣5️⃣: Test Admin Portal (Secret)

This is hidden! Follow carefully:

1. In the address bar, after `localhost:3000`, add `#admin`
2. Full URL should be: `http://localhost:3000/#admin`
3. Press Enter
4. You should see a login screen

**Dev Admin Credentials:**
- Username: `admin`
- Password: `password`

(These are for development only - they're in the code as examples)

**If you don't have these credentials:**
- Check `frontend/.env.local` file
- Look for `REACT_APP_ADMIN_USER` and `REACT_APP_ADMIN_PASS`
- Use those values to login

Once logged in, you should see:
- Dashboard with KPIs
- Analytics page
- Orders management
- Products management
- Suppliers management
- Customers, Payments, Notifications, Reports, Settings tabs

### Step 1️⃣6️⃣: Test Backend Health Check

Open a NEW browser tab and go to:

```
http://localhost:5000/api/health
```

**You should see:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-05-28T..."
}
```

---

## SECTION 7: VERIFICATION CHECKLIST

### Step 1️⃣7️⃣: Complete This Checklist

Go through each item. If ALL are ✅, your recovery is complete!

**Frontend Tests:**
- [ ] Homepage loads with hero section
- [ ] Products display in shop
- [ ] Search works (try searching "lumber")
- [ ] Category filter works
- [ ] Can add product to cart
- [ ] Cart updates correctly
- [ ] Can increase/decrease quantity
- [ ] Can remove items from cart
- [ ] Orders tab works
- [ ] Suppliers page loads
- [ ] Estimator opens and calculates
- [ ] Theme toggle (dark/light) works
- [ ] Navbar shows current section as active

**Admin Portal Tests:**
- [ ] Can navigate to http://localhost:3000/#admin
- [ ] Login screen appears
- [ ] Can login with admin credentials
- [ ] Dashboard shows KPIs
- [ ] Analytics tab loads
- [ ] Orders tab shows data
- [ ] Products tab shows products
- [ ] Can add new product
- [ ] Suppliers tab works
- [ ] Customers tab loads
- [ ] Payments tab shows data
- [ ] Notifications tab works
- [ ] Reports tab works
- [ ] Settings tab loads
- [ ] Logout button works

**Backend Tests:**
- [ ] Health check endpoint responds: http://localhost:5000/api/health
- [ ] No errors in terminal

**If ALL checked:** ✅ **RECOVERY COMPLETE!**

---

## SECTION 8: TROUBLESHOOTING

### Issue: "npm: command not found"

**Problem:** Node.js/npm not installed

**Solution:**
1. Go to https://nodejs.org
2. Download LTS version
3. Install it
4. Close terminal and open a new one
5. Retry `npm run dev`

---

### Issue: "Port 3000 already in use"

**Problem:** Another app is using port 3000

**Windows Solution:**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace XXXX with the PID number shown above)
taskkill /PID XXXX /F

# Try npm run dev again
npm run dev
```

**Mac/Linux Solution:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (replace XXXX with the PID number)
kill -9 XXXX

# Try npm run dev again
npm run dev
```

---

### Issue: "Port 5000 already in use"

**Same solution as above, but use port 5000:**

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID XXXX /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 XXXX
```

---

### Issue: "Cannot find module" errors

**Problem:** Dependencies didn't install properly

**Solution:**
```bash
# Delete node_modules folders
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Delete lock files
rm package-lock.json
rm frontend/package-lock.json
rm backend/package-lock.json

# Reinstall everything
npm run install-all

# Try running again
npm run dev
```

---

### Issue: "Cannot connect to PostgreSQL"

**Problem:** Database not running or wrong credentials

**Solution 1: Start PostgreSQL**
- Make sure PostgreSQL server is running on your computer
- Open pgAdmin or use command line

**Solution 2: Create Database**
```sql
CREATE DATABASE buildmart_db;
```

**Solution 3: Check Credentials**
- Open `backend/.env`
- Verify these values match your PostgreSQL setup:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=buildmart_db
  DB_USER=postgres
  DB_PASSWORD=postgres
  ```

**Solution 4: Update Credentials**
- If your PostgreSQL uses different credentials, update them in `backend/.env`
- Save the file
- Restart: `npm run dev`

---

### Issue: Frontend won't connect to backend

**Problem:** CORS error or wrong API URL

**Solution 1: Check Frontend .env**
- Open `frontend/.env`
- Should contain: `REACT_APP_API_URL=http://localhost:5000/api`
- If different, update it to match

**Solution 2: Restart Both**
```bash
# In terminal, press Ctrl+C to stop
# Then restart
npm run dev
```

**Solution 3: Check Browser Console**
- Open browser F12 (Developer Tools)
- Look at Console tab
- See what error is shown
- Screenshot it and check the SETUP_GUIDE.md

---

### Issue: Admin login not working

**Problem:** Wrong credentials or .env not configured

**Solution 1: Check Credentials**
- Open `frontend/.env.local`
- Look for:
  ```
  REACT_APP_ADMIN_USER=admin
  REACT_APP_ADMIN_PASS=password
  ```
- Use these exact values in login

**Solution 2: Add Missing File**
If `.env.local` doesn't exist, create it:

**Windows Command Prompt:**
```bash
echo REACT_APP_ADMIN_USER=admin > frontend\.env.local
echo REACT_APP_ADMIN_PASS=password >> frontend\.env.local
```

**Mac/Linux Terminal:**
```bash
cat > frontend/.env.local << 'EOF'
REACT_APP_ADMIN_USER=admin
REACT_APP_ADMIN_PASS=password
EOF
```

**Solution 3: Restart Frontend**
```bash
# In terminal, press Ctrl+C
# Then restart
npm run dev
```

---

### Issue: "EACCES: permission denied"

**Problem:** Permission issue on Mac/Linux

**Solution:**
```bash
sudo chown -R $USER:$USER .
npm run install-all
npm run dev
```

---

## SECTION 9: NEXT STEPS

### After Verification ✅

**If everything passed the checklist:**

1. **Stop the server** (Press Ctrl+C in terminal)

2. **Commit your cleanup** (optional but recommended):
```bash
git add .gitignore
git commit -m "chore: add foreign files to gitignore"
```

3. **Read the guides:**
   - Open `QUICK_START.md` — Quick reference
   - Open `SETUP_GUIDE.md` — Detailed explanations
   - Open `PROJECT_STRUCTURE.md` — Architecture overview

4. **Explore the code:**
   - Look in `frontend/src/components/` to see React components
   - Look in `backend/models/` to understand database schema
   - Look in `backend/routes/` to see API endpoints

5. **Plan Phase 2:**
   - Payment integration (Stripe/PayPal)
   - Email notifications
   - Wishlist feature
   - Admin enhancements

---

## SECTION 10: QUICK REFERENCE

### Common Commands

**Start both frontend and backend:**
```bash
npm run dev
```

**Start only frontend:**
```bash
npm run dev:frontend
```

**Start only backend:**
```bash
npm run dev:backend
```

**Install dependencies:**
```bash
npm run install-all
```

**Build for production:**
```bash
npm run build:frontend
npm run build:backend
```

**Stop the server:**
Press `Ctrl+C` in the terminal

---

## ✅ SUMMARY

You have completed:
- ✅ Section 1: Prepared terminal and navigated to folder
- ✅ Section 2: Cleaned git staging of foreign files
- ✅ Section 3: Updated .gitignore
- ✅ Section 4: Installed all dependencies
- ✅ Section 5: Started both servers
- ✅ Section 6: Tested all features in browser
- ✅ Section 7: Verified everything works
- ✅ Section 8: Troubleshot any issues
- ✅ Section 9: Reviewed next steps

**Your BuildMart project is now fully recovered and working!** 🎉

---

## 📞 IF YOU GET STUCK

1. **Read the error message carefully** — it usually tells you what's wrong
2. **Check SETUP_GUIDE.md** — has detailed troubleshooting
3. **Check browser F12 console** — shows frontend errors
4. **Check terminal output** — shows backend errors
5. **Screenshot the error** — helps diagnose issues

---

**Total Time Taken:** _______ minutes

**Status:** ✅ COMPLETE

**Next:** Read QUICK_START.md for maintenance tips

---

*Last Updated: May 28, 2026*  
*BuildMart Project Recovery*  
*Phase 1: COMPLETE*
