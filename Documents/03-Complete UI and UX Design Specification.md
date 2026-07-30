Document 3
Complete UI/UX Design Specification
Al Ameen Collective
Version 2.0
UI/UX Design Specification
Table of Contents

1. Design Philosophy

2. Brand Identity

3. Color Palette

4. Typography

5. Icons

6. Buttons

7. Input Fields

8. Cards

9. Navigation

10. Homepage
    10.1 Announcement Ribbon
    10.2 Navigation Bar
    10.3 Hero Section
    10.4 Featured Products
    10.5 Footer

11. Catalog Page

12. Product Details Page

13. Shopping Cart

14. Checkout Page

15. Admin Login

16. Admin Dashboard

17. Vendor Portal

18. Responsive Design

19. Animations

20. Empty States

21. Loading States

22. Error Pages

23. Accessibility

24. Design Constraints
25. Design Philosophy

The website should communicate premium quality, trust, simplicity, and elegance. It should feel closer to a luxury clothing boutique than a marketplace.

Avoid clutter, unnecessary effects, or overly bright colors. Every element should have generous spacing, balanced typography, and subtle interactions.

The overall experience should feel calm, modern, and refined.

2. Brand Identity

Brand Name:

Al Ameen Collective

Brand Personality:

Elegant
Premium
Trustworthy
Minimal
Modern
Sophisticated
Warm

Customers should immediately feel they are shopping from a professional clothing brand.

3. Color Palette

The website should consistently use the following colors throughout the application.

Primary Background
#F8F3EC

Warm ivory.

Used on:

Main page backgrounds
Catalog
Product pages
Navigation Background
#DBB177

Exactly the same as the screenshots.

Primary Text
#510F17

Dark maroon.

Used for:

Headings
Product names
Prices
Navigation links
Secondary Text
#5F5F5F
Buttons

Primary Button

Background:
#510F17

Text:
White

Secondary Button

Background:
#DBB177

Text:
#510F17

Success

#25D366

Used only for WhatsApp.

Danger

#D32F2F

Used only inside Admin.

Border

#E4D8CA

Cards

White

Shadows

Very subtle.

No heavy shadows.

4. Typography

Headings

Playfair Display

Body

Inter

Buttons

Inter SemiBold

Prices

Inter Bold

Heading Sizes

Hero

60 px

Section

44 px

Subheading

28 px

Body

18 px

Small Text

14 px

5. Icons

Use only

Lucide Icons

No mixed icon libraries.

6. Buttons

Buttons should have:

Rounded corners

12 px

Height

48 px

Hover

Slight darkening

Scale

1.02

Animation

200ms

Primary Button

Dark maroon.

Secondary Button

Gold.

Disabled

Gray.

Loading

Spinner.

7. Inputs

Rounded

12px

Border

Light.

Focus

Gold outline.

Error

Red border.

Placeholder

Gray.

8. Product Cards

Exactly like the screenshots.

Every card contains

Large Image

Color Badge

Product Name

Fabric

Price

Add to Cart

Order Now

Shadow

Small.

Hover

Lift slightly.

Image Ratio

4:5

Card Radius

16px

Spacing

24px

9. Navigation Bar

Exactly like screenshot.

Height

80px

Sticky

Yes.

Background

Gold.

Logo

Left.

Center

Catalog

About

FAQs

Contact

Right

Search

Cart

No Track Order

No Sign In

Those features have been removed.

Admin login must not appear in the customer navigation bar.

10 Homepage
Announcement Ribbon

Black.

Height

44px

Center aligned.

Messages rotate automatically.

Slide animation.

Example

✨ New Summer Collection

🚚 Free Delivery Above Rs. 10,000

🌸 Premium Lawn Collection Available
Hero Section

Exactly like screenshot.

Large fabric background.

Light overlay.

Left aligned content.

Contains

Badge

Heading

Paragraph

Shop Catalog Button

No extra buttons.

Heading

Large serif typography.

Approximately 60px.

Button

Dark maroon.

Rounded.

Latest Arrivals

Three-column grid desktop.

Cards identical to catalog.

View All button.

Footer

Exactly same style as screenshot.

Contains

About

Quick Links

FAQs

Contact

WhatsApp Button

Remove

Track Order

Sign In

Shopping Cart

from quick links if unnecessary (Catalog and Contact are sufficient for MVP; Cart can remain if desired).

11 Catalog Page

Exactly same as screenshots.

Contains

Search

Filters

Product Grid

Responsive layout.

Search remains sticky while scrolling.

12 Product Details

Large Image

Gallery

Zoom on hover.

Description

Features

Fabric

Color Variants

Quantity Selector

Add To Cart

Order Now

Similar Products

13 Shopping Cart

Large clean layout.

Each row

Image

Name

Product ID

Price

Quantity

Remove

Subtotal

Summary card

Delivery

Total

Checkout Button

14 Checkout

Two-column desktop.

Left

Customer Information

Right

Order Summary

Customer Form

Name

Phone

Address

Optional Notes

Below

Ordered Products

Buttons

Order Summary

Delivery

Grand Total

Place Order

15 Admin Login

Separate route.

Not linked from customer website.

Simple centered login card.

Logo.

Username.

Password.

Remember Me.

Login.

16 Admin Dashboard

Modern SaaS dashboard.

Sidebar

Dashboard

Products

Orders

Profit

Delivery

Website Settings

Logout

Top Bar

Admin name.

Notifications.

Dashboard Cards

Products

Pending

Confirmed

Cancelled

Delivered

Tables

Modern.

Searchable.

Sortable.

Pagination.

17 Vendor Portal

Very minimal.

Single search field if using order lookup, or automatic display if using secure link.

Displays

Customer

Address

Products

Wholesale

Profit

Delivery

Read only.

No editing.

18 Responsive Design

Desktop

1920

1440

1366

Laptop

1024

Tablet

768

Mobile

390

Cards become

3

↓

2

↓

1

Navigation collapses into hamburger.

Buttons become full width on mobile where appropriate.

19 Animations

Only subtle animations.

Fade

Slide

Scale

Duration

150–250 ms

No flashy animations.

No parallax.

No unnecessary motion.

20 Empty States

Use elegant illustrations or icons.

Examples:

No Products

Empty Cart

No Search Results

No Orders

No Variants

Include a clear call-to-action (e.g., "Continue Shopping" or "Add Your First Product").

21 Loading States

Skeleton loaders.

Never blank pages.

Buttons show loading spinner.

22 Error Pages

404

Simple illustration.

Message.

Return Home.

500

Friendly message.

Retry.

23 Accessibility

Minimum WCAG AA contrast.

Keyboard accessible.

Visible focus states.

Semantic HTML.

Alt text on images.

ARIA labels where needed.

24 Design Constraints

The AI development agent must not redesign the website.

The screenshots supplied by the project owner are the visual reference and should be matched as closely as possible.

The following changes must be applied to the original design:

Remove Track Order from the navigation bar and footer.
Remove Sign In from the customer interface.
Preserve the premium color palette and typography.
Preserve the homepage structure and visual hierarchy.
Preserve the product card style.
Preserve the footer layout.
Preserve the elegant spacing and minimal aesthetic.
Ensure all new pages (Cart, Checkout, Admin, Vendor) follow the same design language.

No new colors, fonts, or UI patterns should be introduced unless explicitly approved.

One recommendation before Document 4

I would add an appendix called "Design Tokens & Component Library". It would define exact values for spacing (8px grid), border radii, shadows, z-index layers, button sizes, icon sizes, breakpoints, and reusable components. This ensures every page feels consistent and gives the AI a true design system to follow instead of repeating styling decisions independently for each page.
