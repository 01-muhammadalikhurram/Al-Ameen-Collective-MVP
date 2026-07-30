Document 1
Project Vision and Business Requirements
Al Ameen Collective
Version 2.0
Document 1 of X

1. Project Overview
   1.1 Project Name

Al Ameen Collective

1.2 Project Type

Business-to-Customer (B2C) E-Commerce Website with an integrated Order Management System and Vendor Portal.

Unlike traditional e-commerce websites, Al Ameen Collective follows a WhatsApp-first order confirmation workflow, where customers browse products on the website but finalize communication through WhatsApp. The website is responsible for product discovery, shopping cart management, order creation, pricing, and order management, while WhatsApp serves as the communication channel between customer and business owner.

2. Vision Statement

The vision of Al Ameen Collective is to become a premium online destination for purchasing high-quality unstitched fabrics and related products throughout Pakistan by combining the simplicity of WhatsApp ordering with the professionalism and automation of a modern e-commerce platform.

The platform should provide customers with an elegant shopping experience while minimizing the administrative workload of the business owner through intelligent order management, automated pricing calculations, delivery management, and vendor collaboration.

The system must be designed in a modular way so it can evolve from a small business website into a complete national-scale e-commerce platform without requiring major architectural changes.

3. Business Background

Al Ameen Collective does not manufacture products.

Instead, the business acts as a reseller.

A vendor supplies products to the business owner.

The vendor periodically shares product images, descriptions, and wholesale prices.

The business owner markets those products to customers.

Whenever a customer places an order:

The customer pays the selling price.
The vendor dispatches the product directly to the customer.
After successful delivery, the vendor transfers only the business owner's profit.

The website should automate this entire workflow while keeping it simple for all parties involved.

4. Current Manual Workflow

The current business process operates as follows:

Vendor shares new products through WhatsApp.
Business owner manually advertises products.
Customer contacts the owner through WhatsApp.
Business owner manually negotiates price.
Customer provides:
Name
Phone Number
Address
Business owner manually forwards customer details to vendor.
Vendor dispatches the order.
Customer receives the parcel.
Customer pays Cash on Delivery.
Vendor sends business owner's profit.

This workflow requires significant manual effort and is difficult to scale.

5. Business Problems

The current workflow suffers from several issues.

Product Management

Products are scattered across WhatsApp chats.

Finding old products is difficult.

Updating prices is difficult.

Managing different colors is difficult.

Pricing

Selling prices are calculated manually.

Profit calculations are repetitive.

Changing profit requires recalculating every product manually.

Order Management

Customer information exists only inside WhatsApp messages.

Orders are difficult to organize.

Past customers cannot be searched easily.

Order history is difficult to maintain.

Vendor Communication

The business owner repeatedly copies customer information.

Order mistakes can occur.

Vendor communication is not standardized.

Growth

As product count increases, manual management becomes impossible.

6. Project Goals

The website should solve the above business problems while maintaining a very simple customer experience.

Primary goals include:

Beautiful online catalog
Easy product browsing
Shopping cart
Simple checkout
Automatic order generation
Automatic pricing
Automatic delivery calculations
Automatic Order ID generation
Admin order management
Vendor order portal 7. Business Objectives

The website must help achieve the following objectives.

Objective 1

Increase customer trust by providing a professional website.

Objective 2

Reduce manual calculations.

Objective 3

Reduce order mistakes.

Objective 4

Allow hundreds of products to be managed easily.

Objective 5

Allow future expansion without rebuilding the application.

8. Target Audience

The platform primarily targets:

Customers within Pakistan
Customers purchasing unstitched fabrics
Customers purchasing seasonal collections
Customers looking for Cash-on-Delivery purchases

Future expansion should support international customers.

9. Business Model

Business Type

Reseller

Inventory Ownership

Vendor

Shipping Responsibility

Vendor

Marketing Responsibility

Business Owner

Customer Support

Business Owner

Payment Collection

Vendor (Cash on Delivery)

Business Profit

Transferred by Vendor after successful delivery

10. Core Business Workflow

The desired workflow is:

Vendor

↓

Admin receives new product

↓

Admin adds product to website

↓

Customer visits website

↓

Customer browses products

↓

Customer adds products to cart

↓

Customer proceeds to checkout

↓

Customer enters

Name
Phone Number
Address
Optional Notes

↓

Backend validates products

↓

Backend calculates:

Product prices
Profit rules
Delivery rules

↓

Backend creates Order

↓

Backend generates a unique public Order ID

↓

Backend stores the order in PostgreSQL (Supabase)

↓

Backend prepares a WhatsApp message containing:

Order ID
Customer Name
Phone Number
Address
Ordered Products
Product IDs
Quantities

↓

Customer is redirected to WhatsApp with the prefilled message

↓

Customer reviews the message

↓

Customer presses Send

↓

Business Owner receives the WhatsApp message

↓

Business Owner opens Admin Dashboard

↓

Business Owner reviews the order

↓

Business Owner confirms or cancels the order

↓

Business Owner sends the secure Vendor Order Link

↓

Vendor opens the link

↓

Vendor views:

Customer details
Ordered products
Wholesale prices
Delivery charges
Total wholesale amount

↓

Vendor dispatches the parcel

↓

Business Owner marks the order as Delivered

11. Guiding Principles

The project must always follow these principles.

Customer First

Customers should never be forced to create an account.

Simplicity

Ordering should take less than one minute.

Automation

Every repetitive business task should be automated.

Professional Appearance

The website should look like a premium fashion brand rather than a simple reseller website.

Scalability

The architecture should support:

Thousands of products
Thousands of orders
Multiple vendors
Future payment gateways
Future courier integrations

without major redesign.

12. Out of Scope (Version 1)

The following features are intentionally excluded from Version 1 to keep the MVP focused and reduce complexity:

Customer accounts
Customer login
Customer sign-up
OTP verification
Password reset
Track Order functionality
Online payment gateway integration
Customer reviews and ratings
Wishlist
Inventory synchronization with vendors
Automatic WhatsApp group message import
AI-powered product recommendations
Loyalty points or rewards
Discount coupon system (can be added later if needed) 13. Success Criteria

The project will be considered successful when:

Customers can discover products easily.
Customers can place single-product and multi-product orders.
Every order receives a unique, secure public Order ID.
Orders are stored reliably in PostgreSQL via Supabase.
Selling prices are calculated automatically based on pricing rules.
Delivery charges are calculated automatically based on delivery rules.
The business owner can manage products, pricing, deliveries, and orders through the admin dashboard.
Vendors can access order details through secure links without requiring an account.
The interface reflects a premium, trustworthy fashion brand and matches the approved visual design.
Notes for the AI Development Agent
Do not invent business rules that are not explicitly documented.
Do not introduce customer authentication unless requested in a future version.
All pricing calculations must occur on the backend.
The frontend must never calculate or trust prices received from the client.
Security, simplicity, and maintainability take priority over adding features.
Every future implementation must follow the architecture and business workflow defined in this document.

I think this is an excellent foundation. It captures why the project exists, how the business operates today, what problems we're solving, what the target workflow is, and which features are intentionally out of scope. The next document—Complete User Stories—can build directly on this by specifying the behavior expected from each user role (Customer, Admin, and Vendor) in enough detail for an AI agent to implement without making assumptions.
