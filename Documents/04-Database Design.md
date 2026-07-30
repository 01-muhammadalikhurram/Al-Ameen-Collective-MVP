Document 4
Database Design
Al Ameen Collective
Version 2.0
Database Design Specification

1. Database Overview

The application shall use PostgreSQL as the relational database management system.

The database will be hosted using Supabase PostgreSQL.

The backend (Node.js + Express + Prisma ORM) will be the only application allowed to access the database.

The frontend must never connect directly to Supabase.

2. Database Design Principles

The database must satisfy the following principles:

Third Normal Form (3NF)
No duplicated business data
Foreign key constraints
Cascade rules where appropriate
Soft deletion where appropriate
UUIDs for primary keys
Public Order IDs separated from internal IDs
Created/Updated timestamps on every business table 3. Database Entities

The system consists of the following primary entities:

Admin

Product

Product Variant

Order

Order Item

Pricing Rule

Delivery Rule

Announcement

Website Setting

Admin Session (optional)

Notice:

There is NO Customer table.

There is NO Vendor table.

This is intentional.

Customers do not create accounts.

Vendor does not log in.

Customer information exists only inside Orders.

Vendor only views orders.

4. Entity Relationship Diagram (Logical)
   Admin
   │
   │
   ┌───────────┴────────────┐
   │ │
   ▼ ▼
   Products Announcements
   │
   │
   ▼
   Product Variants
   │
   ▼
   Order Items
   │
   ▼
   Orders
   │
   ├──────────────┐
   ▼ ▼
   Pricing Rules Delivery Rules
5. Tables
   5.1 Admin

Stores administrator credentials.

Columns
Column Type
id UUID
username VARCHAR(50)
password_hash TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
5.2 Products

Represents one clothing design.

Example

Premium Summer Lawn
Columns
Column Type
id UUID
name VARCHAR
slug VARCHAR UNIQUE
description TEXT
fabric VARCHAR
category VARCHAR
season VARCHAR
status ENUM
created_at TIMESTAMP
updated_at TIMESTAMP

Status values

ACTIVE

OUT_OF_STOCK

HIDDEN

ARCHIVED
5.3 Product Variants

Each product can have multiple variants.

Example

Premium Lawn

↓

Blue

↓

Black

↓

White

↓

Maroon
Columns
Column Type
id UUID
product_id UUID FK
product_code VARCHAR UNIQUE
color VARCHAR
image_url TEXT
wholesale_price DECIMAL
additional_profit DECIMAL DEFAULT 0
status ENUM
created_at TIMESTAMP

Notice

Each color has its own

Product Code

Wholesale Price

Image

5.4 Orders

Represents one customer order.

Columns
Column Type
id UUID
public_order_id VARCHAR UNIQUE
customer_name VARCHAR
customer_phone VARCHAR
customer_address TEXT
notes TEXT
delivery_charge DECIMAL
subtotal DECIMAL
total DECIMAL
status ENUM
vendor_token TEXT
created_at TIMESTAMP
updated_at TIMESTAMP

Status

PENDING

CONFIRMED

CANCELLED

DELIVERED
5.5 Order Items

One order

↓

Many products.

Columns
Column Type
id UUID
order_id UUID FK
variant_id UUID FK
quantity INTEGER
wholesale_price DECIMAL
selling_price DECIMAL
profit DECIMAL
created_at TIMESTAMP

Notice

Prices are copied here.

They never change.

Historical accuracy preserved.

5.6 Pricing Rules

There should be exactly one active global pricing rule.

Columns
Column Type
id UUID
global_profit DECIMAL
created_at TIMESTAMP
updated_at TIMESTAMP

Each Product Variant can override this through additional_profit.

Selling Price Formula:

Selling Price

=

Wholesale Price

-

Global Profit

-

Additional Profit
5.7 Delivery Rules
Columns
Column Type
id UUID
minimum_order DECIMAL
discount_percentage DECIMAL
created_at TIMESTAMP

Example

5000

↓

50%

Another

10000

↓

100%

The backend applies the highest matching rule automatically.

5.8 Announcements

Scrolling ribbon.

Columns
Column Type
id UUID
message TEXT
active BOOLEAN
display_order INTEGER
5.9 Website Settings

Global configuration.

There should be one row.

Columns

Column Type
id UUID
default_delivery_charge DECIMAL
cart_expiry_days INTEGER
whatsapp_number VARCHAR
business_name VARCHAR
updated_at TIMESTAMP 6. Relationships
Products

1

↓

Many

↓

Product Variants
Orders

1

↓

Many

↓

Order Items
Variants

1

↓

Many

↓

Order Items 7. Order Snapshot Principle

Once an order is created,

these values must NEVER change:

Wholesale Price
Selling Price
Profit
Delivery Charge
Total

Even if product prices change later.

8. Data Integrity Rules

The backend must enforce:

Product exists.
Variant exists.
Quantity > 0.
Product active.
Order ID unique.
Vendor token unique.

The frontend must not bypass these validations.

9. Indexing Strategy

Create indexes on:

products.slug
product_variants.product_code
orders.public_order_id
orders.customer_phone
orders.status
order_items.order_id
order_items.variant_id

These indexes support fast searches and lookups.

10. Soft Deletion Strategy

Do not permanently delete business data.

Instead, use status fields:

ACTIVE
HIDDEN
ARCHIVED

Orders should never be deleted.

Cancelled orders remain for historical records.

11. Future Expansion

The schema is intentionally designed to support future features without major redesign, including:

Customer accounts
Vendor accounts
Online payments
Inventory management
Multiple vendors
Courier integrations
Discount coupons
Product reviews
Wishlist
Analytics
International shipping 12. AI Development Constraints

The AI development agent must:

Use Prisma ORM for all database access.
Generate migrations through Prisma.
Never expose the database directly to the frontend.
Use transactions for order creation.
Generate UUID primary keys.
Generate secure, unique public order IDs.
Store historical pricing in order_items.
Enforce foreign key constraints.
Keep pricing logic in the backend only.
⚠️ Before we finalize this document, there are three architectural changes I strongly recommend.

1. Replace Product Variants with Product Items (Recommended) ⭐

Initially, we assumed every product only differed by color. However, your business works differently.

A vendor may send:

Same design
Different colors
Different wholesale prices
Different images

In the future, they may even differ by size, batch, or packaging.

Instead of calling the table product_variants, I recommend naming it product_items.

Example:

Product
↓
Premium Lawn Collection

Product Items
↓
Blue
Black
White
Pink

Each item has:

Product Code
Image
Wholesale Price
Selling Price (calculated)
Color
Status

This naming is more flexible and business-oriented.

2. Add an order_history table ⭐⭐⭐

Instead of simply updating the orders.status, keep a complete audit trail.

Example:

Order Status Changed At
AAC-001 Pending 10:00 AM
AAC-001 Confirmed 10:15 AM
AAC-001 Delivered Next Day

This allows you to display timelines and keeps a permanent history of changes.

3. Add a media table ⭐⭐⭐⭐

Instead of storing image URLs directly in product_items, create a reusable media library.

Example:

## media

id
url
alt_text
file_name
created_at

Then link media to product items.

This makes it much easier to support multiple images per product, galleries, future videos, and document uploads without changing the schema later.

My recommendation is that we adopt these three changes before moving to Document 5. They make the system much more scalable while keeping the implementation clean and aligned with how production e-commerce systems are commonly designed.
