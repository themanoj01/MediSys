# MediSys Hospital Management System Frontend

A frontend application for MediSys, an Australian hospital, built with React and Tailwind CSS.

## Project Overview

This project is a static frontend application for a hospital management system. It includes various pages such as:

- Home page
- About page
- Services page
- Doctors listing and details
- Appointment booking
- Admin dashboard
- Doctor dashboard
- FAQs
- Contact page
- Authentication (Login/Register)
- Patient bookings and profile

## Technology Stack

- React.js
- JavaScript (JSX)
- Tailwind CSS for styling
- Wouter for routing
- Lucide React for icons

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   └── ui/
│       ├── BadgeComponent.jsx
│       ├── BookingTable.jsx
│       ├── DoctorCard.jsx
│       ├── FAQItem.jsx
│       ├── ServiceCard.jsx
│       └── ...
├── lib/
│   ├── data.js        # Data for frontend display (static)
│   └── utils.js       # Utility functions
├── pages/
│   ├── About.jsx
│   ├── AdminDashboard.jsx
│   ├── Appointment.jsx
│   ├── Contact.jsx
│   ├── DoctorDashboard.jsx
│   ├── DoctorDetail.jsx
│   ├── Doctors.jsx
│   ├── Faqs.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── MyBookings.jsx
│   ├── NotFound.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   └── Services.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```

## Features

- Responsive design for all device sizes
- Interactive components like appointment booking
- Admin and doctor dashboards for management
- Patient booking system
- Doctor profiles and department information
- Contact form and FAQs

## Backend Integration

This is a frontend-only application designed to be integrated with a Spring Boot backend. The frontend components are built to easily connect with RESTful APIs.

## License

This project is licensed under the MIT License - see the LICENSE file for details.