# Landlord Backend API Documentation

## Base URL
```
http://localhost:5000/api/landlord
```

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. PROFILE ENDPOINTS

### Get Landlord Profile
- **GET** `/profile`
- **Description**: Retrieve the current landlord's profile information
- **Response**:
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "avatarUrl": "/uploads/avatar.jpg",
    "isActive": true,
    "isBanned": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Landlord Profile
- **PUT** `/profile`
- **Body**:
```json
{
  "fullName": "John Doe Updated",
  "phone": "0987654321"
}
```

### Update Avatar
- **PUT** `/profile/avatar`
- **Content-Type**: `multipart/form-data`
- **Field**: `avatar` (image file)
- **Max Size**: 5MB
- **Allowed Types**: JPEG, PNG, GIF, WebP

### Change Password
- **PUT** `/profile/password`
- **Body**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

---

## 2. DASHBOARD ENDPOINTS

### Get Dashboard Statistics
- **GET** `/dashboard/statistics`
- **Description**: Get overview statistics for the landlord dashboard
- **Response**:
```json
{
  "success": true,
  "data": {
    "rooms": {
      "total": 10,
      "available": 3,
      "rented": 7
    },
    "contracts": {
      "active": 7
    },
    "payments": {
      "totalRevenue": 50000,
      "pending": 5000
    },
    "requests": {
      "pending": 2
    },
    "complaints": {
      "open": 1
    },
    "notifications": {
      "unread": 5
    }
  }
}
```

### Get Recent Activity
- **GET** `/dashboard/recent-activity?limit=10`
- **Description**: Get recent rental requests, payments, and complaints

### Get Revenue Chart Data
- **GET** `/dashboard/revenue-chart?months=12`
- **Description**: Get monthly revenue data for chart visualization

### Get Room Status Distribution
- **GET** `/dashboard/room-status`
- **Description**: Get count of rooms by status

---

## 3. ROOM MANAGEMENT ENDPOINTS

### Create Room
- **POST** `/rooms`
- **Body**:
```json
{
  "title": "Cozy Studio Apartment",
  "description": "Beautiful studio with modern amenities",
  "address": "123 Main Street",
  "city": "Ho Chi Minh City",
  "district": "District 1",
  "ward": "Ward 1",
  "pricePerMonth": 5000000,
  "areaSqm": 30,
  "roomType": "single",
  "maxOccupants": 1
}
```

### Get All Landlord Rooms
- **GET** `/rooms?status=available&page=1&limit=10`
- **Query Parameters**:
  - `status`: Filter by status (available, rented, maintenance, inactive)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

### Get Room Details
- **GET** `/rooms/:roomId`
- **Description**: Get detailed information about a specific room including images and facilities

### Update Room
- **PUT** `/rooms/:roomId`
- **Body**: Same as create room (all fields optional)

### Delete Room (Soft Delete)
- **DELETE** `/rooms/:roomId`

### Update Room Status
- **PUT** `/rooms/:roomId/status`
- **Body**:
```json
{
  "status": "available"
}
```
- **Valid Statuses**: available, rented, maintenance, inactive

---

## 4. ROOM IMAGE ENDPOINTS

### Upload Room Image
- **POST** `/rooms/:roomId/images`
- **Content-Type**: `multipart/form-data`
- **Field**: `image` (image file)
- **Max Size**: 5MB
- **Note**: First image automatically becomes primary

### Get Room Images
- **GET** `/rooms/:roomId/images`
- **Description**: Get all images for a room

### Delete Room Image
- **DELETE** `/rooms/:roomId/images/:imageId`
- **Note**: If primary image is deleted, next image becomes primary

### Set Primary Image
- **PUT** `/rooms/:roomId/images/:imageId/primary`
- **Description**: Set an image as the room's primary/thumbnail image

---

## 5. FACILITY ENDPOINTS

### Add Facility
- **POST** `/rooms/:roomId/facilities`
- **Body**:
```json
{
  "facilityName": "Air Conditioner",
  "facilityType": "appliance"
}
```
- **Facility Types**: furniture, appliance, utility, security, entertainment, other

### Get Room Facilities
- **GET** `/rooms/:roomId/facilities`

### Update Facility
- **PUT** `/rooms/:roomId/facilities/:facilityId`
- **Body**:
```json
{
  "facilityName": "Updated Name",
  "facilityType": "appliance"
}
```

