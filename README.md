# 🐾 Paw-fect Match

> A modern pet dating mobile application built with React Native and TypeScript. Connect with fellow pet parents and find the perfect playmate for your furry friend!

![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2050-black.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)

## 📱 About

Paw-fect Match is a pet dating application designed to help pet owners connect and arrange playdates for their pets. The app features a beautiful, modern UI with full dark mode support, secure authentication, and an intuitive profile management system.

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - JWT-based authentication with token management
- 👤 **User Profiles** - Complete profile setup with bio, interests, and contact info
- 🐕 **Pet Profiles** - Detailed pet information including breed, age, weight, and vaccination status
- 🌙 **Dark Mode** - Full dark theme support with seamless switching
- 🔄 **Real-time Updates** - Pull-to-refresh functionality
- 📱 **Responsive Design** - Optimized for all screen sizes

### User Experience
- Clean, modern interface with gradient designs
- Smooth animations and transitions
- Interactive chip-based interest selection
- Form validation with helpful error messages
- Loading states and activity indicators
- Pull-to-refresh on profile screen

## 🛠️ Technology Stack

### Frontend
- **React Native** (with Expo)
- **TypeScript** - Type-safe development
- **NativeWind** - Tailwind CSS for React Native
- **React Navigation** - Navigation and routing
- **Zustand** - State management
- **AsyncStorage** - Local data persistence

### Backend
- **Node.js** with Express
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Axios** - API communication

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **MongoDB** (local or Atlas account)
- **iOS Simulator** (Mac only) or **Android Studio** (for Android Emulator)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pawfect-match.git
cd pawfect-match
```

### 2. Install Frontend Dependencies

```bash
# Install dependencies
npm install

# Install additional packages
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-safe-area-context react-native-screens
npm install zustand axios react-native-toast-message
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
```

### 3. Configure NativeWind

Initialize Tailwind CSS:

```bash
npx tailwindcss init
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel"],
  };
};
```

Create `nativewind-env.d.ts`:

```typescript
/// <reference types="nativewind/types" />
```

### 4. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Update `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:19006
```

### 5. Configure Frontend Environment

Create `.env` in the root directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

For physical device testing, replace `localhost` with your computer's IP address:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.xxx:5000
```

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Application

```bash
# In the root directory
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

## 📁 Project Structure

```
pawfect-match/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── jwt.js
│   │   │   └── constants.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── pet.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   └── Pet.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── pet.routes.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   └── validators.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── src/
│   ├── components/
│   │   └── Navbar/
│   │       └── NavLayout.tsx
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── PublicNavigator.tsx
│   │   ├── RoleNavigator.tsx
│   │   ├── UserNavigator.tsx
│   │   └── CustomDrawerContent.tsx
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── Profile/
│   │   │   ├── UserProfileSetupScreen.tsx
│   │   │   ├── PetProfileSetupScreen.tsx
│   │   │   └── MyProfileScreen.tsx
│   │   ├── Matches/
│   │   │   ├── FindMatchesScreen.tsx
│   │   │   └── MyMatchesScreen.tsx
│   │   ├── Messages/
│   │   │   └── MessagesScreen.tsx
│   │   ├── Notifications/
│   │   │   └── NotificationsScreen.tsx
│   │   ├── Settings/
│   │   │   └── SettingsScreen.tsx
│   │   └── Support/
│   │       └── HelpSupportScreen.tsx
│   ├── state/
│   │   └── authStore.ts
│   ├── theme/
│   │   └── ThemeProvider.tsx
│   └── hooks/
│       └── useBackHandler.ts
├── App.tsx
├── index.js
├── tailwind.config.js
├── global.css
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### User Profile (Protected)
- `POST /user` - Create/update user profile
- `GET /user` - Get user profile

### Pet Profile (Protected)
- `POST /pet` - Create pet profile
- `GET /pet/single` - Get user's pet profile
- `GET /pet` - Get all user's pets
- `PUT /pet/:petId` - Update pet profile
- `DELETE /pet/:petId` - Delete pet profile

### Health Check
- `GET /health` - API health status

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (required, hashed),
  name: String,
  bio: String (max 300 chars),
  interests: [String],
  contactInfo: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Pet Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  petName: String (required),
  breed: String,
  gender: String (enum: ['Male', 'Female']),
  age: Number,
  weight: Number,
  vaccinated: Boolean,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Design System

### Color Palette

#### Light Mode
- **Primary**: Green (#10B981)
- **Background**: White (#FFFFFF)
- **Card Background**: Gray 50 (#F9FAFB)
- **Text**: Gray 900 (#111827)
- **Secondary Text**: Gray 600 (#4B5563)

#### Dark Mode
- **Primary**: Green (#059669)
- **Background**: Gray 900 (#111827)
- **Card Background**: Gray 800 (#1F2937)
- **Text**: White (#FFFFFF)
- **Secondary Text**: Gray 400 (#9CA3AF)

### Typography
- **Headings**: Bold, 20-32px
- **Body**: Regular, 14-16px
- **Captions**: 12px

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with configurable rounds
- **Protected Routes** - Middleware for authenticated endpoints
- **Input Validation** - Joi schemas for request validation
- **Rate Limiting** - Protection against brute force attacks
- **Helmet** - Security headers
- **CORS** - Configured cross-origin resource sharing
- **Environment Variables** - Sensitive data protection

## 📱 Application Screens

### Authentication Flow
1. **Login Screen** - Email and password authentication
2. **Register Screen** - New user registration

### Profile Setup Flow
1. **User Profile Setup** - Name, bio, interests, contact
2. **Pet Profile Setup** - Pet details and information

### Main Application
1. **My Profile** - View and edit user and pet profiles
2. **Find Matches** - Browse potential pet matches
3. **My Matches** - View matched pets
4. **Messages** - Chat with matches
5. **Notifications** - App notifications
6. **Settings** - App preferences
7. **Help & Support** - Support resources

## 🧪 Testing

### Run Frontend Tests
```bash
npm test
```

### Run Backend Tests
```bash
cd backend
npm test
```

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

1. Create Heroku app:
```bash
heroku create pawfect-match-api
```

2. Set environment variables:
```bash
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
```

3. Deploy:
```bash
git push heroku main
```

### Frontend Deployment

Build for production:
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build --platform all
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent formatting (use Prettier)
- Write descriptive commit messages

## 🐛 Known Issues

- None currently reported

## 📝 Future Enhancements

- [ ] Image upload functionality for profiles
- [ ] Real-time chat messaging
- [ ] Push notifications
- [ ] Location-based matching
- [ ] Advanced filtering options
- [ ] Pet playdate scheduling
- [ ] Review and rating system
- [ ] Social media integration
- [ ] In-app photo gallery
- [ ] Favorites/bookmarks feature

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@H4CK3R-CODING](https://github.com/H4CK3R-CODING)
- LinkedIn: [LinkedIn Link](https://www.linkedin.com/in/gaurav-rathour-85b878264/)
- Email: gauravrathour0786@gmail.com

## 🙏 Acknowledgments

- React Native Community
- Expo Team
- NativeWind Contributors
- All open-source contributors

## 📧 Support

For support, email support@pawfectmatch.com or open an issue in the GitHub repository.

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with 💚 for pet lovers everywhere** 🐾