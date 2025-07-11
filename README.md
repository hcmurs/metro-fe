# Metro FE

A modern React TypeScript application for Metro services, built with Vite and styled with Tailwind CSS. This is a comprehensive metro transit system management platform featuring user authentication, ticket booking, route management, and administrative controls.

## 🚀 Live Demo

[Visit the live application](https://metro-fe.vercel.app/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Build](#build)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- **Modern React 18 with TypeScript** - Type-safe development
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Authentication System** - Complete user auth with context management
- **Metro Map Integration** - Interactive map with Leaflet for route visualization
- **Ticket Management** - Purchase, view, and manage metro tickets
- **Admin Dashboard** - Comprehensive admin panel for system management
- **Blog System** - News and updates with categories and tags
- **Payment Integration** - VNPay and PayPal payment gateways
- **Real-time Data** - React Query for efficient data fetching and caching
- **Route Planning** - Station-to-station route planning and scheduling

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Map Integration:** Leaflet
- **UI Components:** Swiper.js
- **Charts:** Recharts for admin dashboard
- **Development:** ESLint, TypeScript
- **Deployment:** Vercel

## 📦 Prerequisites

Before running this project, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/hcmurs/metro-fe.git
cd metro-fe
```

2. **Navigate to the app directory:**
```bash
cd metro-app-fe
```

3. **Install dependencies:**
```bash
npm install
# or
yarn install
```

## 🔧 Environment Variables

Create a `.env` file in the `metro-app-fe` directory based on `.env.sample`:

```env
VITE_POCKET_BASE_DEV_URL=your_dev_api_url
VITE_POCKET_BASE_PROD_URL=your_prod_api_url
VITE_POCKET_BASE_SUPERUSER_EMAIL=your_superuser_email
VITE_POCKET_BASE_SUPERUSER_PASSWORD=your_superuser_password
```

## 💻 Development

To start the development server:

```bash
cd metro-app-fe
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build

To build the project for production:

```bash
cd metro-app-fe
npm run build
# or
yarn build
```

## 📁 Project Structure

```
metro-fe/
├── metro-app-fe/
│   ├── public/
│   │   └── hurc.png                    # App favicon
│   ├── src/
│   │   ├── App.tsx                     # Main app component with routing and auth setup
│   │   ├── App.css                     # Global styles including Swiper customizations
│   │   ├── main.tsx                    # Entry point with React Query setup
│   │   ├── index.css                   # Tailwind CSS imports
│   │   │
│   │   ├── apis/                       # API configuration and services
│   │   │   ├── api.ts                  # Axios config with interceptors
│   │   │   ├── user.api.ts             # User-related API calls
│   │   │   ├── order.api.ts            # Order/ticket API calls
│   │   │   └── blog.api.ts             # Blog and news API calls
│   │   │
│   │   ├── contexts/                   # React contexts
│   │   │   └── AuthContext.tsx         # Authentication context provider
│   │   │
│   │   ├── routes/                     # Application routing
│   │   │   └── MainRoute.tsx           # Main routing component with protected routes
│   │   │
│   │   ├── layouts/                    # Layout components
│   │   │   ├── DefaultLayout/          # Default page layout
│   │   │   └── HeaderLayout/           # Layout with header navigation
│   │   │
│   │   ├── pages/                      # Page components
│   │   │   ├── Home/                   # Landing page
│   │   │   ├── Login/                  # Authentication pages
│   │   │   ├── Register/
│   │   │   ├── Profile/                # User profile management
│   │   │   ├── BuyTicket/              # Ticket purchasing flow
│   │   │   ├── MyTickets/              # User ticket management
│   │   │   ├── Order/                  # Order processing
│   │   │   ├── PaymentSuccess/         # Payment confirmation
│   │   │   ├── MetroMap/               # Interactive metro map
│   │   │   │   ├── MetroMap.tsx
│   │   │   │   └── MetroMap.css        # Leaflet map styles
│   │   │   ├── Blogs/                  # News and blog listing
│   │   │   ├── BlogsDetail/            # Individual blog post view
│   │   │   ├── ManageFeedback/         # User feedback management
│   │   │   └── admin/                  # Admin panel
│   │   │       ├── Admin.tsx           # Admin layout and navigation
│   │   │       └── components/
│   │   │           ├── Dashboard/      # Admin dashboard with analytics
│   │   │           ├── User/           # User management
│   │   │           ├── Station/        # Station management
│   │   │           │   └── README.md   # Station component documentation
│   │   │           ├── Feedback/       # Feedback management
│   │   │           ├── Request/        # User request management
│   │   │           └── Ticket/         # Ticket management
│   │   │
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── ui/                     # Basic UI components
│   │   │   ├── forms/                  # Form components
│   │   │   ├── navigation/             # Navigation components
│   │   │   └── charts/                 # Chart components for admin
│   │   │
│   │   ├── hooks/                      # Custom React hooks
│   │   │   ├── useAuth.tsx             # Authentication hooks
│   │   │   └── useApi.tsx              # API interaction hooks
│   │   │
│   │   ├── queries/                    # React Query hooks
│   │   │   ├── useAuth.tsx             # Auth-related queries
│   │   │   ├── useTickets.tsx          # Ticket-related queries
│   │   │   └── useBlogs.tsx            # Blog-related queries
│   │   │
│   │   ├── types/                      # TypeScript type definitions
│   │   │   ├── api.type.ts             # API response types
│   │   │   ├── user.type.ts            # User, feedback, request types
│   │   │   ├── order.type.ts           # Order/transaction types
│   │   │   ├── ticket.type.ts          # Ticket status types
│   │   │   ├── blog.type.ts            # Blog categories/tags
│   │   │   └── station.type.ts         # Metro station and route types
│   │   │
│   │   ├── constants/                  # Application constants
│   │   │   ├── path.ts                 # API path constants
│   │   │   ├── routes.ts               # Frontend route constants
│   │   │   └── config.ts               # App configuration
│   │   │
│   │   └── utils/                      # Utility functions
│   │       ├── helpers.ts              # General helper functions
│   │       ├── formatters.ts           # Data formatting utilities
│   │       └── validators.ts           # Form validation utilities
│   │
│   ├── index.html                      # HTML entry point
│   ├── vite.config.ts                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── tsconfig.app.json               # App-specific TypeScript config
│   ├── tsconfig.node.json              # Node-specific TypeScript config
│   ├── eslint.config.js                # ESLint configuration
│   ├── package.json                    # Dependencies and scripts
│   ├── .env.sample                     # Environment variables template
│   └── README.md                       # Vite template documentation
│
└── README.md                           # Main project documentation
```

## 🏗️ Key Technologies & Features

### **Frontend Framework**
- React 18 with TypeScript for type-safe development
- Vite for fast development and building

### **Routing & State Management**
- React Router DOM for navigation
- React Query (@tanstack/react-query) for server state management
- Context API for authentication state

### **Styling & UI**
- Tailwind CSS for utility-first styling
- Custom CSS for component-specific styles
- Swiper.js for interactive carousels
- Recharts for admin dashboard analytics

### **Map Integration**
- Leaflet for interactive metro map visualization
- Custom markers and route visualization

### **API Integration**
- Axios with interceptors for HTTP requests
- Automatic token handling and error management
- RESTful API integration with backend services

## 🎯 Main Modules

### **Authentication System**
- User registration and login
- Context-based authentication state
- Protected routes and role-based access
- Session management with automatic token refresh

### **Metro System**
- Interactive metro map with station information
- Route planning and scheduling
- Real-time station information and schedules
- Direction-based route visualization

### **Ticket Management**
- Ticket purchasing with multiple payment options
- Ticket history and status tracking
- QR code generation for tickets
- Fare calculation based on routes

### **Payment Integration**
- VNPay payment gateway for Vietnamese users
- PayPal integration for international payments
- Order processing and confirmation
- Payment history tracking

### **Admin Dashboard**
- User management and analytics
- Station and route management
- Ticket sales analytics with charts
- Feedback and request management
- Content management for blogs

### **Blog System**
- News and updates with rich content
- Category-based organization
- Tag system for content discovery
- Comment system and view tracking

## 🚀 Available Scripts

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the HCMURS organization. Please refer to the organization's licensing terms.

## 📞 Support

For support and questions, please contact the HCMURS development team.

---

**Built with ❤️ by the HCMURS team**
