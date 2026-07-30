Document 6
Frontend Specification
Al Ameen Collective
Version 2.0
Frontend Software Architecture Specification

1. Frontend Overview

The frontend is responsible for presenting the user interface and providing a seamless user experience.

It must:

Display products
Allow product browsing
Manage the shopping cart
Collect customer information
Communicate with backend APIs
Display backend responses
Never contain business logic

The frontend must remain lightweight, responsive, accessible, and easy to maintain.

2. Technology Stack

The frontend must use the following technologies:

Framework: React 19
Build Tool: Vite
Language: TypeScript
Styling: Tailwind CSS
UI Components: shadcn/ui
Routing: React Router
State Management: TanStack Query + React Context
Forms: React Hook Form
Validation: Zod
Icons: Lucide React
Animations: Framer Motion
HTTP Client: Axios

No additional UI frameworks (Material UI, Bootstrap, Ant Design, Chakra UI, etc.) should be introduced.

3. Project Structure

The frontend must follow this folder structure:

frontend/

├── src/
│
├── assets/
│
├── components/
│ ├── common/
│ ├── layout/
│ ├── products/
│ ├── cart/
│ ├── checkout/
│ ├── admin/
│ ├── vendor/
│ └── ui/
│
├── pages/
│
├── layouts/
│
├── hooks/
│
├── services/
│
├── api/
│
├── context/
│
├── routes/
│
├── types/
│
├── utils/
│
├── constants/
│
├── lib/
│
├── styles/
│
├── App.tsx
│
└── main.tsx

Every feature must have a clear separation of concerns.

4. Application Architecture

The application should follow this flow:

User

↓

React Components

↓

Custom Hooks

↓

API Service Layer

↓

Axios Client

↓

Backend REST API

The frontend must never communicate directly with the database.

5. Routing Structure

The application should include the following routes:

Public Routes
/

Homepage

/collection

Catalog

/product/:slug

Product Details

/cart

Shopping Cart

/checkout

Checkout

Admin Routes
/admin/login

Admin Login

/admin

Dashboard

/admin/products

Product Management

/admin/orders

Orders

/admin/profit

Profit Management

/admin/delivery

Delivery Management

/admin/settings

Website Settings

Vendor Route
/vendor/:token

Read-only order details.

6. Layouts

The frontend must contain three independent layouts.

Public Layout

Includes:

Announcement Ribbon
Navigation Bar
Main Content
Footer
Admin Layout

Includes:

Sidebar
Top Navigation
Dashboard Content
Vendor Layout

Simple centered layout.

Minimal design.

Read-only.

7. Global State

The frontend should use React Context only for UI state.

Examples:

Theme
Sidebar
Toasts
Cart Count

Business data should not be stored here.

8. Server State

TanStack Query should manage all server state.

Examples:

Products
Product Details
Orders
Delivery Rules
Announcements
Pricing Rules

This ensures caching, background updates, retries, and request deduplication.

9. Local Storage

Local Storage should only be used for:

Shopping Cart
Cart Expiration Timestamp
Admin JWT Token (or preferably secure HttpOnly cookies if implemented later)
UI Preferences (optional)

Cart data should expire automatically after the configured period (default: 30 days).

10. Components

All components should be reusable.

Examples:

Button

Input

Search Bar

Product Card

Product Gallery

Price Badge

Quantity Selector

Announcement Ribbon

Navbar

Footer

Loading Skeleton

Empty State

Modal

Confirmation Dialog

Toast

No duplicated UI code.

11. Product Listing

The Catalog page should:

Fetch products from backend
Display product cards
Support search
Support filtering
Support pagination or infinite scrolling
Display loading skeletons
Display friendly empty states 12. Product Details

Displays:

Product images
Description
Product Items (colors)
Similar products
Quantity selector
Add to Cart
Order Now

Changing a color updates the displayed product item without reloading the page.

13. Shopping Cart

The cart should:

Store selected product items in Local Storage
Support quantity updates
Remove products
Display calculated totals returned by the backend at checkout
Persist across browser refreshes
Automatically clear expired data 14. Checkout

The checkout page should include:

Customer Information:

Name
Phone Number
Address
Optional Notes

Order Summary:

Product Image
Product Name
Product Code
Quantity
Estimated Total

The frontend sends only:

Customer information
Product item IDs
Quantities

It must never send prices as trusted values.

15. API Communication

All HTTP requests must pass through a centralized Axios instance.

Features:

Base URL configuration
Automatic JWT attachment for admin routes
Global error handling
Timeout configuration
Request and response interceptors

Components must not make raw Axios calls directly.

16. Form Handling

All forms must use:

React Hook Form
Zod validation
Inline error messages
Disabled submit buttons while processing

Forms include:

Checkout
Admin Login
Product Management
Profit Management
Delivery Management
Website Settings 17. Image Handling

Images should:

Use lazy loading
Preserve aspect ratio
Show placeholders while loading
Display graceful fallback images on failure

Admin image uploads should include previews before submission.

18. Error Handling

The frontend should gracefully handle:

Network failures
Validation errors
API errors
Empty search results
Missing products
Unauthorized admin access

User-friendly messages should always be displayed.

19. Loading States

Every asynchronous page should display skeleton loaders.

Buttons should show loading indicators while requests are in progress.

The application should never display blank screens.

20. Responsive Design

The website must support:

Mobile (320px+)
Tablet
Laptop
Desktop
Large Desktop

The layout should adapt naturally without horizontal scrolling.

21. Accessibility

The frontend must follow WCAG AA guidelines.

Requirements:

Keyboard navigation
Semantic HTML
Focus indicators
Alt text for images
Proper ARIA labels where needed
Sufficient color contrast 22. Performance

The frontend should:

Lazy-load pages
Code-split routes
Optimize images
Cache API requests via TanStack Query
Minimize unnecessary re-renders
Memoize expensive computations where appropriate 23. Coding Standards
Strict TypeScript
Functional components only
React Hooks only
No class components
No inline business logic
Small, reusable components
Consistent naming conventions
ESLint + Prettier
Avoid prop drilling; use composition or context appropriately 24. Security

The frontend must:

Never expose secrets
Never trust user input
Sanitize displayed content where necessary
Handle JWT expiration gracefully
Redirect unauthorized admin users to the login page
Prevent accidental duplicate form submissions 25. AI Development Constraints

The AI development agent must:

Build the frontend as a standalone React application inside the frontend folder.
Consume data exclusively through the backend REST API.
Never implement business logic such as pricing, delivery calculations, or order generation on the client.
Reuse components instead of duplicating UI.
Match the UI/UX Design Specification exactly.
Ensure all pages remain responsive and consistent with the design system.
⭐ Recommendations Before the Next Document

Before moving to Document 7 (API Specification), I recommend two additions that will make the project even more maintainable:

Feature-Based Organization (inside the current structure): While keeping the overall folder layout we've defined, group related files by feature where it makes sense (e.g., product components, hooks, and services together). This scales better as the project grows.
Shared Types from Backend: Generate or maintain shared TypeScript types for API request/response models so the frontend and backend remain synchronized and reduce the chance of integration bugs.

With Documents 1–6 completed, you'll have a specification that's already much more detailed than what many professional software projects start with. The remaining documents (API Specification, Deployment, Testing, etc.) will build on this solid foundation.
