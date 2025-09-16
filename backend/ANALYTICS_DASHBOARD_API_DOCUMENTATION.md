# Analytics Dashboard API Documentation

This document describes the Analytics Dashboard API endpoints for the MindEase backend. These endpoints are **counselor-only** and provide comprehensive analytics and insights for counseling sessions and student progress.

## Base URL
```
http://localhost:8000/api/
```

## Authentication & Authorization
All endpoints require:
1. **Authentication**: Valid OAuth2 access token
2. **Authorization**: User must have `counselor` role

**Headers:**
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Access Control:**
- ✅ **Counselors**: Full access to all analytics endpoints
- ❌ **Students**: 403 Forbidden
- ❌ **Unauthenticated**: 401 Unauthorized

## Analytics Dashboard Endpoints

### 1. Key Metrics
**GET** `/metrics/`

Returns key performance indicators for the counseling center.

**Response:**
```json
{
  "total_students": 20,
  "avg_improvement": 1.25,
  "session_completion_percentage": 75.5,
  "active_counselors": 4
}
```

**Metrics Explained:**
- `total_students`: Total number of enrolled students
- `avg_improvement`: Average improvement score across all students
- `session_completion_percentage`: Percentage of sessions marked as completed
- `active_counselors`: Number of counselors with sessions in the last 30 days

---

### 2. Performance Trends
**GET** `/performance-trends/`

