Document 2
Complete User Stories
Al Ameen Collective
Version 2.0
Software Requirements Specification (SRS)
Table of Contents

1. System Actors

2. Customer User Stories
   2.1 Homepage
   2.2 Navigation
   2.3 Catalog
   2.4 Product Details
   2.5 Product Search
   2.6 Product Filters
   2.7 Shopping Cart
   2.8 Checkout
   2.9 WhatsApp Order Submission
   2.10 Edge Cases

3. Admin User Stories
   3.1 Authentication
   3.2 Dashboard
   3.3 Product Management
   3.4 Product Variant Management
   3.5 Order Management
   3.6 Profit Management
   3.7 Delivery Management
   3.8 Website Management
   3.9 Order Status Management

4. Vendor User Stories
   4.1 Vendor Order Access
   4.2 Vendor Order Details
   4.3 Invalid Link Handling

5. System Stories

6. Error Handling Stories

7. Non Functional Stories

8. Acceptance Criteria
9. System Actors

There are only three actors.

Customer

A visitor browsing products and placing orders.

No account required.

No login required.

Admin

Business owner.

Has full access.

Requires authentication.

Vendor

Receives secure order links.

No account required.

Can only view assigned orders.

CUSTOMER USER STORIES
US-001
Customer visits website
Actor

Customer

Description

As a customer,

I want to visit the website,

so I can browse available products.

Preconditions

None

Main Flow

Customer enters website URL.

↓

Homepage loads.

↓

Ribbon is displayed.

↓

Navigation bar is displayed.

↓

Hero section loads.

↓

Latest arrivals load.

↓

Footer loads.

Acceptance Criteria

Homepage loads successfully.

No login required.

Page loads within acceptable time.

US-002
Browse Catalog

Customer clicks Catalog.

↓

Catalog page opens.

↓

Products displayed as responsive cards.

↓

Each card shows

Image
Name
Selling Price
Fabric
Color Badge
Add to Cart
Order Now

Customer can scroll infinitely or use pagination (decision later).

US-003
Search Products

Customer enters text into search bar.

Search should be typo tolerant.

Example

Lawn

Laun

Lwan

Lwn

should still return Lawn products.

Search should work against

Product Name
Description
Fabric
Color
Tags
US-004
Filter Products

Customer selects filters.

Example

Women

↓

Lawn

↓

Printed

↓

3 Piece

Only matching products displayed.

Multiple filters can be active simultaneously.

US-005
Product Details

Customer clicks product.

Product page opens.

Customer sees

Large Images

Gallery

Product Description

Fabric

Size Details

Stitch Type

Included Items

Price

Available Colors

Similar Products

Add to Cart

Order Now

Customer clicks another color.

Product image changes.

Product information updates.

US-006
Add Product To Cart

Customer presses Add To Cart.

Product added immediately.

No login.

No page refresh.

Cart counter updates.

Toast notification appears.

Cart stores

Product ID

Quantity

Selected Variant

Timestamp

US-007
View Cart

Customer clicks Cart.

Cart page opens.

Customer sees

Image

Product

Price

Quantity

Subtotal

Delivery Charges

Estimated Total

Customer can

Increase quantity

Decrease quantity

Remove product

Continue shopping

Proceed to Checkout

US-008
Checkout

Customer clicks Checkout.

Checkout page opens.

Customer enters

Name

Phone Number

Complete Address

Optional Notes

Customer also sees

All ordered products

Images

Names

Product IDs

Quantity controls

Price Summary

Delivery Charges

Grand Total

Customer can still edit quantities.

US-009
Place Order

Customer presses Place Order.

Frontend sends order request.

Backend validates.

Backend calculates prices.

Backend creates order.

Backend generates

Public Order ID.

Backend stores order.

Backend returns WhatsApp message.

Frontend opens WhatsApp.

Customer sees prefilled message.

Customer presses Send.

WhatsApp Message Format
Assalam-o-Alaikum,

I would like to place an order.

Order ID:
AAC-X82M4P

Customer Name:

Customer Phone:

Customer Address:

Products

1.

Product ID

Product Name

Quantity

2.

Product ID

Product Name

Quantity

Notes

Thank You.

Customer cannot modify website data.

Only WhatsApp message.

Backend remains source of truth.

US-010
Empty Cart

Customer opens cart.

Cart empty.

Display illustration.

Button

Continue Shopping.

US-011
Checkout Validation

Customer presses checkout.

Required

Name

