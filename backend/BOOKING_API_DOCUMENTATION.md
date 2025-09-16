# MindEase Booking System API Documentation

## Overview
This document describes the counseling booking system API endpoints. All endpoints require OAuth 2.0 authentication.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
All endpoints require a valid OAuth 2.0 access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Models

### Counselor
- **id**: Auto-generated primary key
- **name**: Counselor's full name
- **email**: Unique email address
- **specialization**: Area of expertise
- **user**: One-to-one relationship with User model
- **created_at**: Timestamp when counselor was created

### Booking
- **id**: Auto-generated primary key
- **student**: Foreign key to User (student who made the booking)
- **counselor**: Foreign key to Counselor
- **date**: Date of the appointment
- **time**: Time of the appointment
- **status**: Booking status (pending, confirmed, cancelled, completed)
- **notes**: Optional notes about the booking
- **created_at**: Timestamp when booking was created
- **updated_at**: Timestamp when booking was last updated

## API Endpoints

### 1. List All Counselors
**GET** `/counselors/`

Returns a list of all available counselors.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "Dr. Jane Smith",
        "email": "jane.smith@example.com",
        "specialization": "Anxiety and Depression",
        "created_at": "2024-01-15T10:30:00Z"
    },
    {
        "id": 2,
        "name": "Dr. John Doe",
        "email": "john.doe@example.com",
        "specialization": "Relationship Counseling",
        "created_at": "2024-01-16T09:15:00Z"
    }
]
```

### 2. Create a Booking
**POST** `/bookings/`

Create a new booking. Only authenticated students can create bookings.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "counselor": 1,
    "date": "2024-01-25",
    "time": "14:00:00",
    "notes": "First session, need help with anxiety"
}
```

**Response (Success):**
```json
{
    "id": 1,
    "student": 5,
    "counselor": 1,
    "student_name": "student_user",
    "counselor_name": "Dr. Jane Smith",
    "counselor_specialization": "Anxiety and Depression",
    "date": "2024-01-25",
    "time": "14:00:00",
    "status": "pending",
    "notes": "First session, need help with anxiety",
    "created_at": "2024-01-20T10:30:00Z",
    "updated_at": "2024-01-20T10:30:00Z"
}
```

**Response (Error - Double Booking):**
```json
{
    "non_field_errors": [
        "Counselor Dr. Jane Smith is already booked at 14:00:00 on 2024-01-25"
    ]
}
```

**Response (Error - Past Date):**
```json
{
    "non_field_errors": [
        "Cannot book appointments in the past"
    ]
}
```

### 3. List User's Bookings
**GET** `/bookings/`

Returns bookings for the authenticated user:
- Students see their own bookings
- Counselors see bookings assigned to them

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
    {
        "id": 1,
        "student": 5,
        "counselor": 1,
        "student_name": "student_user",
        "counselor_name": "Dr. Jane Smith",
        "counselor_specialization": "Anxiety and Depression",
        "date": "2024-01-25",
        "time": "14:00:00",
        "status": "pending",
        "notes": "First session, need help with anxiety",
        "created_at": "2024-01-20T10:30:00Z",
        "updated_at": "2024-01-20T10:30:00Z"
    }
]
```

### 4. Get Booking Details
**GET** `/bookings/{id}/`

Get details of a specific booking.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "id": 1,
    "student": 5,
    "counselor": 1,
    "student_name": "student_user",
    "counselor_name": "Dr. Jane Smith",
    "counselor_specialization": "Anxiety and Depression",
    "date": "2024-01-25",
    "time": "14:00:00",
    "status": "pending",
    "notes": "First session, need help with anxiety",
    "created_at": "2024-01-20T10:30:00Z",
    "updated_at": "2024-01-20T10:30:00Z"
}
```

### 5. Update Booking
**PUT/PATCH** `/bookings/{id}/`

Update a booking. Permissions vary by user type:
- **Students**: Can update notes and cancel bookings
- **Counselors**: Can update status and notes

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body (Student - Cancel Booking):**
```json
{
    "status": "cancelled",
    "notes": "Need to reschedule"
}
```

**Request Body (Counselor - Confirm Booking):**
```json
{
    "status": "confirmed",
    "notes": "Session confirmed, please arrive 10 minutes early"
}
```

