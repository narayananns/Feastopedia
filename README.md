# FeastoPedia - Food Fetching Platform 🍔

FeastoPedia is a full-stack web application designed for browsing, ordering, and managing food dishes. It features separate interfaces for regular users and administrators, complete with authentication, dish management, and email notifications.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT.
- **Role-Based Access Control**:
  - **User**: Browse dishes, view details, search/filter by category.
  - **Admin**: Dashboard to manage dishes (Create, Read, Update, Delete), manage users.
- **Dish Management**: 
  - Categorized dishes (Appetizer, Main Course, Dessert, etc.).
  - Detailed views for each dish.
- **Search & Filter**: Find dishes easily by name or category.
- **Email Notifications**: Integrated with Brevo for sending transactional emails (e.g., welcome emails, order confirmations).
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on all devices.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Axios** (for API requests)
- **Lucide React** (icons)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** (with Mongoose)
- **Brevo** (formerly Sendinblue) for email services
- **JWT** (JSON Web Tokens) for authentication
- **Bcrypt.js** for password hashing

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (running locally or a cloud instance)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/feastopedia.git
   cd feastopedia
   ```

2. **Install dependencies**
   Since the project uses a single `package.json` for both frontend and backend dependencies:
   ```bash
   npm install
   ```
   
   *Data Initialization (Optional):*
   To initialize the database with some data or create an admin user, run:
   ```bash
   node server/scripts/initDb.js
   node server/scripts/makeAdmin.js
   ```

## 🔧 Configuration

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-platform

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=no-reply@feastopedia.com
```

## 🏃‍♂️ Running the Application

This project is set up to run both frontend and backend concurrently or separately.

### Development Mode

1. **Start the Backend Server**
   ```bash
   npm run dev:server
   ```
   Server runs on `http://localhost:5000`

2. **Start the Frontend (Vite)**
   Open a new terminal:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Production Build

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Start the Server**
   ```bash
   npm run server
   ```

## 📂 Project Structure

```
├── public/              # Static assets
├── server/              # Backend logic
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── services/        # External services (Email)
├── src/                 # Frontend source
│   ├── components/      # Reusable components
│   ├── contexts/        # React Context (Auth)
│   ├── pages/           # Page views
│   └── utils/           # Utilities & constants
├── index.html           # HTML entry point
├── package.json         # Project dependencies & scripts
├── tailwind.config.js   # Tailwind configuration
└── vite.config.ts       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