### Remove Facility
- **DELETE** `/rooms/:roomId/facilities/:facilityId`

---

## 6. RENTAL REQUEST ENDPOINTS

### Get All Rental Requests
- **GET** `/rental-requests?status=pending&page=1&limit=10`
- **Query Parameters**:
  - `status`: Filter by status (pending, approved, rejected, cancelled)
  - `page`: Page number
  - `limit`: Items per page

### Get Rental Request Details
- **GET** `/rental-requests/:requestId`

### Approve Rental Request
- **PUT** `/rental-requests/:requestId/approve`
- **Description**: Approve a rental request and update room status to rented
- **Notification**: Tenant receives approval notification

### Reject Rental Request
- **PUT** `/rental-requests/:requestId/reject`
- **Body**:
```json
{
  "rejectionReason": "Already rented to another tenant"
}
```
- **Notification**: Tenant receives rejection notification with reason

---

## 7. PAYMENT ENDPOINTS

### Get All Payments
- **GET** `/payments?status=completed&paymentType=rent&page=1&limit=10`
- **Query Parameters**:
  - `status`: Filter by status (pending, completed, failed, cancelled)
  - `paymentType`: Filter by type (rent, deposit, utility, maintenance, other)
  - `page`: Page number
  - `limit`: Items per page

### Get Payment Details
- **GET** `/payments/:paymentId`

### Get Contract Payment History
- **GET** `/payments/history/:contractId`
- **Description**: Get all payments for a specific contract