Returns average pre vs. post counseling scores over the last 12 months.

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "avg_pre_score": 2.5,
    "avg_post_score": 3.8,
    "improvement": 1.3
  },
  {
    "date": "2024-02-01",
    "avg_pre_score": 2.7,
    "avg_post_score": 4.1,
    "improvement": 1.4
  }
]
```

**Trends Explained:**
- `date`: Month start date
- `avg_pre_score`: Average pre-counseling score for that month
- `avg_post_score`: Average post-counseling score for that month
- `improvement`: Difference between post and pre scores

---

### 3. Session Impact Analysis
**GET** `/session-impact/`

Returns improvement scores grouped by counseling type.

**Response:**
```json
[
  {
    "counseling_type": "Academic",
    "avg_improvement": 1.2,
    "total_sessions": 15,
    "completed_sessions": 12
  },
  {
    "counseling_type": "Emotional",
    "avg_improvement": 1.5,
    "total_sessions": 20,
    "completed_sessions": 18
  },
  {
    "counseling_type": "Career",
    "avg_improvement": 1.1,
    "total_sessions": 10,
    "completed_sessions": 8
  },
  {
    "counseling_type": "Social",
    "avg_improvement": 1.3,
    "total_sessions": 12,
    "completed_sessions": 10
  }
]
```

**Impact Analysis Explained:**
- `counseling_type`: Type of counseling (Academic, Emotional, Career, Social)
- `avg_improvement`: Average improvement score for this counseling type
- `total_sessions`: Total number of sessions for this type
- `completed_sessions`: Number of completed sessions for this type

---

### 4. Students Analytics
**GET** `/students/`

Returns detailed list of students with improvement data and session statistics.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Student 1",
    "enrollment_date": "2024-01-15",
    "counseling_type": "academic",
    "improvement_score": 1.25,
    "pre_counseling_score": 2.5,
    "post_counseling_score": 3.75,
    "total_sessions": 5,
    "completed_sessions": 4,
    "avg_improvement": 1.2,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

**Student Analytics Explained:**
- `improvement_score`: Overall improvement (post - pre score)
- `total_sessions`: Total number of sessions attended
- `completed_sessions`: Number of completed sessions
- `avg_improvement`: Average improvement per session

---

### 5. Upcoming Sessions
**GET** `/sessions/upcoming/`

Returns list of upcoming counseling sessions for the next 30 days.

**Response:**
```json
[
  {
    "id": 1,
    "student": 1,
    "counselor": 1,
    "student_name": "Student 1",
    "counselor_name": "Dr. Jane Smith",
    "counselor_specialization": "Academic Counseling",
    "session_type": "academic",
    "date": "2024-02-15",
    "time": "10:00:00",
    "status": "scheduled",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

**Upcoming Sessions Explained:**
- Sessions are ordered by date and time
- Only includes sessions with `status: "scheduled"`
- Shows counselor specialization for better context

---

## Student Management Endpoints

### 6. Student CRUD Operations
**GET** `/students/` - List all students
**POST** `/students/` - Create new student
**GET** `/students/{id}/` - Get specific student
**PUT/PATCH** `/students/{id}/` - Update student
**DELETE** `/students/{id}/` - Delete student

**Student Creation Example:**
```json
POST /students/
{
  "name": "John Doe",
  "enrollment_date": "2024-01-15",
  "counseling_type": "academic",
  "pre_counseling_score": 2.5,
  "post_counseling_score": 3.8
}
```

---

### 7. Session Management Endpoints
**GET** `/sessions/` - List all sessions
**POST** `/sessions/` - Create new session
**GET** `/sessions/{id}/` - Get specific session
**PUT/PATCH** `/sessions/{id}/` - Update session
**DELETE** `/sessions/{id}/` - Delete session

**Session Creation Example:**
```json
POST /sessions/
{
  "student": 1,
  "counselor": 1,
  "session_type": "academic",
  "date": "2024-02-15",
  "time": "10:00:00",
  "improvement_score": 1.2,
  "notes": "Focused on study strategies",
  "status": "scheduled"
}
```

---

## Data Models

### Student Model
```json
{
  "id": "Auto-generated primary key",
  "name": "Student full name",
  "enrollment_date": "Date when student enrolled (YYYY-MM-DD)",
  "counseling_type": "academic|emotional|career|social",
  "improvement_score": "Calculated improvement (post - pre)",
  "pre_counseling_score": "Score before counseling (1.0-5.0)",
  "post_counseling_score": "Score after counseling (1.0-5.0)",
  "user": "Optional link to User model",
  "created_at": "Timestamp when created",
  "updated_at": "Timestamp when last updated"
}
```

### Session Model
```json
{
  "id": "Auto-generated primary key",
  "student": "Foreign key to Student",
  "counselor": "Foreign key to Counselor",
  "session_type": "academic|emotional|career|social",
  "date": "Session date (YYYY-MM-DD)",
  "time": "Session time (HH:MM:SS)",
  "improvement_score": "Improvement score for this session",
  "notes": "Session notes and observations",
  "status": "scheduled|completed|cancelled",
  "created_at": "Timestamp when created",
  "updated_at": "Timestamp when last updated"
}
```

### User Model (Updated)
```json
{
  "id": "Auto-generated primary key",
  "username": "Unique username",
  "email": "User email address",
  "first_name": "User first name",
  "last_name": "User last name",
  "role": "student|counselor",
  "is_counselor": "Boolean derived from role",
  "date_joined": "Account creation timestamp"
}
```

---

## Error Responses

### 403 Forbidden (Student Access)
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 400 Bad Request
```json
{
  "field_name": ["This field is required."],
  "non_field_errors": ["General validation error message"]
}
```

---

## Frontend Integration Examples

### Fetching Dashboard Metrics
```javascript
const fetchMetrics = async () => {
  try {
    const response = await fetch('/api/metrics/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const metrics = await response.json();
      console.log('Dashboard Metrics:', metrics);
      return metrics;
    } else if (response.status === 403) {
      console.error('Access denied: Only counselors can view analytics');
    }
  } catch (error) {
    console.error('Error fetching metrics:', error);
  }
};
```

### Creating a New Student
```javascript
const createStudent = async (studentData) => {
  try {
    const response = await fetch('/api/students/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    });
    
    if (response.ok) {
      const newStudent = await response.json();
      console.log('Student created:', newStudent);
      return newStudent;
    }
  } catch (error) {
    console.error('Error creating student:', error);
  }
};
```

### Scheduling a Session
```javascript
const scheduleSession = async (sessionData) => {
  try {
    const response = await fetch('/api/sessions/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionData)
    });
    
    if (response.ok) {
      const newSession = await response.json();
      console.log('Session scheduled:', newSession);
      return newSession;
    }
  } catch (error) {
    console.error('Error scheduling session:', error);
  }
};
```

---

## Testing the API

### Using cURL Examples

**Get Metrics (Counselor):**
```bash
curl -X GET "http://localhost:8000/api/metrics/" \
  -H "Authorization: Bearer YOUR_COUNSELOR_TOKEN" \
  -H "Content-Type: application/json"
```

**Create Student (Counselor):**
```bash
curl -X POST "http://localhost:8000/api/students/" \
  -H "Authorization: Bearer YOUR_COUNSELOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "enrollment_date": "2024-01-15",
    "counseling_type": "academic",
    "pre_counseling_score": 2.5,
    "post_counseling_score": 3.8
  }'
```

**Test Student Access (Should Fail):**
```bash
curl -X GET "http://localhost:8000/api/metrics/" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json"
# Expected: 403 Forbidden
```

---

## Notes

1. **Role-Based Access**: All analytics endpoints are restricted to counselors only
2. **Automatic Calculations**: Improvement scores are automatically calculated when pre/post scores are provided
3. **Data Integrity**: Sessions are linked to both students and counselors for comprehensive tracking
4. **Time-based Analytics**: Performance trends are calculated over rolling 12-month periods
5. **Real-time Updates**: All metrics are calculated in real-time from current database data
6. **Scalable Design**: The API is designed to handle large numbers of students and sessions efficiently

## Dummy Data

The system includes a management command to populate dummy data for testing:

```bash
python manage.py populate_dummy_data --students=20 --counselors=5 --sessions=50
```

This creates realistic test data including:
- 5 counselors with different specializations
- 20 students with various counseling types
- 50 sessions with mixed statuses (scheduled, completed, cancelled)
- Realistic improvement scores and session data
