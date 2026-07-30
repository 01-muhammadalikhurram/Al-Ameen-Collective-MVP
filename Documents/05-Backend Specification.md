Document 5
Backend Specification
Al Ameen Collective
Version 2.0
Backend Software Architecture Specification

1. Backend Overview

The backend is the core of the application. It is responsible for all business logic, data validation, order processing, pricing calculations, security, authentication, and communication with the PostgreSQL database.

The frontend is considered untrusted. Every request received from the frontend must be validated before any database operation is performed.

The backend must be designed following Clean Architecture principles, separating concerns into controllers, services, repositories, middleware, routes, and utilities.

2. Technology Stack

The backend must use the following technologies:

Runtime: Node.js
Language: TypeScript
Framework: Express.js
ORM: Prisma ORM
Database: PostgreSQL (Supabase)
Authentication: JWT (Admin only)
Password Hashing: bcrypt
Validation: Zod
File Uploads: Multer
Image Storage: Supabase Storage
Environment Variables: dotenv
Logging: Pino
API Documentation: Swagger/OpenAPI
Package Manager: npm

No other frameworks should be introduced unless explicitly approved.

3. Project Folder Structure

The backend must follow this structure:

backend/

├── src/
│
├── controllers/
│
├── services/
│
├── repositories/
│
├── routes/
│
├── middleware/
│
├── validators/
│
├── utils/
│
├── config/
│
├── prisma/
│
├── types/
│
├── constants/
│
├── interfaces/
│
├── storage/
│
├── docs/
│
├── app.ts
│
└── server.ts
│
├── prisma/
│
├── schema.prisma
│
├── migrations/
│
├── package.json
│
└── .env

Business logic must never exist inside controllers.

4. Architecture Layers

The backend shall follow this flow:

Client

↓

Route

↓

Middleware

↓

Validator

↓

Controller

↓

Service

↓

Repository

↓

Prisma ORM

↓

PostgreSQL

Each layer has a single responsibility.

5. Authentication

Authentication exists only for Admin users.

There are no customer accounts.

There are no vendor accounts.

Admin Login
POST /api/admin/login

Input:

Username
Password

Backend:

Validate input
Verify password
Generate JWT
Return access token
Protected Routes

All admin APIs require JWT authentication.

Unauthorized requests return:

401 Unauthorized 6. Product APIs
Create Product
POST /api/products

Creates a new product.

Update Product
PUT /api/products/:id
Delete Product

Soft delete only.

DELETE /api/products/:id
List Products
GET /api/products

Supports:

Search
Category
Fabric
Season
Color
Pagination
Sorting
Product Details
GET /api/products/:slug

Returns:

Images
Description
Product Items
Similar Products 7. Product Item APIs

Every product may contain multiple product items (colors/variants).

POST /api/product-items
PUT /api/product-items/:id
DELETE /api/product-items/:id 8. Cart

There is no server-side cart.

Cart exists only in Local Storage.

The backend only receives the cart during checkout.

9. Checkout API
   POST /api/orders

Input:

Customer Name
Phone
Address
Notes
Product IDs
Quantities

Backend must ignore any prices submitted by the frontend.

Backend Process:

Validate customer information.
Validate products.
Validate quantities.
Check product availability.
Calculate prices.
Apply pricing rules.
Apply delivery rules.
Generate Order ID.
Generate Vendor Token.
Store Order.
Store Order Items.
Return:
Order ID
WhatsApp message 10. Order APIs
List Orders
GET /api/orders

Admin only.

Supports:

Search
Status
Date
Customer
Order Details
GET /api/orders/:orderId
Confirm Order
PATCH /api/orders/:id/confirm
Cancel Order
PATCH /api/orders/:id/cancel
Mark Delivered
PATCH /api/orders/:id/delivered 11. Pricing APIs

Global Profit

GET /api/pricing
PUT /api/pricing

Specific product override

PUT /api/product-items/:id/profit 12. Delivery APIs
GET /api/delivery
PUT /api/delivery/base
POST /api/delivery/rules
DELETE /api/delivery/rules/:id 13. Website APIs

Announcement ribbon

GET /api/announcements
POST /api/announcements
PUT /api/announcements/:id
DELETE /api/announcements/:id 14. Vendor APIs

Vendor does not authenticate.

Vendor accesses orders using a secure tokenized link.

Example:

GET /api/vendor/orders/:token

Returns read-only order information.

No editing allowed.

15. Business Logic

The backend is responsible for:

Calculating selling prices
Applying global profit
Applying specific profit overrides
Calculating delivery discounts
Generating public Order IDs
Generating secure vendor tokens
Creating order snapshots
Preventing duplicate orders
Maintaining order history 16. Validation Rules

Every request must be validated using Zod.

Examples:

Customer Name:

Required
Minimum length

Phone Number:

Pakistani phone format

Quantity:

Integer
Greater than zero

Products:

Must exist
Must be active 17. Error Handling

All errors must follow a consistent JSON format.

Example:

{
"success": false,
"message": "Product not found.",
"errors": []
}

HTTP status codes must be used correctly:

200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error 18. Logging

Every important action should be logged.

Examples:

Admin login
Product creation
Product update
Order creation
Order confirmation
Order cancellation
Delivery completion

Sensitive information (passwords, JWTs) must never be logged.

19. File Uploads

Images are uploaded through the backend.

Process:

Validate file type.
Validate file size.
Upload to Supabase Storage.
Store URL in database.

Supported formats:

JPG
JPEG
PNG
WEBP

Maximum size should be configurable.

20. Security

The backend must implement:

Helmet
CORS
Rate Limiting
Input Validation
SQL Injection Protection (via Prisma)
JWT Authentication
Password Hashing
Environment Variables
Secure HTTP Headers

Never expose internal errors to clients.

21. Environment Variables

The backend must use .env for configuration.

Examples:

DATABASE_URL=
JWT_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PORT=
WHATSAPP_NUMBER=
NODE_ENV=

Secrets must never be committed to Git.

22. API Response Format

Every API should return a consistent structure.

Successful response:

{
"success": true,
"message": "Product created successfully.",
"data": {}
}

Failed response:

{
"success": false,
"message": "Validation failed.",
"errors": []
} 23. Coding Standards
Strict TypeScript mode.
ESLint + Prettier.
Async/await only.
No callback-based code.
Services contain business logic.
Controllers remain thin.
Repository layer handles database access.
Functions should be small and focused.
Use dependency injection where appropriate. 24. AI Development Constraints

The AI agent must not:

Put business logic inside controllers.
Access the database from the frontend.
Trust prices from the client.
Duplicate validation logic unnecessarily.
Use raw SQL when Prisma can handle the query.
Hard-code business rules.
Mix routing, business logic, and persistence.

The backend must remain modular, maintainable, and extensible.

⭐ Before We Move to Document 6 (Frontend Specification)

There are four architectural improvements I'd make to strengthen the backend even further:

Adopt API versioning from day one (e.g., /api/v1/...) so future changes don't break existing clients.
Introduce a centralized configuration module for pricing, delivery, and application settings instead of scattering them across services.
Use Prisma transactions for the entire checkout process so order creation is atomic—either everything succeeds or nothing is written to the database.
Generate OpenAPI/Swagger documentation automatically from the code or route definitions so your API documentation stays synchronized with implementation.

These additions make the backend much closer to production-grade software and provide a solid foundation for future expansion.
