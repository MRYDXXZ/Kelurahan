# 🔗 Frontend Integration Guide - Login & Pengaduan Connection

## System Overview

The frontend now has a complete authentication system with navigation between pages:

```
┌─────────────────────────────────────────────────────────────────┐
│                   Kelurahan Warga System                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  index.html (Warga List)                                         │
│  ├─ 🏠 Warga (current)                                          │
│  ├─ 📢 Pengaduan → pengaduan.html                               │
│  └─ 🔐 Login/Logout → login.html                                │
│                                                                   │
│  login.html (Authentication)                                     │
│  ├─ Username/Password login                                      │
│  ├─ Token storage in localStorage                                │
│  └─ ← Kembali → index.html                                       │
│                                                                   │
│  pengaduan.html (Complaints)                                     │
│  ├─ 📋 Daftar Warga → index.html                                │
│  ├─ 🔐 Login → login.html                                       │
│  └─ Form untuk membuat pengaduan                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Step 1: User Opens Website
→ `index.html` loads
→ Check if token exists in localStorage
→ If yes: Show "Terhubung" status + Logout button
→ If no: Show "Belum Login" status + Login button

### Step 2: User Clicks Login Button
→ Navigate to `login.html`
→ User enters username & password
→ Send POST request to `http://127.0.0.1:8000/api/auth/token/`
→ Backend returns token
→ Save token in localStorage
→ Redirect back to `index.html`

### Step 3: User Wants to Add Warga
→ Check if logged in (token in localStorage)
→ If NOT logged in: Show error + redirect to login.html
→ If logged in: Use token in Authorization header
→ Send POST request with warga data
→ Refresh warga list

### Step 4: User Logs Out
→ Click "🚪 Logout" button
→ Remove token from localStorage
→ Update UI to show "Belum Login"
→ Can't add warga without logging in again

---

## 📁 File Structure & Connections

### `index.html`
**Purpose:** Display warga list and add new warga
**Navigation Bar:**
- 🏠 Warga (current page)
- 📢 Pengaduan → `href="pengaduan.html"`
- 🔐 Login/Logout → `href="login.html"` or logout function

**Auth Status:**
- Shows connection status (green dot = connected, red = not connected)
- Shows "Terhubung" or "Belum Login" text

### `login.html`
**Purpose:** Authenticate user and get token
**Features:**
- Username/Password form
- POST to `/api/auth/token/`
- Stores token in `localStorage['api_token']`
- Auto-redirect if already logged in
- Back link → `href="index.html"`

### `pengaduan.html`
**Purpose:** Manage complaints
**Navigation:**
- Daftar Warga link → `href="index.html"`
- Login link (if needed) → `href="login.html"`
- Uses token from localStorage for authentication

### `app.js`
**Functions:**
```javascript
getStoredToken()           // Get token from localStorage
isLoggedIn()               // Check if logged in
updateAuthUI()             // Update navbar auth status
logout()                   // Remove token and update UI
addNewWarga()              // Add warga (requires login)
```

**Key Features:**
- Reads token from localStorage
- Adds token to Authorization header
- Checks login status before allowing POST
- Redirects to login if not authenticated

### `pengaduan.js`
**Functions:**
- Similar authentication flow
- Uses token from localStorage
- Requires admin/staff permissions

---

## 🔑 Token Storage & Usage

### Storage Location
```javascript
localStorage['api_token']  // Key name: 'api_token'
```

### How Token is Used
```javascript
// Get token
const token = localStorage.getItem('api_token');

// Use in API requests
fetch('/api/warga/', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${token}`  // Format: "Token <token_string>"
  },
  body: JSON.stringify(data)
});
```

### Token Expiry
- **Backend:** TokenAuthentication doesn't expire by default
- **Frontend:** Token stays in localStorage until user logs out
- **Clear token:** Click Logout button or clear browser storage

---

## 🎯 User Workflows

### Workflow 1: First-Time User (Not Logged In)
```
1. Open index.html
   ↓
2. See "Belum Login" in navbar + red status dot
   ↓
3. Try to add warga
   ↓
4. Get error message: "Anda harus login terlebih dahulu"
   ↓
5. Click "🔐 Login" button
   ↓
6. Go to login.html
   ↓
7. Enter admin / password
   ↓
8. Click "Login"
   ↓
9. Token saved in localStorage
   ↓
10. Redirect to index.html
    ↓
11. See "Terhubung" in navbar + green status dot
    ↓
