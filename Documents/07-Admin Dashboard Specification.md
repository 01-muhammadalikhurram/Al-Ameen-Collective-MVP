Document 7
Admin Dashboard Specification
Al Ameen Collective
Version 2.0
Admin Panel Software Specification

1. Overview

The Admin Dashboard is the control center of Al Ameen Collective.

Only authenticated administrators can access it.

The dashboard enables the business owner to:

Manage products
Manage product items (colors/variants)
Manage orders
Manage pricing
Manage delivery rules
Manage announcements
View business statistics
Generate vendor links
Track business activity

All business operations must be performed through this dashboard.

2. Dashboard Objectives

The Admin Dashboard should:

Minimize manual work.
Reduce human errors.
Require as few clicks as possible.
Be mobile-friendly (for quick order management).
Be fast and responsive.
Maintain complete historical records.
Never require direct database interaction. 3. Authentication

Only administrators can access the dashboard.

Authentication:

Username
Password
JWT Authentication
Password hashed using bcrypt

Protected Routes:

/admin/\*

Unauthorized users are redirected to:

/administr/login 4. Dashboard Layout

The dashboard consists of:

---

## Top Navigation

Sidebar | Main Content

             |
             |
             |
             |
             |

---

Sidebar

Contains:

Dashboard
Products
Orders
Profit Management
Delivery Management
Website Management
Logout

Sidebar should collapse on mobile.

Top Navigation

Contains:

Page Title
Search
Notifications (future)
Admin Profile
Logout Button 5. Dashboard Home

Dashboard homepage should immediately display business statistics.

Statistics Cards

Display:

Total Products

Pending Orders

Confirmed Orders

Cancelled Orders

Delivered Orders

Today's Orders

This Week Orders

This Month Orders

Example

---

Total Products

245

---

Pending Orders

18

---

Delivered

612

---

Recent Orders

Display latest 10 orders.

Columns:

Order ID
Customer Name
Date
Status
Total
Actions

Actions:

View
Confirm
Cancel
Delivered
Recent Products

Display latest added products.

6. Product Management Module

This is where products are managed.

Product List

Display table.

Columns:

Product Image
Product Name
Category
Fabric
Status
Product Items
Created Date
Actions

Actions:

View
Edit
Archive
Delete (Soft Delete)
Search

Search by:

Product Name
Product Code
Fabric
Category
Filters

Category

Fabric

Season

Status

7. Create Product

Fields:

Product Name

Slug (auto-generated, editable)

Category

Fabric

Season

Full Description

Care Instructions

Status

After product creation,

redirect to Product Items page.

8. Product Items Management

Each Product contains multiple Product Items.

Example:

Premium Lawn

↓

Blue

↓

White

↓

Black

↓

Green

Each Product Item contains:

Product Code
Color
Wholesale Price
Additional Profit Override
Product Images
Status

Actions:

Add
Edit
Archive 9. Product Images

Multiple images allowed.

Upload via drag-and-drop.

Preview before upload.

Reorder images using drag-and-drop.

Delete images.

10. Order Management

Orders page displays all customer orders.

Columns:

Order ID
Customer Name
Phone
Status
Total
Created Date

Actions:

View
Confirm
Cancel
Mark Delivered
Filters

Pending

Confirmed

Cancelled

Delivered

Date Range

Customer Name

Phone Number

Order ID

11. Order Details

Viewing an order should display:

Customer Information:

Name
Phone
Address
Notes

Products:

Image
Product Name
Product Code
Quantity
Wholesale Price
Selling Price
Profit

Summary:

Subtotal

Delivery Charges

Grand Total

Vendor Section

Display:

Vendor Link

Copy Button

Open Button

Regenerate Link (Optional)

12. Order Workflow
    Customer places order

↓

Pending

↓

Admin reviews

↓

Confirm

↓

Vendor Link Generated

↓

Vendor Ships

↓

Delivered

Cancellation can occur before delivery.

Delivered orders become read-only.

13. Profit Management

Profit system contains two sections.

Global Profit

Example:

Global Profit

400 PKR

Applied to every Product Item.

Product-Specific Profit

Table:

Product Item

Specific Profit

Status

Priority

Specific Profit overrides Global Profit.

14. Delivery Management

Admin can configure:

Base Delivery Charge

Example

250 PKR

Delivery Discount Rules

Example:

5000

↓

50%
10000

↓

100%

Rules evaluated automatically.

15. Website Management

Admin manages customer-facing content.

Announcement Ribbon

Add

Edit

Delete

Reorder

Activate

Deactivate

Business Information

Business Name

WhatsApp Number

Business Logo

Footer Text

Social Media Links (Future)

16. Search System

Global search.

Can search:

Products

Orders

Customer Phone

Customer Name

Order ID

Product Code

17. Notifications (Future)

Reserved for future.

Examples:

New Order

Product Archived

Low Stock (if inventory is added later)

18. Reports (Future)

Reserved.

Possible reports:

Daily Sales

Monthly Sales

Most Sold Products

Profit Reports

Delivery Reports

19. Audit Trail

Every important action should be recorded.

Examples:

Product Created

Product Updated

Profit Changed

Order Confirmed

Order Cancelled

Delivery Completed

Admin Login

20. Empty States

Examples:

No Products

No Orders

No Search Results

No Delivery Rules

Each state should include:

Illustration

Helpful message

Call-to-action button

21. Loading States

Every table should display skeleton rows while loading.

Buttons should display loading indicators during actions.

22. Error Handling

Friendly error messages.

Examples:

Product not found.

Order not found.

Upload failed.

Session expired.

Unauthorized.

23. Responsive Design

Desktop:

Full sidebar.

Tablet:

Collapsible sidebar.

Mobile:

Drawer sidebar.

Tables become responsive cards where appropriate.

24. Accessibility

Keyboard navigation.

Visible focus indicators.

Screen reader compatibility.

Accessible forms.

Semantic HTML.

25. Security

Only authenticated admins may access dashboard routes.

Role-based authorization should be designed even though Version 1 has a single admin role, allowing future expansion to roles such as Super Admin, Manager, and Support without redesign.

Sensitive actions (delete, archive, cancel) should require confirmation dialogs.

CSRF protection, secure session handling (or secure JWT implementation), and rate limiting should be implemented.

26. AI Development Constraints

The AI development agent must:

Build the Admin Dashboard as a completely separate layout from the customer-facing website.
Use reusable components throughout the dashboard.
Follow the same color palette and design system defined in the UI/UX Specification.
Ensure all business operations occur through backend APIs.
Never place business logic in the frontend.
Keep all CRUD operations modular and maintainable.
Preserve scalability for future modules such as analytics, multi-admin support, inventory, and reporting.
⭐ I recommend one major improvement

Instead of treating the Admin Dashboard as a collection of pages, design it around business modules. That means each module (Products, Orders, Pricing, Delivery, Website Settings) owns its own pages, components, API hooks, and types. This aligns well with your separate frontend/backend architecture and makes the codebase much easier to scale as Al Ameen Collective grows. For example:

frontend/src/features/
├── products/
├── orders/
├── pricing/
├── delivery/
├── website/
└── admin-auth/

This feature-first organization is widely used in larger React applications and will make AI-generated code easier to navigate and maintain as your project expands.
