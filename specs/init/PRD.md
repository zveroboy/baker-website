# Product Requirements Document (PRD)

## Overview
A personal bakery website with public storefront and admin management system. The platform supports both cakes (sold by weight/kilo) and pastries (sold per item) with a flexible pricing model.

## Data Models

### User
- Name
- Email  
- Password
- Role (admin/staff)
- Created At
- Updated At

### Category
- Name
- Description
- Parent Category ID (nullable - for tree structure)
- Created At
- Updated At

### Product (Cakes & Pastries)
- Name
- Description
- Pricing Type (per_kilo/per_item)
- Price (per kilo for cakes, per item for pastries)
- Minimum Weight (for per_kilo products, in kg)
- Available Quantities (for per_item products: 6, 12, 18)
- Picture
- Category ID
- Allergens (multiple select from enum)
- Is Available (boolean)
- Created At
- Updated At


### Order
- Order Number
- Customer Name
- Customer Email
- Customer Phone
- Message
- Product ID
- Quantity (weight in kg for cakes with 0.5kg steps, units for pastries: 6/12/18)
- Total Price
- Status (new/confirmed/started/ready/delivered/completed)
- Is Cancelled (boolean)
- Cancelled At (timestamp, nullable)
- Cancellation Reason (text, nullable)
- Delivery Type (pickup/delivery)
- Pickup Date/Time (if pickup)
- Delivery Date/Time (if delivery)
- Delivery Address (if delivery)
- Delivery Fee (if delivery, set by admin)
- Delivery Time Slot (if delivery, set by admin)
- Created At
- Updated At

### FAQ
- Question
- Answer
- Order (for sorting) [default: 100]
- Created At
- Updated At

### Gallery
- Picture
- Title
- Description
- Order (for sorting)
- Created At
- Updated At

### Allergen (Enum/Dictionary)
- Gluten
- Dairy
- Eggs
- Nuts
- Soy
- Others as needed

## Public Features

### Homepage
- Static content about bakery
- Featured products
- Contact information
- Links to catalog, gallery, FAQ

### Product Catalog
- Grid view with pagination
- Category filtering
- Each product shows: picture, name, description, price (with unit: per kg/per item), allergens
- "Order" button leads to order form

### Order Form
- Customer details (name, email, phone)
- Product selection (pre-selected if coming from catalog)
- Quantity input:
  - For per_kilo: weight selector with 0.5kg steps (minimum as configured)
  - For per_item: dropdown with available quantities (6, 12, or 18)
- Delivery type selection (pickup/delivery)
- Delivery address (if delivery selected)
- Preferred date/time
- Special message
- Total price display (auto-calculated)
- CAPTCHA for spam protection
- Order submission creates order with "new" status

### FAQ Page
- Accordion-style Q&A display
- Sorted by admin-defined order

### Gallery
- Image grid with lightbox
- Sorted by admin-defined order

## Admin Features

### Authentication
- Login page with email/password
- JWT-based session management
- Protected admin routes

### Dashboard
- Recent orders summary
- Orders by status
- Quick actions

### Order Management
- List all orders with filters (status, date, cancelled/active)
- View order details
- Update order status
- Add delivery fee and time slot when confirming
- Cancel orders (sets is_cancelled flag, preserves current status)

### Product Management
- CRUD operations
- Pricing type selection (per_kilo/per_item)
- Price input with appropriate unit label
- For per_kilo products: set minimum weight
- For per_item products: select available quantities (6, 12, 18)
- Image upload to S3
- Allergen selection
- Availability toggle
- Category assignment (with tree navigation)

### Category Management
- CRUD operations
- Parent category selection (tree structure)
- View category hierarchy


### FAQ Management
- CRUD operations
- Reorder items

### Gallery Management
- Upload images to S3
- Add titles/descriptions
- Reorder items

## Pricing Logic
- **Per Kilo Products (Cakes)**: 
  - Customer selects weight in 0.5kg increments (minimum weight enforced)
  - Total = weight × price per kilo
- **Per Item Products (Pastries)**: 
  - Customer selects from available quantities (6, 12, or 18 items)
  - Total = quantity × price per item
- **Delivery Fee**: Added by admin when confirming orders with delivery

## Business Rules
- **Weight Selection**: Customers can only select weights in 0.5kg increments
- **Minimum Weight**: Each per_kilo product has a minimum weight requirement
- **Quantity Restrictions**: Per_item products limited to 6, 12, or 18 items only
- **Category Hierarchy**: Categories can be nested for better organization (e.g., Cakes > Wedding Cakes)

## Order Workflow
1. Customer submits order → Status: "new"
2. Admin reviews and confirms → Status: "confirmed" (adds delivery fee/time if needed)
3. Baker starts preparation → Status: "started"
4. Order ready for pickup/delivery → Status: "ready"
5. Customer receives order → Status: "delivered" (or "picked up")
6. Order complete → Status: "completed"

**Cancellation**: Admin can cancel at any time by setting is_cancelled = true (preserves current status for reporting)

## Technical Requirements
- Payment processing handled externally
- Mobile-responsive design
- SEO-optimized public pages
- Secure admin authentication
- Form validation and sanitization

## Future Enhancements
- Multiple products per order
- Customer accounts and order history
- Automated email notifications
- Seasonal pricing
- Business hours and blackout dates
- Inventory tracking
- Advanced analytics
- Custom product attributes/properties
- More flexible quantity options
