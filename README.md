# Metro FE

A modern React TypeScript application for Metro services, built with Vite and styled with Tailwind CSS.

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

- Modern React 18 with TypeScript
- Responsive design with Tailwind CSS
- Authentication system with context management
- API integration with Axios
- React Query for efficient data fetching
- React Router for navigation
- Swiper.js for carousel components
- ESLint for code quality

## 🛠 Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **UI Components:** Swiper.js
- **Development:** ESLint, TypeScript
- **Deployment:** Vercel

## 📦 Prerequisites

Before running this project, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/hcmurs/metro-fe.git
cd metro-fe
```

2. Navigate to the app directory:
```bash
cd metro-app-fe
```

3. Install dependencies:
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

## 🏗 Build

To build the project for production:

```bash
cd metro-app-fe
npm run build
# or
yarn build
```

📁 Project Structure
Code
metro-app-fe/src/
├── App.tsx             # Main app component with routing and auth setup
├── App.css             # Global styles including Swiper customizations
├── main.tsx            # Entry point with React Query setup
├── apis/
│   ├── api.ts          # Axios config
│   ├── user.api.ts     # User-related API calls
│   └── order.api.ts    # Order/ticket API calls
├── contexts/
│   └── AuthContext     # Auth context
├── routes/
│   └── MainRoute       # Main routing component
├── queries/
│   └── useAuth.tsx     # Auth-related queries
├── types/
│   ├── api.type.ts     # API response types
│   ├── user.type.ts    # User, feedback, request types
│   ├── order.type.ts   # Order/transaction types
│   ├── ticket.type.ts  # Ticket status types
│   └── blog.type.ts    # Blog categories/tags
├── constants/
│   └── path.ts         # API path constants
└── pages/
    └── MetroMap/
        └── MetroMap.css    # Leaflet map styles

Key Technologies & Features
Frontend Framework: React with TypeScript
Build Tool: Vite
Routing: React Router DOM
State Management: React Query (@tanstack/react-query)
HTTP Client: Axios with interceptors
Styling: Tailwind CSS + custom CSS
Map Integration: Leaflet for metro map visualization
UI Components: Swiper for carousels
Main Modules
Authentication: User auth with context and API integration
Metro System: Orders, tickets, and metro map functionality
User Management: Registration, requests, and feedback
Blog System: Content management with categories and tags
Payment: Transaction handling for ticket orders

---

Built with ❤️ by the HCMURS team
