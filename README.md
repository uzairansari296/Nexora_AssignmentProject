# Vibe Commerce 🛒

A modern, full-stack e-commerce application with a shopping cart system, built with React and Node.js. This project demonstrates product browsing, cart management, and mock checkout functionality.

## 📸 Screenshots

### 🏠 Home Page - Product Catalog
![Product Catalog]
*Browse through our collection of products with a clean, responsive grid layout*

### 🛒 Shopping Cart
![Shopping Cart]
*Manage your cart items with real-time updates and total calculations*

### 💳 Checkout Process
![Checkout Page]
*Complete your purchase with our streamlined checkout form*

### 🧾 Order Receipt
![Order Receipt]
*Receive a detailed receipt with order summary and timestamp*


## 🚀 Features

### Frontend
- **Product Catalog**: Browse a collection of products with images and details
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Real-time Updates**: Cart total and item count update automatically
- **Responsive Design**: Mobile-friendly interface using Material-UI
- **Checkout Process**: Complete mock checkout with receipt generation
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Smooth loading indicators for better UX

### Backend
- **RESTful API**: Clean API endpoints for all operations
- **SQLite Database**: Persistent data storage with file-based SQLite
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Robust error handling and validation
- **Mock Data**: Pre-seeded with sample products

## 🛠 Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Modern React component library
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Context API** - Global state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📂 Project Structure

```
Vibe-Commerce/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server setup
│   │   ├── db.js              # Database configuration
│   │   ├── fakeStoreAPI.js    # Mock product data
│   │   └── utils.js           # Utility functions
│   ├── package.json
│   └── data.db                # SQLite database file
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # App entry point
│   ├── public/               # Static assets
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vibe-Commerce
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev    # Development with nodemon
   # or
   npm start      # Production mode
   ```
   The backend will run on `http://localhost:4000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📋 Available Scripts

### Backend Scripts
- `npm run dev` - Start development server with nodemon (auto-reload)
- `npm start` - Start production server
- `npm run seed` - Seed the database with sample data
- `npm test` - Run tests (placeholder)

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/cart` | Get cart items and total |
| `POST` | `/api/cart` | Add item to cart |
| `DELETE` | `/api/cart/:id` | Remove item from cart |
| `POST` | `/api/checkout` | Process checkout and clear cart |

### API Examples

```bash
# Get all products
curl http://localhost:4000/api/products

# Add item to cart
curl -X POST http://localhost:4000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "qty": 2}'

# Get cart contents
curl http://localhost:4000/api/cart

# Remove item from cart
curl -X DELETE http://localhost:4000/api/cart/1

# Checkout
curl -X POST http://localhost:4000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## ⚙️ Configuration

### Environment Variables

**Backend** (create `.env` in backend folder):
```env
PORT=4000
DATABASE_URL=./data.db
NODE_ENV=development
```

**Frontend** (create `.env` in frontend folder):
```env
VITE_API_BASE=http://localhost:4000
```

## 🎯 Key Features Explained

### Cart Management
- Add products with specified quantities
- Remove individual items
- Real-time total calculation
- Persistent cart data

### Product Display
- Grid layout with responsive design
- Product images, names, and prices
- Add to cart functionality with quantity selection

### Checkout Process
- Customer information form
- Order summary with itemized list
- Receipt generation with timestamp
- Cart clearing after successful checkout

## 🔧 Development

## 📝 Notes

- This is a **mock e-commerce application** - no real payments are processed
- Uses a single user session for simplicity
- SQLite database provides persistence between sessions
- All product data is mock data from a fake store API


## 👨‍💻 Author

Uzair

---

**Happy Shopping! 🛍️**