Phone

Address

Missing fields

Inline validation.

Checkout disabled.

US-012
Cart Persistence

Cart stored in Local Storage.

Customer closes browser.

Returns after days.

Cart restored.

Expired carts automatically deleted after configurable duration (default: 30 days).

ADMIN USER STORIES
US-101
Admin Login

Admin opens

/admin/login

Enters

Username

Password

Backend authenticates.

JWT created.

Admin redirected.

Unauthorized users denied.

US-102
Dashboard

Admin sees

Total Products

Pending Orders

Confirmed Orders

Cancelled Orders

Delivered Orders

Today's Orders

Revenue Statistics (future)

Latest Orders

Quick Actions

US-103
Product Management

Admin can

Create Product

Edit Product

Delete Product

Archive Product

Upload Images

Manage Description

Manage Variants

Manage Tags

Manage Wholesale Price

US-104
Product Variants

One description.

Many colors.

Example

Premium Lawn

↓

Green

↓

Blue

↓

Black

↓

White

Each variant has

Own Image

Own Product ID

Own Wholesale Price (if needed)

Same description.

US-105
Order Management

Admin opens Orders.

Can filter by

Pending

Confirmed

Cancelled

Delivered

Search by

Order ID

Phone

Customer

Product

US-106
View Order

Admin sees

Customer

Products

Product IDs

Wholesale Prices

Selling Prices

Delivery Charges

Notes

Order Timeline

Vendor Link

US-107
Confirm Order

Pending

↓

Confirmed

Vendor link generated.

Admin copies link.

Sends vendor.

US-108
Cancel Order

Pending

↓

Cancelled

Reason optional.

Order retained.

US-109
Delivered

Confirmed

↓

Delivered

Locked.

Cannot modify products.

US-110
Profit Management

Admin can define

Global Profit

Example

+400

All products updated.

Specific Profit

Product A

+700

Overrides global.

Selling Price

=

Wholesale

Profit

Delivery excluded.

US-111
Delivery Management

Admin defines

Base Delivery Charge

Example

250

Rules

Above 5000

↓

50% Delivery Discount

Above 10000

↓

Free Delivery

Rules automatically calculated.

US-112
Website Alerts

Admin changes

Ribbon messages.

Example

Free Delivery

New Collection

Sale

Messages rotate automatically.

VENDOR USER STORIES
US-201

Vendor receives secure link.

Opens browser.

No login.

Order displayed.

US-202

Vendor sees

Order ID

Customer Name

Phone

Address

Products

Wholesale Price

Profit

Delivery Charges

Order Date

Vendor cannot

Edit

Delete

Update

Anything.

Read only.

US-203

Invalid link.

Display

Order Not Found.

Expired link.

Display

Access Expired.

SYSTEM STORIES

System generates unique Order IDs.

System calculates prices.

System validates products.

System validates quantities.

System prevents duplicate IDs.

System stores every order.

System never trusts frontend prices.

ERROR STORIES

Invalid product.

Product removed.

Inform customer.

Price changed before checkout.

Backend recalculates.

Customer shown updated total.

Deleted product.

Cannot order.

Backend unavailable.

Friendly error.

Retry option.

NON-FUNCTIONAL STORIES

Responsive.

Fast.

Accessible.

Secure.

SEO Friendly.

Modular.

Scalable.

Maintainable.

ACCEPTANCE CRITERIA

The AI implementation will be considered complete when:

Customers can browse, search, filter, and view products without authentication.
Customers can add items to a persistent local cart and complete checkout.
Checkout validates required fields and creates a backend order.
Every order receives a unique public Order ID and opens a prefilled WhatsApp message.
Admin can manage products, variants, pricing, delivery rules, ribbon alerts, and orders.
Vendor can securely view assigned orders in read-only mode without logging in.
All business logic, pricing, and validation are enforced by the backend.
The application behaves consistently across desktop and mobile devices.
Error cases are handled gracefully without exposing sensitive information.
One thing I'd change before moving to Document 3

I would replace "User Stories" with "Use Cases" wherever complex workflows exist (Checkout, Admin Order Management, Vendor Access). User stories describe intent ("As a customer..."), but use cases define exact system behavior, validations, alternate paths, and exceptions. AI coding agents generally produce more reliable implementations when given detailed use cases rather than high-level stories. My recommendation is to include both: keep the user stories for business context, and add formal use cases for the critical workflows. That combination is much closer to what experienced software teams produce for complex systems.
