# URL Shortener API & Application Documentation

## Overview

This application provides a simple URL shortening service with statistics tracking.  
It is built with [NestJS](https://nestjs.com/) and exposes a RESTful API for encoding, decoding, and managing short URLs.

---

## API Endpoints

All endpoints are prefixed with `/api`.

### **POST** `/api/encode`

**Description:**  
Shortens a given long URL.

**Request Body:**
```json
{
  "longUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortUrl": "http://your-base-url/abc123"
}
```

---

### **POST** `/api/decode`

**Description:**  
Retrieves the original long URL from a short URL.

**Request Body:**
```json
{
  "shortUrl": "http://your-base-url/abc123"
}
```

**Response:**
```json
"https://example.com/very/long/url"
```

**Error Response:**
- Returns HTTP 400 with message `"URL not found"` if the short URL does not exist.

---

### **GET** `/api/statistic/:urlPath`

**Description:**  
Fetches statistics for a given short URL.

**Parameters:**
- `urlPath`: The unique path segment of the short URL (e.g., `abc123`).

**Response:**
```json
{
  "longUrl": "https://example.com/very/long/url",
  "visits": "5",
  "lastVisited": "6/7/2024, 10:00:00 AM",
  "createdAt": "6/6/2024, 9:00:00 AM",
  "shortUrl": "http://your-base-url/abc123"
}
```

---

### **GET** `/api/list`

**Description:**  
Lists all shortened URLs and their statistics.

**Response:**
```json
[
  {
    "shortUrl": "http://your-base-url/abc123",
    "longUrl": "https://example.com/very/long/url",
    "createdAt": "6/6/2024, 9:00:00 AM",
    "visits": "5",
    "lastVisited": "6/7/2024, 10:00:00 AM"
  }
  // ...more entries
]
```

---

### **Redirection**

To use a short URL, simply visit it in your browser.  
The service will redirect you to the original long URL and increment the visit count.

---

## Application Structure

- **src/api/**: Contains the API controller, service, DTOs, and related logic.
- **src/app.service.ts**: Handles application-level logic, such as URL prefixing and redirection.
- **src/app.module.ts**: Main application module.
- **src/api/api.service.ts**: Core URL shortening and statistics logic.

---

## Error Handling

- Invalid or non-existent short URLs will return a 400 error with a descriptive message.
- All endpoints validate input and may return validation errors.

---

## Environment Variables

- `BASE_URL`: The base URL used for generating short URLs (e.g., `http://localhost:4000/`).

---

## Running the Application

```bash
pnpm install
pnpm run start:dev
```

---

## License

MIT