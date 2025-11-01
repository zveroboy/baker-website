# Requirements

## First round discussion points

### General requirements

#### Models:
* User
  * Name
  * Email
  * Password
  * Role
  * Created At
  * Updated At
* Cake
  * Name
  * Description
  * Price
  * Picture
  * Category ID
  * Created At
  * Updated At
* Category
  * Name
  * Description
  * Created At
  * Updated At
* Properties
  * Name
  * Type
    * Number
    * Boolean
    * Select
    * Radio
  * Created At
  * Updated At
* FAQ
  * Question
  * Answer
  * Created At
  * Updated At
* Gallery
  * Picture
  * Description
  * Created At
  * Updated At
* Order
  * Name
  * Email
  * Phone
  * Message
  * Cake
  * Cake Properties (depends on the category)
  * Total Price
  * Status
  * Created At

### Public part
* Index Page. Static page.
* Cake Catalog. Products of the Catalog are editable by the admin. Each product should have a picture, a name, a description, a price, and a button to order the product. Cake can have sizes. The Catalog is paginated.
  * Cake Page. A user can order a cake by filling a form. As a spam protection, there should be a captcha.
* FAQ. Questions and answers are editable by the admin.
* Gallery. Pictures are editable by the admin.

### Admin part
* Login page.
* Dashboard.
* Cake Catalog.
* FAQ.
* Gallery.

### Tech stack

* General: Nx monorepo, @biomejs/biome, Husky
* Public Frontend: Astro, React (islands), Tailwind CSS, Shadcn UI
* Admin Frontend: React, Vite, Tailwind CSS, Shadcn UI
* Backend: NestJS (swc), Prisma, PostgreSQL
* Authentication: JWT
* File Storage: AWS S3 (for images)
* Monitoring: Prometheus, Grafana (to be added later)
* Logging: Pino
* Testing: Vitest
* Deployment: GitHub Actions, Docker Compose
* UI Development: v0.dev (for rapid component creation)

## Second round discussion points

### Business Domain Analysis: Baker Personal Website

#### Missing Business Domain Elements 🔍

##### 1. **Order Management Enhancements**
- **Order Items**: Currently, orders seem to support only one cake. Most bakeries need multiple items per order
  Comment: Keep the technical ability to add multiple cakes to an order for future. However let's keep it possible to order only one cake for now.
- **Delivery/Pickup Details**: When and how will customers receive their order?
  Comment: As you suggested, we will have a pickup and delivery options.
- **Payment Status**: Is the order paid, pending, or requires deposit?
  Comment: As all orders are required to be paid, we will have a paid and unpaid orders.
- **Order Timeline**: When was it confirmed, started, completed?
  Comment: As you suggested, we will have a confirmed, started, completed and cancelled order statuses.

##### 2. **Pricing & Inventory**
Comment: We use weight to calculate the price of the cake. All your suggestions are optional and valid for future.
- **Property-based Pricing**: Size and decorations typically affect price
- **Seasonal Pricing**: Holiday surcharges
- **Availability Status**: Is this cake currently offered?
- **Lead Time**: How many days in advance must it be ordered?

##### 3. **Customer Relationship**
- **Customer Model**: Track repeat customers
  Comment: We will have a customer model for future.
- **Order History**: Help returning customers reorder favorites
  Comment: We will have a order history for future.
- **Communication Log**: Track customer interactions about orders
  Comment: We will have a communication log for future.

##### 4. **Business Operations**
- **Business Info**: Store hours, location, policies
  Comment: We will have a business info for future.
- **Blackout Dates**: When orders can't be accepted
  Comment: We will have a blackout dates for future.
- **Capacity Management**: Max orders per day
- **Ingredients/Allergens**: Critical for food businesses


## Third round discussion points

1. **Weight-based pricing**: Let's start from a simple version meaning Properties don't affect the price

2. **Allergens**: Let's add allergens as a dictionary (enum) and add it to the cake model as a multiple select field.

3. **Payment flow**: Payment is done outside of the system.

4. **Order statuses**: Just to confirm the flow - is it:
   - New order → Confirmed (by admin) → Started (baking) → Ready → Picked up/Delivered → Completed
   - Where does "cancelled" fit: only admin

5. **Delivery details**: For delivery orders, we need delivery address fields, delivery fee and delivery time slot. Delivery fee and delivery time slot is set by the admin before transition to the "Confirmed" status.


## Fourth round discussion points

1. We don't need product properties anymore.
2. Product Categories has tree structure. Update the model accordingly.
3. For products with per_kilo pricing, we need to add a Minimal weight field. During the order placement, the customer can select the weight more than the minimal weight. The weight step is 0.5 kg.
If the customer selects the weight less than the minimal weight, the app should show an error message.
4. For products with per_item pricing, we need to add a finite number of set items: 6, 12, 18. If the customer selects the number of items, the price will be calculated based on the number of items. If the customer beyond the set items, the app should show an error message.