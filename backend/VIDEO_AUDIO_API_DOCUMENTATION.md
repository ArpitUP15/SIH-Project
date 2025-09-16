# Video and Audio API Documentation

This document describes the API endpoints for managing video and audio content in the MindEase backend.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
All endpoints require authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Video Endpoints

### 1. List All Videos
**GET** `/videos/`

Returns a list of all videos with optional filtering.

**Query Parameters:**
- `tags` (optional): Comma-separated list of tags to filter by
  - Example: `?tags=mental health,meditation`

**Response:**
```json
[
  {
    "id": 1,
    "title": "What Is Mental Health And How Can I Improve It? | headspace",
    "link": "https://www.youtube.com/watch?v=gtUGVzEUy5A",
    "thumbnail": "https://img.youtube.com/vi/gtUGVzEUy5A/0.jpg",
    "description": "Learn what mental health really means and discover simple ways to improve your well-being every day",
    "duration": "04:07",
    "tags": ["mental health", "self care", "mindfulness", "healthy mind"],
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

### 2. Get Single Video
**GET** `/videos/{id}/`

Returns details of a specific video.

**Response:**
```json
{
  "id": 1,
  "title": "What Is Mental Health And How Can I Improve It? | headspace",
  "link": "https://www.youtube.com/watch?v=gtUGVzEUy5A",
  "thumbnail": "https://img.youtube.com/vi/gtUGVzEUy5A/0.jpg",
  "description": "Learn what mental health really means and discover simple ways to improve your well-being every day",
  "duration": "04:07",
  "tags": ["mental health", "self care", "mindfulness", "healthy mind"],
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

### 3. Create New Video
**POST** `/videos/`

Creates a new video entry.

**Request Body:**
```json
{
  "title": "New Video Title",
  "link": "https://www.youtube.com/watch?v=example",
  "thumbnail": "https://img.youtube.com/vi/example/0.jpg",
  "description": "Video description",
  "duration": "05:30",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### 4. Update Video
**PUT/PATCH** `/videos/{id}/`

Updates an existing video.

**Request Body:** (same as create)

### 5. Delete Video
**DELETE** `/videos/{id}/`

Deletes a video.

### 6. Search Videos
**GET** `/videos/search/`

Search videos by title or description.

**Query Parameters:**
- `q` (required): Search query string

**Example:** `/videos/search/?q=mental health`

## Audio Endpoints

### 1. List All Audios
**GET** `/audios/`

Returns a list of all audio content with optional filtering.

**Query Parameters:**
- `tags` (optional): Comma-separated list of tags to filter by

**Response:** (same format as videos)

### 2. Get Single Audio
**GET** `/audios/{id}/`

Returns details of a specific audio.

### 3. Create New Audio
**POST** `/audios/`

Creates a new audio entry.

**Request Body:**
```json
{
  "title": "New Audio Title",
  "link": "https://example.com/audio.mp3",
  "thumbnail": "https://example.com/thumbnail.jpg", // optional
  "description": "Audio description",
  "duration": "10:15",
  "tags": ["tag1", "tag2"]
}
```

### 4. Update Audio
**PUT/PATCH** `/audios/{id}/`

Updates an existing audio.

### 5. Delete Audio
**DELETE** `/audios/{id}/`

Deletes an audio.

### 6. Search Audios
**GET** `/audios/search/`

Search audios by title or description.

**Query Parameters:**
- `q` (required): Search query string

## Example Frontend Usage

### Fetching Videos
```javascript
// Get all videos
const response = await fetch('/api/videos/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
const videos = await response.json();

// Filter by tags
const meditationVideos = await fetch('/api/videos/?tags=meditation,mindfulness', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

// Search videos
const searchResults = await fetch('/api/videos/search/?q=anxiety', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### Adding New Content
```javascript
// Add new video
const newVideo = await fetch('/api/videos/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "New Video Title",
    link: "https://www.youtube.com/watch?v=example",
    thumbnail: "https://img.youtube.com/vi/example/0.jpg",
    description: "Video description",
    duration: "05:30",
    tags: ["mental health", "wellness"]
  })
});
```

## Data Models

### Video Model
- `id`: Auto-generated primary key
- `title`: Video title (max 300 characters)
- `link`: YouTube or video URL
- `thumbnail`: Thumbnail image URL
- `description`: Video description
- `duration`: Duration in "MM:SS" format
- `tags`: Array of strings for categorization
- `created_at`: Timestamp when created
- `updated_at`: Timestamp when last updated

### Audio Model
- `id`: Auto-generated primary key
- `title`: Audio title (max 300 characters)
- `link`: Audio file URL
- `thumbnail`: Thumbnail image URL (optional)
- `description`: Audio description
- `duration`: Duration in "MM:SS" format
- `tags`: Array of strings for categorization
- `created_at`: Timestamp when created
- `updated_at`: Timestamp when last updated

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Notes

1. All endpoints require authentication with a valid access token
2. Tags are stored as JSON arrays and can be filtered using comma-separated values
3. Duration should be in "MM:SS" format
4. The API supports both YouTube links and direct media file URLs
5. Thumbnails are optional for audio content but recommended for better UX
