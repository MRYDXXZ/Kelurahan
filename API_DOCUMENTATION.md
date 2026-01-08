# 📚 API Documentation - Kelurahan Warga Management

## Overview
This document provides a comprehensive guide to the API Aplikasi Warga Kelurahan. The API supports token-based authentication and includes interactive documentation.

---

## 🚀 Accessing API Documentation

### 1. **Swagger UI (Interactive)**
- **URL**: `http://127.0.0.1:8000/api/docs/`
- **Format**: Interactive Swagger/OpenAPI documentation
- **Features**: Try API endpoints directly from the browser
- **Best for**: Testing and exploring the API

### 2. **ReDoc (Beautiful Documentation)**
- **URL**: `http://127.0.0.1:8000/api/redoc/`
- **Format**: Alternative interactive documentation
- **Features**: Cleaner, more readable format
- **Best for**: Reading and understanding the API

### 3. **OpenAPI Schema (Raw)**
- **URL**: `http://127.0.0.1:8000/api/schema/`
- **Format**: JSON (OpenAPI 3.0 specification)
- **Best for**: Code generation and API client creation

---

## 🔐 Authentication

### Token Authentication
All API endpoints require token authentication except for public read operations.

**Header Format:**
```
Authorization: Token YOUR_TOKEN_HERE
```

**Admin Token:**
```
31aff164c2a680575c19848017db323182020fc9
```

### Getting a Token
```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'
```

---

## 📋 API Endpoints

### 1. **Warga (Residents) Endpoints**

#### List All Warga (Public - No Auth Required)
```
GET /api/warga/
```
**Response:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "nik": "3201011234567890",
      "nama_lengkap": "Budi Santoso",
      "alamat": "Jl. Merdeka No. 10",
      "no_telepon": "081234567890",
      "tanggal_registrasi": "2025-01-01T10:00:00Z"
    }
  ]
}
```

#### Create Warga (Auth Required - POST)
```
POST /api/warga/
Authorization: Token YOUR_TOKEN
Content-Type: application/json

{
  "nik": "3201061234567895",
  "nama_lengkap": "New User",
  "alamat": "Jl. Test No. 1",
  "no_telepon": "081234567890"
}
```

#### Retrieve Single Warga (Public)
```
GET /api/warga/{id}/
```

#### Update Warga (Auth Required)
```
PUT /api/warga/{id}/
Authorization: Token YOUR_TOKEN
Content-Type: application/json

{
  "nik": "3201011234567890",
  "nama_lengkap": "Updated Name",
  "alamat": "Updated Address",
  "no_telepon": "08111111111"
}
```

#### Partial Update (Auth Required)
```
PATCH /api/warga/{id}/
Authorization: Token YOUR_TOKEN
Content-Type: application/json

{
  "nama_lengkap": "Updated Name"
}
```

#### Delete Warga (Auth Required)
```
DELETE /api/warga/{id}/
Authorization: Token YOUR_TOKEN
```

### 2. **Pengaduan (Complaints) Endpoints**

#### List All Pengaduan (Admin Only)
```
GET /api/pengaduan/
Authorization: Token ADMIN_TOKEN
```

#### Create Pengaduan (Admin Only)
```
POST /api/pengaduan/
Authorization: Token ADMIN_TOKEN
Content-Type: application/json

{
  "judul": "Complaint Title",
  "isi": "Complaint Details",
  "status": "pending"
}
```

#### Retrieve Single Pengaduan (Admin Only)
```
GET /api/pengaduan/{id}/
Authorization: Token ADMIN_TOKEN
```

#### Update Pengaduan (Admin Only)
```
PUT /api/pengaduan/{id}/
Authorization: Token ADMIN_TOKEN
Content-Type: application/json

{
  "judul": "Updated Title",
  "isi": "Updated Details",
  "status": "resolved"
}
```

#### Delete Pengaduan (Admin Only)
```
DELETE /api/pengaduan/{id}/
Authorization: Token ADMIN_TOKEN
```

### 3. **Authentication Endpoints**

#### Get Token
```
POST /api/auth/token/
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

---

## 🔍 Query Parameters

