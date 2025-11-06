Commodities Management System

A full-stack web application for managing products and monitoring profits, built with Node.js (Express) and a frontend hosted on Netlify.
Supports role-based access (Manager & Storekeeper) with session-based authentication.

Features

1. Login / Logout system (Manager & Storekeeper)

2. Product Management (Add, Edit, View)

3. Manager Dashboard (Total Products, Estimated Profit)

4. Dark / Light Mode toggle

5. Session persistence via cookies

6. Frontend hosted on Netlify & Backend on Render

Roles and Permissions

Role	             Access Description
Manager	           Can view dashboard, add/edit products
Storekeeper	       Can add/edit products (no dashboard access)

Default Credentials

Role	           Email	               Password
Manager	     manager@example.com        manager123
Storekeeper	 store@example.com        	store123

Technologies Used

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express

Hosting: Netlify (frontend), Render (backend)