12. Can now add warga successfully
```

### Workflow 2: Returning User (Already Logged In)
```
1. Open index.html
   ↓
2. See "Terhubung" in navbar + green status dot
   ↓
3. Can directly add warga
   ↓
4. Token automatically used in requests
```

### Workflow 3: User Logs Out
```
1. Click "🚪 Logout" button
   ↓
2. Token removed from localStorage
   ↓
3. UI updates to "Belum Login" + red dot
   ↓
4. Can't add warga anymore
   ↓
5. To add warga again: must login again
```

---

## 🔍 Testing the System

### Test 1: Navigation
- [x] index.html → pengaduan.html (📢 Pengaduan link)
- [x] pengaduan.html → index.html (Daftar Warga link)
- [x] pengaduan.html → login.html (Login link)
- [x] index.html → login.html (🔐 Login button)
- [x] login.html → index.html (← Kembali link)

### Test 2: Login Flow
```bash
1. Go to http://localhost:8080/login.html (or open login.html)
2. Enter username: admin
3. Enter password: (your password)
4. Click "Login"
5. Should redirect to index.html
6. Check localStorage['api_token'] in browser console:
   → window.localStorage.getItem('api_token')
   → Should show token string
```

### Test 3: Adding Warga
```bash
1. Go to index.html (logged in)
2. Fill warga form
3. Click "Daftar Warga"
4. Should see ✅ success message
5. New warga appears in list
```

### Test 4: Without Login
```bash
1. Delete token from localStorage:
   → window.localStorage.removeItem('api_token')
2. Try to add warga
3. Should see ❌ error: "Anda harus login terlebih dahulu"
4. Should redirect to login.html
```

### Test 5: Auth Status Indicator
```bash
1. Logged in:
   - Show: "Terhubung" + green dot
   - Button: "🚪 Logout"
2. Not logged in:
   - Show: "Belum Login" + red dot
   - Button: "🔐 Login"
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Login doesn't work | Check if Django server is running on port 8000 |
| Token not saved | Check browser console, enable localStorage |
| Can't add warga | Make sure you're logged in (check navbar) |
| Token not recognized | Token might be invalid, try logging in again |
| Page doesn't redirect | Check browser console for JavaScript errors |
| Status dot not changing | Refresh page or check localStorage |

---

## 🔧 Backend API Endpoints Used

### Authentication
```
POST /api/auth/token/
Request: {"username": "admin", "password": "password"}
Response: {"token": "31aff164c2a680575c19848017db323182020fc9"}
```

### Add Warga (Requires Token)
```
POST /api/warga/
Headers: Authorization: Token <token>
Body: {
  "nik": "...",
  "nama_lengkap": "...",
  "alamat": "...",
  "no_telepon": "..."
}
```

### Get Warga (Public)
```
GET /api/warga/
No authentication required
Returns: Paginated list of warga
```

---

## 📱 Browser Storage

### localStorage Usage
```javascript
// Save token after login
localStorage.setItem('api_token', token);

// Get token when needed
const token = localStorage.getItem('api_token');

// Remove token on logout
localStorage.removeItem('api_token');

// Check if logged in
const isLoggedIn = !!localStorage.getItem('api_token');
```

### Note
- localStorage is **NOT** cleared when browser closes
- Token persists until manually deleted
- Suitable for development; use secure methods in production

---

## 🚀 Quick Start

### 1. Start Django Server
```bash
cd "d:\FRAMEWORK PRG\Kelurahan\data_kelurahan"
"D:\FRAMEWORK PRG\Kelurahan\env\Scripts\python.exe" manage.py runserver
```

### 2. Serve Frontend
```bash
cd "d:\FRAMEWORK PRG\Kelurahan\frontend_kelurahan"
python -m http.server 8080
```

### 3. Open in Browser
```
http://localhost:8080/index.html
```

### 4. Test Flow
1. See "Belum Login" in navbar
2. Click "🔐 Login"
3. Enter admin / password
4. Get redirected to index.html
5. See "Terhubung" in navbar
6. Add warga successfully

---

## ✅ Implementation Status

- [x] Navigation navbar in index.html
- [x] Login button (redirects to login.html)
- [x] Logout button (removes token + updates UI)
- [x] Auth status indicator (green/red dot)
- [x] login.html with username/password
- [x] Token storage in localStorage
- [x] Pengaduan link to pengaduan.html
- [x] Auto-redirect if already logged in
- [x] Token requirement for adding warga
- [x] Error message if not logged in

**Everything is connected and working! 🎉**

---

**Last Updated:** January 8, 2026
