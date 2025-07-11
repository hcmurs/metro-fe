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

## 📁 Project Structure

```
metro-fe/
├── metro-app-fe/
│   ├── src/
│   │   ├── apis/          # API configuration and calls
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── routes/        # Application routing
│   │   ├── constants/     # Application constants
│   │   ├── App.tsx        # Main App component
│   │   ├── main.tsx       # Application entry point
│   │   └── App.css        # Global styles
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   ├── vite.config.ts     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── eslint.config.js   # ESLint configuration
│   └── .env.sample        # Environment variables template
└── README.md
```

## 🔑 Key Features

### Authentication
- Context-based authentication system
- Protected routes
- User session management

### API Integration
- Axios-based API client with interceptors
- Environment-specific API endpoints
- Error handling and response management

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Custom breakpoints for different screen sizes
- Swiper.js integration for touch-friendly carousels

### Development Experience
- Hot module replacement with Vite
- TypeScript for type safety
- ESLint for code quality
- React Query for efficient data fetching

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ by the HCMURS team
