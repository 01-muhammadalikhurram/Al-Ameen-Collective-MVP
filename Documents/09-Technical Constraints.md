Document 9
Technical Constraints
Al Ameen Collective
Version 2.0
Technical Standards & Development Constraints

1. Purpose

This document defines the mandatory technical standards, architectural rules, coding practices, and constraints that every developer and AI development agent must follow throughout the project.

These rules are non-negotiable unless explicitly approved by the project owner.

The primary goals are:

Maintain consistency
Improve maintainability
Improve scalability
Reduce technical debt
Prevent AI hallucinations
Ensure production-ready code quality 2. Technology Stack (Locked)

The technology stack is fixed and must not be changed without approval.

Frontend
React 19
Vite
TypeScript
Tailwind CSS
shadcn/ui
React Router
TanStack Query
Axios
React Hook Form
Zod
Framer Motion
Lucide React
Backend
Node.js
Express.js
TypeScript
Prisma ORM
PostgreSQL (Supabase)
JWT Authentication
bcrypt
Multer
Pino Logger
Zod Validation
Database
PostgreSQL
Hosted on Supabase
Storage
Supabase Storage
Version Control
Git
GitHub 3. Project Structure

The project must always remain separated into independent applications.

al-ameen-collective/

frontend/

backend/

docs/

README.md

The AI must never merge frontend and backend into one application.

4. Frontend Constraints

The frontend must:

Never access the database.
Never contain pricing logic.
Never calculate delivery charges.
Never generate Order IDs.
Never trust user-entered prices.
Never contain SQL queries.
Never contain Prisma code.

The frontend is responsible only for:

Rendering UI
Sending API requests
Managing UI state
Local cart storage
Displaying backend responses 5. Backend Constraints

The backend must:

Handle all business logic.
Validate every request.
Authenticate admin users.
Calculate prices.
Calculate delivery charges.
Generate secure Order IDs.
Generate vendor access tokens.
Store all data using Prisma ORM.
Enforce authorization.

The backend must never:

Return unnecessary sensitive data.
Trust client calculations.
Skip validation.
Use raw SQL unless absolutely necessary. 6. Database Constraints

The database:

Can only be accessed by the backend.
Must enforce foreign keys.
Must use UUID primary keys.
Must preserve historical order data.
Must never delete completed orders.
Must use migrations through Prisma. 7. API Constraints

The API must:

Follow REST principles.
Use versioning from day one:
/api/v1/
Return JSON only.
Use consistent response formats.
Use correct HTTP status codes.
Be fully documented using OpenAPI (Swagger). 8. Authentication Constraints

Only Admin users authenticate.

There are:

No customer accounts.
No vendor accounts.
No customer login.
No customer registration.
No OTP verification.

Vendor access must rely exclusively on secure tokenized links.

9. Business Logic Constraints

Business logic must exist only in the backend.

Examples include:

Selling price calculation
Delivery calculation
Order generation
Profit calculation
Product validation
Vendor link generation
Status transitions

The frontend must never duplicate these rules.

10. Security Constraints

The application must implement:

HTTPS in production
Helmet middleware
CORS
Rate limiting
Input validation
Password hashing
JWT authentication
Environment variables
Secure file uploads
SQL injection protection through Prisma

Sensitive information must never be exposed.

11. Code Quality Standards

The project must use:

TypeScript strict mode
ESLint
Prettier
Consistent naming conventions
Small reusable functions
Modular architecture
Meaningful variable names
No dead code
No commented-out production code 12. Folder Organization

The codebase must follow feature separation and clear layering.

Frontend
Components
Pages
Features
Hooks
Context
Services
API
Utilities
Backend
Routes
Controllers
Services
Repositories
Middleware
Validators
Prisma
Utilities

No business logic should exist in routing files or React components.

13. Naming Conventions

Use consistent naming throughout the project.

Files
product-card.tsx
order-service.ts
delivery-rule.ts
React Components
ProductCard
CheckoutPage
AdminSidebar
Variables
productItems
orderHistory
deliveryCharge
Constants
MAX_UPLOAD_SIZE
DEFAULT_DELIVERY_CHARGE
JWT_EXPIRATION

