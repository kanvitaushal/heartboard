# 🎁 Heartboard - Gift Giving App

A beautiful, vintage-styled gift-giving application with a dark red theme and scrapbook aesthetic. Built with React frontend and Node.js/Express backend.

## ✨ Features

- **🎨 Vintage Design**: Dark red theme with Playfair Display and Times New Roman fonts
- **👥 User Authentication**: Email/password registration and login
- **📅 Event Management**: Create and manage gift-giving events
- **🎁 Gift Tracking**: Add gifts with prices, links, and completion status
- **📊 Real-time Updates**: Live data synchronization
- **🔒 Secure Backend**: JWT authentication and MongoDB database
- **📱 Responsive Design**: Works on desktop and mobile
- **🎯 Collaborative**: Share events with friends and family

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd heartboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `config.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/heartboard

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5174
```

### 3. Frontend Setup

```bash
cd ..
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access the App

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Routing**: React Router

### Backend (Node.js/Express)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Validation**: Built-in Mongoose validation
- **CORS**: Enabled for frontend communication

### Database Models
- **User**: Authentication and profile data
- **Event**: Gift-giving events with sharing capabilities
- **Gift**: Individual gift items with tracking

## 📁 Project Structure

```
heartboard/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── services/          # API services
│   └── ...
├── backend/               # Node.js/Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── ...
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/share` - Share event

### Gifts
- `GET /api/gifts/event/:eventId` - Get gifts for event
- `POST /api/gifts` - Add new gift
- `PUT /api/gifts/:id` - Update gift
- `DELETE /api/gifts/:id` - Delete gift
- `PATCH /api/gifts/:id/toggle` - Toggle gift completion

## 🎨 Design Features

- **Vintage Aesthetic**: Dark red color scheme with elegant typography
- **Scrapbook Feel**: Paper-like elements and decorative borders
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Framer Motion for delightful interactions
- **Custom Scrollbars**: Styled scrollbars matching the theme

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set up MongoDB Atlas for cloud database
2. Configure environment variables
3. Deploy to your preferred platform

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to your platform
3. Configure environment variables for API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MongoDB is running
3. Ensure all environment variables are set
4. Check that both frontend and backend are running

---

**Made with ❤️ for gift-giving enthusiasts everywhere!**
