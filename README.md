# InterviewPrep.AI Frontend

A modern, responsive React frontend for the InterviewPrep.AI platform, built with Vite, Chakra UI, TailwindCSS, and Firebase.

## 🚀 Features

- **Modern UI/UX**: Built with Chakra UI and TailwindCSS for beautiful, responsive design
- **Authentication**: Firebase Auth integration with Google/Facebook login
- **Backend Integration**: Full API integration with FastAPI backend
- **AI-Powered Interviews**: Real-time Gemini AI interview sessions
- **Resume Processing**: Upload and analyze resumes with AI
- **Interactive Feedback**: Detailed performance analysis and recommendations
- **Dark/Light Mode**: Theme switching with persistent preferences
- **Animations**: Smooth transitions with Framer Motion
- **Responsive Design**: Mobile-first approach with adaptive layouts

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Chakra UI** - Component library for UI
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Firebase** - Authentication and storage
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_API_VERSION=v1
   VITE_APP_NAME=InterviewPrep.AI
   VITE_APP_VERSION=1.0.0
   ```

4. **Firebase Configuration**
   Update `src/firebaseConfig.js` with your Firebase project credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

## 🚀 Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthModal.jsx   # Authentication modal
│   ├── Layout.jsx      # Main layout wrapper
│   ├── ResumeUpload.jsx # Resume upload component
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/             # Page components
│   ├── Home.jsx       # Landing page
│   ├── Dashboard.jsx  # User dashboard
│   ├── Interview.jsx  # Practice interview
│   ├── AIInterview.jsx # AI-powered interview
│   ├── Feedback.jsx   # Interview feedback
│   └── ResumeUpload.jsx # Resume upload page
├── services/          # API services
│   └── api.js        # Axios API client
├── config/           # Configuration
│   └── environment.js # Environment config
├── styles/           # Global styles
├── assets/           # Static assets
└── utils/            # Utility functions
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_API_VERSION` | API version | `v1` |
| `VITE_APP_NAME` | Application name | `InterviewPrep.AI` |
| `VITE_DEBUG` | Debug mode | `false` |

### API Integration

The frontend integrates with the FastAPI backend through the `src/services/api.js` module:

- **Authentication**: JWT token-based auth
- **Resume Processing**: Upload and analyze resumes
- **Interview Management**: Create and manage interview sessions
- **AI Integration**: Gemini AI for interview questions and evaluation
- **Feedback**: Detailed performance analysis

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password, Google, Facebook)
3. Enable Firestore Database
4. Enable Storage
5. Update `firebaseConfig.js` with your credentials

## 🎨 UI/UX Features

### Theme System
- Dark/Light mode toggle
- Consistent color scheme
- Responsive design
- Smooth animations

### Components
- **AuthModal**: Login/signup with Firebase
- **ResumeUpload**: Drag-and-drop file upload
- **Interview**: Interactive question answering
- **AIInterview**: Real-time AI conversation
- **Feedback**: Detailed performance analysis

### Animations
- Page transitions with Framer Motion
- Component animations
- Loading states
- Interactive hover effects

## 🔐 Authentication Flow

1. **Registration**: Email/password or social login
2. **Backend Sync**: Create user profile in backend
3. **JWT Token**: Store authentication token
4. **Protected Routes**: Redirect unauthenticated users
5. **Session Management**: Automatic token refresh

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive layouts for all screen sizes
- **Touch Friendly**: Optimized for touch interactions
- **Performance**: Optimized for mobile performance

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist` folder to your web server
3. Configure server for SPA routing

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Performance

- **Bundle Size**: Optimized with Vite
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient API response caching
- **Compression**: Gzip compression enabled

## 🔧 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check backend server is running
   - Verify API_BASE_URL in environment
   - Check CORS configuration

2. **Firebase Auth Issues**
   - Verify Firebase configuration
   - Check authentication providers enabled
   - Verify domain in Firebase console

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies installed

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in your environment file.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

---

**Built with ❤️ for InterviewPrep.AI**