### Filtering
```
GET /api/warga/?nik=3201011234567890
GET /api/pengaduan/?status=pending
```

### Searching
```
GET /api/warga/?search=Budi
GET /api/pengaduan/?search=complaint
```

### Ordering
```
GET /api/warga/?ordering=nama_lengkap
GET /api/warga/?ordering=-tanggal_registrasi  # Descending
```

### Pagination
```
GET /api/warga/?page=1
GET /api/warga/?page=2
```
**Page Size:** 3 items per page (configurable in settings)

---

## 📊 Response Formats

### Successful Response
```
Status: 200 OK
Content-Type: application/json

{
  "id": 1,
  "nik": "3201011234567890",
  "nama_lengkap": "Budi Santoso",
  "alamat": "Jl. Merdeka No. 10",
  "no_telepon": "081234567890",
  "tanggal_registrasi": "2025-01-01T10:00:00Z"
}
```

### Error Response - Unauthorized
```
Status: 401 Unauthorized

{
  "detail": "Authentication credentials were not provided."
}
```

### Error Response - Forbidden
```
Status: 403 Forbidden

{
  "detail": "You do not have permission to perform this action."
}
```

### Error Response - Not Found
```
Status: 404 Not Found

{
  "detail": "Not found."
}
```

### Error Response - Bad Request
```
Status: 400 Bad Request

{
  "nik": ["This field may not be blank."],
  "nama_lengkap": ["This field is required."]
}
```

---

## 🧪 Testing with Postman

### Step 1: Import Collection
1. Open Postman
2. Create new collection: "Kelurahan API"
3. Add requests for each endpoint

### Step 2: Set Variables
- Base URL: `{{base_url}}` = `http://127.0.0.1:8000`
- Token: `{{token}}` = `31aff164c2a680575c19848017db323182020fc9`

### Step 3: Get Token
```
POST {{base_url}}/api/auth/token/
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

### Step 4: Test Endpoints
Set header: `Authorization: Token {{token}}`

---

## 🔄 Request/Response Workflow

```
1. User sends request to API
   ↓
2. Django receives request
   ↓
3. Check authentication (if required)
   ↓
4. Check permissions (IsAuthenticatedOrReadOnly for Warga, IsAdminUser for Pengaduan)
   ↓
5. Serialize/deserialize data
   ↓
6. Perform database operation
   ↓
7. Return response (200, 201, 400, 401, 403, 404, etc.)
```

---

## 🛡️ Security Notes

- ✅ Token authentication is required for write operations
- ✅ Public read access for Warga list (IsAuthenticatedOrReadOnly)
- ✅ Admin-only access for Pengaduan
- ✅ CORS enabled for all origins (development only)
- ⚠️ **For production:** Restrict CORS, use HTTPS, keep tokens secure

---

## 📱 Example Frontend Integration

```javascript
const API_URL = 'http://127.0.0.1:8000/api/warga/';
const AUTH_TOKEN = '31aff164c2a680575c19848017db323182020fc9';

// GET request (no auth required)
fetch(API_URL)
  .then(response => response.json())
  .then(data => console.log(data));

// POST request (auth required)
fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${AUTH_TOKEN}`
  },
  body: JSON.stringify({
    nik: '3201061234567895',
    nama_lengkap: 'Test User',
    alamat: 'Jl. Test',
    no_telepon: '081234567890'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Add token in Authorization header |
| 403 Forbidden | User doesn't have permission (check IsAdminUser) |
| CORS Error | Check CORS_ALLOW_ALL_ORIGINS setting |
| 404 Not Found | Check API endpoint URL and resource ID |
| 400 Bad Request | Validate required fields in request body |

---

## 📖 Configuration Details

**File:** `data_kelurahan/settings.py`

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 3,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'API Aplikasi Warga Kelurahan',
    'DESCRIPTION': 'Dokumentasi API untuk mengelola data warga dan pengaduan.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
```

---

## 📚 Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [drf-spectacular Documentation](https://drf-spectacular.readthedocs.io/)
- [OpenAPI Specification](https://spec.openapis.org/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

**Last Updated:** January 8, 2026  
**API Version:** 1.0.0