### Get Payment Statistics
- **GET** `/payments/statistics?startDate=2024-01-01&endDate=2024-12-31`
- **Query Parameters**:
  - `startDate`: Start date (optional)
  - `endDate`: End date (optional)
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalRevenue": 100000,
    "pendingAmount": 10000,
    "paymentsByStatus": [...],
    "paymentsByType": [...]
  }
}
```

---

## 8. CONTRACT ENDPOINTS

### Create Contract
- **POST** `/contracts`
- **Body**:
```json
{
  "roomId": 1,
  "tenantId": 5,
  "startDate": "2024-01-01",
  "endDate": "2025-01-01",
  "monthlyRent": 5000000,
  "depositAmount": 10000000,
  "termsAndConditions": "Contract terms here..."
}
```

### Get All Contracts
- **GET** `/contracts?status=active&page=1&limit=10`
- **Query Parameters**:
  - `status`: Filter by status (active, expired, terminated, renewed)
  - `page`: Page number
  - `limit`: Items per page

### Get Contract Details
- **GET** `/contracts/:contractId`

### Update Contract
- **PUT** `/contracts/:contractId`
- **Body**:
```json
{
  "monthlyRent": 5500000,
  "depositAmount": 11000000,
  "termsAndConditions": "Updated terms...",
  "status": "active"
}
```

### Renew Contract
- **POST** `/contracts/:contractId/renew`
- **Body**:
```json
{
  "newEndDate": "2026-01-01",
  "newMonthlyRent": 5500000
}
```
- **Description**: Creates a new contract and marks original as renewed

### Terminate Contract
- **PUT** `/contracts/:contractId/terminate`
- **Description**: Terminates contract and updates room status to available

---

## 9. VIEWING SCHEDULE ENDPOINTS

### Create Viewing Schedule
- **POST** `/viewing-schedules`
- **Body**:
```json
{
  "roomId": 1,
  "tenantId": 5,
  "scheduledDate": "2024-01-15T10:00:00Z",
  "notes": "Please arrive 10 minutes early"
}
```

### Get All Viewing Schedules
- **GET** `/viewing-schedules?status=scheduled&page=1&limit=10`
- **Query Parameters**:
  - `status`: Filter by status (scheduled, completed, cancelled, no_show)
  - `page`: Page number
  - `limit`: Items per page

### Get Viewing Schedule Details
- **GET** `/viewing-schedules/:scheduleId`

### Update Viewing Schedule
- **PUT** `/viewing-schedules/:scheduleId`
- **Body**:
```json
{
  "scheduledDate": "2024-01-15T14:00:00Z",
  "status": "completed",
  "notes": "Updated notes"
}
```

### Delete Viewing Schedule
- **DELETE** `/viewing-schedules/:scheduleId`

---

## 10. COMPLAINT ENDPOINTS

### Get All Complaints
- **GET** `/complaints?status=open&priority=high&page=1&limit=10`
- **Query Parameters**:
  - `status`: Filter by status (open, in_progress, resolved, closed)
  - `priority`: Filter by priority (low, medium, high, urgent)
  - `page`: Page number
  - `limit`: Items per page

### Get Complaint Details
- **GET** `/complaints/:complaintId`

### Update Complaint Status
- **PUT** `/complaints/:complaintId/status`
- **Body**:
```json
{
  "status": "resolved",
  "resolutionNotes": "Fixed the air conditioner"
}
```
- **Valid Statuses**: open, in_progress, resolved, closed

### Update Complaint Priority
- **PUT** `/complaints/:complaintId/priority`
- **Body**:
```json
{
  "priority": "urgent"
}
```
- **Valid Priorities**: low, medium, high, urgent

---

## 11. MESSAGE/CONVERSATION ENDPOINTS

### Create or Get Conversation
- **POST** `/conversations`
- **Body**:
```json
{
  "participantId": 5,
  "roomId": 1
}
```
- **Description**: Creates new conversation or returns existing one

### Get All Conversations
- **GET** `/conversations?page=1&limit=10`
- **Description**: Get all active conversations for the user

### Get Conversation Messages
- **GET** `/conversations/:conversationId/messages?page=1&limit=50`
- **Description**: Get all messages in a conversation (marks unread as read)

### Send Message
- **POST** `/conversations/:conversationId/messages`
- **Body**:
```json
{
  "content": "Hello, I'm interested in the room"
}
```

### Close Conversation
- **PUT** `/conversations/:conversationId/close`
- **Description**: Mark conversation as inactive

---

## 12. NOTIFICATION ENDPOINTS

### Get All Notifications
- **GET** `/notifications?isRead=false&page=1&limit=20`
- **Query Parameters**:
  - `isRead`: Filter by read status (true/false)
  - `page`: Page number
  - `limit`: Items per page

### Get Unread Notification Count
- **GET** `/notifications/unread/count`
- **Response**:
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

### Mark Notification as Read
- **PUT** `/notifications/:notificationId/read`

### Mark All Notifications as Read
- **PUT** `/notifications/read-all`

### Delete Notification
- **DELETE** `/notifications/:notificationId`

### Delete All Notifications
- **DELETE** `/notifications/delete-all`

---

## Error Handling

All endpoints return error responses in the following format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (access denied)
- `404`: Not Found
- `409`: Conflict (duplicate entry)
- `500`: Internal Server Error

---

## Notification Types

The system automatically creates notifications for:
- `rental_request`: When rental request is approved/rejected
- `payment`: When payment status changes
- `complaint`: When complaint status is updated
- `message`: When new message is received
- `viewing_schedule`: When viewing schedule is created/cancelled
- `contract`: When contract is created/renewed/terminated
- `system`: System notifications

---

## File Upload Specifications

### Image Upload
- **Max Size**: 5MB
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Field Name**: `image` or `avatar`
- **Storage**: `/uploads` directory
- **URL Format**: `/uploads/{filename}`

---

## Pagination

All list endpoints support pagination with:
- `page`: Current page number (default: 1)
- `limit`: Items per page (default: 10)

Response includes:
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

## Date Format

All dates are in ISO 8601 format:
```
2024-01-15T10:30:00Z
```

---

## Role-Based Access Control

All endpoints require the user to be authenticated as a Landlord. The system validates:
- User authentication via JWT token
- User role (must be Landlord)
- Resource ownership (landlord can only access their own resources)

---

## Example Usage

### Complete Flow: Create Room and Upload Images

1. **Create Room**
```bash
curl -X POST http://localhost:5000/api/landlord/rooms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cozy Studio",
    "address": "123 Main St",
    "city": "HCMC",
    "pricePerMonth": 5000000
  }'
```

2. **Upload Room Image**
```bash
curl -X POST http://localhost:5000/api/landlord/rooms/1/images \
  -H "Authorization: Bearer <token>" \
  -F "image=@room.jpg"
```

3. **Add Facilities**
```bash
curl -X POST http://localhost:5000/api/landlord/rooms/1/facilities \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "facilityName": "Air Conditioner",
    "facilityType": "appliance"
  }'
```

---

## Notes

- All timestamps are in UTC timezone
- Soft deletes are used for rooms (is_deleted flag)
- Automatic notifications are created for important events
- Payment statistics can be filtered by date range
- Room status automatically updates when contracts are created/terminated
- Contract renewal creates a new contract linked to the original
