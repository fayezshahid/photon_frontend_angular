# Photon Frontend
Angular-based frontend for the Photon photo management platform. Features dynamic client-side interactions for favoriting, archiving, and sharing photos with real-time updates through RESTful APIs.

## 🛠️ Technologies Used
- **Angular 18** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **JWT (JSON Web Tokens)** - Authentication handling

## 🚀 Getting Started

### Prerequisites
1. **Install Node.js and npm**
   - Download from [https://nodejs.org/](https://nodejs.org/)
   - Verify installation: `node -v` and `npm -v`

2. **Install Angular CLI**
   ```bash
   npm install -g @angular/cli
   ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fayezshahid/photon-frontend.git
   cd photon-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Update `src/environments/environment.ts`:
   
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'http://localhost:8080/api',
     imageUploadUrl: 'http://localhost:8080/images'
   };
   ```

4. **Start Development Server**
   ```bash
   ng serve
   ```

5. **Access the application**
   - Frontend Application: `http://localhost:4200`

## 🎯 Features
- **JWT Authentication**: Secure token-based authentication handling
- **Dynamic Interactions**: Favorite, archive, and share photos without page reloads
- **Real-time Photo Management**: Upload, organize, and manage photos
- **Type Safety**: Full TypeScript implementation for robust development

## 📁 Project Structure
```
photon-frontend/
│
├── src/
│   ├── app/
│   │   ├── components/   # Angular components
│   │   ├── services/     # HTTP services
│   │   ├── models/       # TypeScript interfaces
│   │   ├── guards/       # Route guards
│   │   ├── utils/        # Utility functions
│   │   └── interceptors/ # HTTP interceptors
│   ├── assets/          # Static assets
│   └── environments/    # Environment configs
├── angular.json
└── package.json
```

## 🔧 Development Commands
```bash
# Start development server
ng serve

# Build for production
ng build --prod

# Run tests
ng test

# Run linting
ng lint

# Generate component
ng generate component component-name

# Generate service
ng generate service service-name
```

## 🔐 Security Features
- **JWT Token Management**: Automatic token handling and refresh
- **Route Guards**: Protected routes with authentication checks
- **HTTP Interceptors**: Automatic token attachment to requests
- **Input Validation**: Client-side form validation

## 📚 API Integration
The frontend communicates with the Photon backend through RESTful APIs:
- Authentication endpoints for login/logout
- Photo management endpoints for CRUD operations
- User management for profile operations

Make sure the backend server is running on `http://localhost:8080` before starting the frontend development server.

## 🚀 Deployment
1. **Build the application**
   ```bash
   ng build --prod
   ```

2. **Deploy the `dist/` folder** to your web server or hosting service

## 📝 Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request