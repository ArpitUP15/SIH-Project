# MindEase Backend API Documentation

## OAuth 2.0 Authentication System

Your Django backend now uses **OAuth 2.0** authentication, which is the industry standard for secure API authentication. Here's how to use it:

### Base URL
```
http://localhost:8000/api/
```

### OAuth 2.0 Endpoints
```
http://localhost:8000/o/authorize/     # Authorization endpoint
http://localhost:8000/o/token/         # Token endpoint
http://localhost:8000/o/revoke_token/ # Token revocation endpoint
```

## Authentication Flow

### 1. User Registration
**POST** `/auth/register/`

Register a new user account.

**Request Body:**
```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "is_counselor": false
}
```

**Response:**
```json
{
    "message": "User created successfully. Please login to get access token.",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "is_counselor": false,
        "date_joined": "2024-01-15T10:30:00Z"
    }
}
```

### 2. OAuth 2.0 Login (Password Grant)
**POST** `/o/token/`

Get access token using username and password.

**Request Body:**
```
grant_type=password&username=johndoe&password=securepassword123&client_id=<client_id>&client_secret=<client_secret>
```

**Response:**
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": "read write",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 3. Token Refresh
**POST** `/o/token/`

Get a new access token using the refresh token.

**Request Body:**
```
grant_type=refresh_token&refresh_token=<refresh_token>&client_id=<client_id>&client_secret=<client_secret>
```

**Response:**
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": "read write"
}
```

### 4. Token Revocation
**POST** `/o/revoke_token/`

Revoke (logout) the access token.

**Request Body:**
```
token=<access_token>&client_id=<client_id>&client_secret=<client_secret>
```

**Response:**
```json
{
    "message": "Token revoked successfully"
}
```

### 5. Get User Profile
**GET** `/auth/profile/`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_counselor": false,
    "date_joined": "2024-01-15T10:30:00Z"
}
```

### 6. Update User Profile
**PUT/PATCH** `/auth/profile/update/`

Update current user's profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (PATCH - partial update):**
```json
{
    "first_name": "Johnny",
    "email": "johnny@example.com"
}
```

**Response:**
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "johnny@example.com",
    "first_name": "Johnny",
    "last_name": "Doe",
    "is_counselor": false,
    "date_joined": "2024-01-15T10:30:00Z"
}
```

## OAuth 2.0 Client Setup

Before using the API, you need to create an OAuth 2.0 application:

### 1. Create OAuth Application
Go to Django Admin (`http://localhost:8000/admin/`) and create an OAuth2 Provider Application:

1. Navigate to **OAuth2 Provider > Applications**
2. Click **Add Application**
3. Fill in the details:
   - **Name**: Your app name (e.g., "MindEase Mobile App")
   - **Client Type**: Confidential
   - **Authorization Grant Type**: Password
   - **Client ID**: Auto-generated
   - **Client Secret**: Auto-generated

### 2. Using the Client Credentials
Once created, you'll get:
- **Client ID**: Use this in token requests
- **Client Secret**: Use this in token requests

### Example Client Setup:
```python
# In Django Admin or via shell
from oauth2_provider.models import Application

app = Application.objects.create(
    name="MindEase App",
    client_type=Application.CLIENT_CONFIDENTIAL,
    authorization_grant_type=Application.GRANT_PASSWORD,
)
print(f"Client ID: {app.client_id}")
print(f"Client Secret: {app.client_secret}")
```

## User Management Endpoints

### 7. Get All Counselors
**GET** `/counselors/`

Get list of all counselors (available to all authenticated users).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
    {
        "id": 2,
        "username": "counselor1",
        "email": "counselor1@example.com",
        "first_name": "Dr. Jane",
        "last_name": "Smith",
        "is_counselor": true,
        "date_joined": "2024-01-10T09:00:00Z"
    }
]
```

### 8. Get All Students
**GET** `/students/`

Get list of all students (only available to counselors).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
    {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "is_counselor": false,
        "date_joined": "2024-01-15T10:30:00Z"
    }
]
```

## Session Management Endpoints

### 9. Get/Create Sessions
**GET/POST** `/sessions/`

- **GET**: Retrieve sessions (students see their sessions, counselors see sessions assigned to them)
- **POST**: Create a new session (students can create sessions, counselors are auto-assigned)

**Headers:**
```
Authorization: Bearer <access_token>
```

**POST Request Body:**
```json
{
    "counselor": 2,
    "scheduled_time": "2024-01-20T14:00:00Z"
}
```

**Response:**
```json
{
    "id": 1,
    "student": 1,
    "counselor": 2,
    "student_name": "johndoe",
    "counselor_name": "counselor1",
    "scheduled_time": "2024-01-20T14:00:00Z",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
}
```

### 10. Session Detail
**GET/PUT/PATCH/DELETE** `/sessions/<id>/`

Manage individual sessions.

**Headers:**
```
Authorization: Bearer <access_token>
```

## Resource Endpoints

### 11. Get/Create Resources
**GET/POST** `/resources/`

Manage educational resources.

**Headers:**
```
Authorization: Bearer <access_token>
```

**POST Request Body:**
```json
{
    "title": "Stress Management Techniques",
    "description": "A comprehensive guide to managing stress",
    "url": "https://example.com/stress-management"
}
```

## Feedback Endpoints

### 12. Get/Create Feedback
**GET/POST** `/feedbacks/`

Manage session feedback.

**Headers:**
```
Authorization: Bearer <access_token>
```

**POST Request Body:**
```json
{
    "session": 1,
    "rating": 5,
    "comments": "Great session, very helpful!"
}
```

## OAuth 2.0 Authentication Flow

1. **Create OAuth Application** in Django Admin
2. **Register** a new user account
3. **Login** using OAuth2 Password Grant to get access and refresh tokens
4. Use the **access token** in the Authorization header for protected endpoints
5. When the access token expires, use the **refresh token** to get a new access token
6. **Logout** by revoking the access token

## OAuth 2.0 Advantages

✅ **Industry Standard**: Widely adopted authentication protocol
✅ **Secure**: Multiple grant types for different use cases
✅ **Scalable**: Works with microservices and distributed systems
✅ **Flexible**: Supports different client types (web, mobile, desktop)
✅ **Token Scopes**: Fine-grained permission control
✅ **Token Revocation**: Secure logout mechanism

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Running the Server

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

4. Start the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## Testing the API

You can test the API using:
- **Postman** - Import the endpoints and test with different scenarios
- **curl** - Command line testing
- **Frontend application** - Integrate with your React/Vue/Angular app

## Frontend Integration Example

```javascript
// OAuth2 Password Grant Login
const login = async (username, password) => {
  const formData = new FormData();
  formData.append('grant_type', 'password');
  formData.append('username', username);
  formData.append('password', password);
  formData.append('client_id', 'YOUR_CLIENT_ID');
  formData.append('client_secret', 'YOUR_CLIENT_SECRET');

  const response = await fetch('/o/token/', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
};

// Making authenticated requests
const getProfile = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/auth/profile/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

## Security Notes

- Access tokens expire after 1 hour (3600 seconds)
- Refresh tokens expire after 7 days (604800 seconds)
- Tokens are automatically rotated on refresh
- CORS is configured for development (allow all origins)
- Password validation is enforced
- All endpoints require authentication except registration
- OAuth2 provides additional security through client credentials
