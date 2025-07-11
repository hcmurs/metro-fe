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

metro-app-fe/
├── public/
├── src/
│   ├── apis/
│   ├── components/
│   ├── constants/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── queries/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── eslint.config.js
├── package.json
└── .env.sample

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
