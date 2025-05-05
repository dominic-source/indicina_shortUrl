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

Before starting the application, ensure you have a `.env` file in the root directory with the following variables:

```properties
PORT="4000"
BASE_URL="http://localhost:4000"
```

- `PORT`: The port on which the application will run.
- `BASE_URL`: The base URL used for generating short URLs.

---

## Running the Application

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up the `.env` file as described above.

3. Start the application in development mode:
   ```bash
   pnpm run start:dev
   ```

---

## Running Tests

This project includes end-to-end (e2e) tests to ensure the API behaves as expected.

### Running All Tests

To run all tests, use the following command:

```bash
pnpm run test
```

### Running End-to-End (e2e) Tests

To specifically run the e2e tests, use:

```bash
pnpm run test:e2e
```

### Test File Structure

- **Location:** `/test/api.e2e-spec.ts`
- **Description:** Contains e2e tests for all API endpoints, including encoding, decoding, and statistics retrieval.

### Writing New Tests

To add new tests:
1. Create or modify test files in the `/test` directory.
2. Use the `supertest` library to simulate HTTP requests.
3. Follow the existing test structure for consistency.

### Example Test Output

When running the tests, you should see output similar to:

```bash
 PASS  test/api.e2e-spec.ts
  API Endpoints (e2e)
    POST /api/encode
      ✓ should encode a long URL and return a shorter one (50ms)
      ✓ should return the same short URL for the same long URL (30ms)
      ✓ should return validation error for invalid URLs (20ms)
      ✓ should return validation error for empty URL (15ms)
    POST /api/decode
      ✓ should decode a short URL back to the original long URL (40ms)
      ✓ should return 400 for non-existent short URLs (25ms)
      ✓ should return validation error for invalid short URLs (20ms)
    GET /api/statistic/:urlPath
      ✓ should return statistics for a valid URL path (35ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        1.5s
```

---