Avoid abbreviations unless they are widely understood.

14. Git Standards

Use feature branches.

Example:

feature/product-management
feature/cart
feature/admin-dashboard
bugfix/order-validation

Commit messages should follow a consistent format:

feat: add product management module
fix: correct delivery calculation
refactor: simplify order service
docs: update API specification

Never commit secrets, .env files, or generated build artifacts.

15. Environment Configuration

All configuration values must come from environment variables.

Examples:

Database URL
JWT Secret
Supabase Keys
API Base URL
Port
Storage Bucket
WhatsApp Number

Hardcoded secrets are prohibited.

16. Performance Constraints

The application should:

Lazy-load frontend routes.
Optimize images.
Cache server responses where appropriate.
Use pagination for large datasets.
Avoid unnecessary database queries.
Keep API responses focused on required data only. 17. Accessibility Constraints

The application must:

Follow WCAG AA guidelines.
Be keyboard accessible.
Use semantic HTML.
Provide alt text for images.
Maintain sufficient color contrast.
Display visible focus indicators. 18. Error Handling Constraints

Errors must:

Be logged on the backend.
Return consistent API responses.
Never expose stack traces to users.
Display user-friendly messages on the frontend.
Differentiate between validation, authentication, authorization, and server errors. 19. Testing Constraints

Every critical feature should be testable.

Minimum testing targets:

Pricing calculations
Delivery calculations
Order creation
Product CRUD
Admin authentication
Vendor token validation

AI-generated code should be structured to support automated testing.

20. Deployment Constraints

The frontend and backend must be deployed independently.

Recommended deployment:

Frontend: Vercel
Backend: Railway or Render
Database: Supabase
Storage: Supabase Storage

Configuration should differ appropriately between development and production environments.

21. Documentation Requirements

The project must maintain:

Software Requirements Specification (SRS)
API Documentation
Database Schema Documentation
Deployment Guide
Environment Setup Guide
README
Change Log

Documentation must be updated alongside code changes.

22. Future Scalability

The architecture must support future additions without major refactoring, including:

Customer accounts
Vendor accounts
Multiple administrators
Inventory management
Payment gateways
Courier integrations
Analytics
Reporting
Discount coupons
Internationalization
Mobile applications 23. AI Development Rules

The AI development agent must:

Read all project documentation before generating code.
Never invent requirements.
Never change the technology stack.
Never redesign the UI without approval.
Reuse existing components and services.
Ask for clarification when requirements are ambiguous.
Prefer maintainability over cleverness.
Generate production-quality, typed, documented code. 24. Prohibited Practices

The following are not allowed unless explicitly approved:

Mixing frontend and backend into one project.
Direct frontend access to Supabase.
Hardcoded secrets.
Inline SQL queries.
Business logic inside React components.
Business logic inside Express routes.
Disabling TypeScript strict mode.
Ignoring linting errors.
Using any without justification.
Copy-pasting duplicated code.
Silent error handling.
Storing passwords in plain text. 25. Definition of Done

A feature is considered complete only when:

Functional requirements are implemented.
UI matches the design specification.
Backend logic is complete.
Validation is implemented.
Errors are handled.
Types are defined.
Code passes linting.
Documentation is updated.
API endpoints are documented.
The feature is responsive.
The feature is accessible.
No known critical bugs remain.
⭐ One Final Recommendation

Since we're building this like a professional software project, I recommend adding Document 10: Master AI Development Instructions.

This won't describe the website itself. Instead, it will define how the AI should work while building it, including rules such as:

Read all specification documents before writing code.
Never overwrite working code without reason.
Build feature by feature.
Complete backend before frontend for each feature.
Keep commits small and modular.
Do not generate placeholder implementations unless explicitly requested.
Do not assume requirements that are not documented.
Generate clean, production-ready code with comments only where they add value.

That document effectively becomes the "constitution" for the AI coding agent and significantly improves consistency across long development sessions. I consider it the final piece that ties all of your specification documents together.