**Response:**
```json
{
    "id": 1,
    "student": 5,
    "counselor": 1,
    "student_name": "student_user",
    "counselor_name": "Dr. Jane Smith",
    "counselor_specialization": "Anxiety and Depression",
    "date": "2024-01-25",
    "time": "14:00:00",
    "status": "confirmed",
    "notes": "Session confirmed, please arrive 10 minutes early",
    "created_at": "2024-01-20T10:30:00Z",
    "updated_at": "2024-01-20T11:15:00Z"
}
```

### 6. Cancel Booking
**POST** `/bookings/{id}/cancel/`

Cancel a booking (students only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "id": 1,
    "student": 5,
    "counselor": 1,
    "student_name": "student_user",
    "counselor_name": "Dr. Jane Smith",
    "counselor_specialization": "Anxiety and Depression",
    "date": "2024-01-25",
    "time": "14:00:00",
    "status": "cancelled",
    "notes": "First session, need help with anxiety",
    "created_at": "2024-01-20T10:30:00Z",
    "updated_at": "2024-01-20T11:30:00Z"
}
```

### 7. Confirm Booking
**POST** `/bookings/{id}/confirm/`

Confirm a booking (counselors only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "id": 1,
    "student": 5,
    "counselor": 1,
    "student_name": "student_user",
    "counselor_name": "Dr. Jane Smith",
    "counselor_specialization": "Anxiety and Depression",
    "date": "2024-01-25",
    "time": "14:00:00",
    "status": "confirmed",
    "notes": "First session, need help with anxiety",
    "created_at": "2024-01-20T10:30:00Z",
    "updated_at": "2024-01-20T11:45:00Z"
}
```

### 8. Delete Booking
**DELETE** `/bookings/{id}/`

Delete a booking (students can only delete their own bookings).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```
HTTP 204 No Content
```

## Business Logic

### Double Booking Prevention
- The system prevents double booking by checking for existing bookings with the same counselor, date, and time
- Only bookings with status 'pending' or 'confirmed' are considered for double booking checks
- Validation occurs at the model level using Django's `clean()` method

### Permission System
- **Students**: Can create bookings, view their own bookings, update notes, and cancel bookings
- **Counselors**: Can view bookings assigned to them, update status and notes, confirm bookings
- **Authentication**: All endpoints require valid OAuth 2.0 access token

### Status Flow
1. **pending**: Initial status when booking is created
2. **confirmed**: Counselor confirms the booking
3. **cancelled**: Booking is cancelled (by student or counselor)
4. **completed**: Session has been completed

## Error Responses

### 400 Bad Request
```json
{
    "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "error": "You can only update your own bookings"
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

## Example Usage

### Frontend Integration Example

```javascript
// Get access token (OAuth2)
const getAccessToken = async () => {
    const formData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('username', 'student_user');
    formData.append('password', 'password123');
    formData.append('client_id', 'YOUR_CLIENT_ID');
    formData.append('client_secret', 'YOUR_CLIENT_SECRET');

    const response = await fetch('/o/token/', {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    return data.access_token;
};

// List counselors
const getCounselors = async () => {
    const token = await getAccessToken();
    const response = await fetch('/api/counselors/', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

// Create booking
const createBooking = async (counselorId, date, time, notes) => {
    const token = await getAccessToken();
    const response = await fetch('/api/bookings/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            counselor: counselorId,
            date: date,
            time: time,
            notes: notes
        })
    });
    return response.json();
};

// Cancel booking
const cancelBooking = async (bookingId) => {
    const token = await getAccessToken();
    const response = await fetch(`/api/bookings/${bookingId}/cancel/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};
```

## Setup Instructions

1. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Create counselors:**
   ```bash
   python manage.py shell
   ```
   ```python
   from core.models import User, Counselor
   
   # Create counselor user
   counselor_user = User.objects.create_user(
       username='counselor1',
       email='counselor1@example.com',
       password='password123',
       is_counselor=True
   )
   
   # Create counselor profile
   counselor = Counselor.objects.create(
       name='Dr. Jane Smith',
       email='jane.smith@example.com',
       specialization='Anxiety and Depression',
       user=counselor_user
   )
   ```

3. **Start the server:**
   ```bash
   python manage.py runserver
   ```

The booking system is now ready to use! 🚀
