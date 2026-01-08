# 🚀 Kelurahan API Frontend - Complete Guide

## Setup Status
✅ Backend (Django): Configured and Running
✅ Frontend: Ready with Token Authentication
✅ CORS: Enabled for cross-origin requests
✅ Database: Sample data loaded

---

## 📋 Quick Start

### 1. Ensure Django Server is Running
```bash
cd "d:\FRAMEWORK PRG\Kelurahan\data_kelurahan"
python manage.py runserver
```
Server will be at: `http://127.0.0.1:8000/`

### 2. Serve Frontend Files
Open a new terminal and run:
```bash
cd "d:\FRAMEWORK PRG\Kelurahan\frontend_kelurahan"
python -m http.server 8080
```
Frontend will be at: `http://localhost:8080`

### 3. Open Browser
Navigate to: `http://localhost:8080/index.html`

---

## 🔐 Authentication Details

**Admin Account:**
- Username: `admin`
- Email: `admin@kelurahan.local`
- Password: (set during creation)
- **Token**: `31aff164c2a680575c19848017db323182020fc9`

The frontend automatically uses this token for POST requests to add new warga.

---

## ✨ Features & Testing

### 1️⃣ View Warga List (No Auth Required)
- **GET** `/api/warga/` - Returns paginated list of warga
- Frontend loads automatically on page load
- Shows: NIK, Nama Lengkap, Alamat, No. Telepon, Tanggal Registrasi

**Test in Browser:**
1. Open `http://localhost:8080/index.html`
2. Scroll down to "Data Warga" section
3. You should see 5 sample warga records

### 2️⃣ Add New Warga (Auth Required)
- **POST** `/api/warga/` - Creates new warga record
- Requires valid token in Authorization header
- Token is automatically added by frontend

**Test in Browser:**
1. Fill the "Tambah Warga Baru" form with:
   - NIK: `3201061234567895` (unique)
   - Nama Lengkap: `Test User`
   - Alamat: `Jl. Test No. 1`
   - No. Telepon: `081234567890`
2. Click "Daftar Warga" button
3. You should see: ✅ "Warga berhasil ditambahkan!"
4. New warga appears in list below

### 3️⃣ Error Handling
If Django server is not running:
- Frontend shows: ❌ "Gagal memuat data..."
- Check browser console (F12) for details

---

## 🧪 Test with Postman (Optional)

### Get Token
```
POST http://127.0.0.1:8000/api/auth/token/
Content-Type: application/json

{
  "username": "admin",
  "password": "your_admin_password"
}
```

### View Warga (No Auth)
```
GET http://127.0.0.1:8000/api/warga/
```

### Add Warga (With Token)
```
POST http://127.0.0.1:8000/api/warga/
Content-Type: application/json
Authorization: Token 31aff164c2a680575c19848017db323182020fc9

{
  "nik": "3201061234567895",
  "nama_lengkap": "Test User",
  "alamat": "Jl. Test No. 1",
  "no_telepon": "081234567890"
}
```

---

## 📁 Project Structure

```
Kelurahan/
├── data_kelurahan/          # Django Backend
│   ├── manage.py
│   ├── db.sqlite3           # Database
│   ├── get_token.py         # Token generator script
│   ├── warga/
│   │   ├── views.py         # API ViewSets
│   │   ├── serializers.py   # Serializers
│   │   ├── models.py        # Data Models
│   │   └── fixtures/
│   │       └── warga_dummy.json  # Sample data
│   └── data_kelurahan/
│       └── settings.py      # Django Settings
│
└── frontend_kelurahan/      # React-like Frontend
    ├── index.html           # Main page
    ├── app.js               # JavaScript logic
    └── README.md            # This file
```

---

## 🔧 Configuration Details

### Django REST Framework Settings
- **Default Auth**: TokenAuthentication + SessionAuthentication
- **Default Permission**: IsAuthenticated
- **Pagination**: 3 items per page
- **CORS**: All origins allowed (development only)

### WargaViewSet Permissions
- **GET**: ✅ Public (IsAuthenticatedOrReadOnly)
- **POST/PUT/DELETE**: 🔐 Requires token

### PengaduanViewSet Permissions
- **All Operations**: 🔐 Admin only (IsAdminUser)

---

## 🎯 What You've Learned

1. ✅ Token Authentication in Django REST Framework
2. ✅ CORS configuration for frontend-backend communication
3. ✅ Fetching data from API using JavaScript
4. ✅ Sending authenticated POST requests
5. ✅ Error handling and user feedback
6. ✅ Frontend-Backend integration

---

## 💡 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Ensure Django has `CORS_ALLOW_ALL_ORIGINS = True` |
| 401 Unauthorized | Token must be in Authorization header |
| 404 Not Found | Check API URL and Django routing |
| Server Won't Start | Port 8000 might be in use; try `python manage.py runserver 8001` |
| Frontend shows no data | Ensure Django is running on port 8000 |

---

## 🚀 Next Steps

1. Implement form validation in JavaScript
2. Add delete/update functionality
3. Create a search feature
4. Add filtering by registration date
5. Implement pagination in frontend
6. Create admin dashboard
7. Add user authentication UI
8. Deploy to production

---

**Happy Coding! 🎉**
