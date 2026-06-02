# M3allem Graduation Project - Angular Architecture

## Project Structure Overview

### Core Module (`src/app/core/`)

- **services/**: Singleton services (API, Auth, etc.)
- **interceptors/**: HTTP interceptors (authentication, error handling)
- **guards/**: Route guards (CustomerGuard, WorkerGuard, AdminGuard)
- **models/**: TypeScript interfaces and models
- **auth/**: Authentication-related logic

### Shared Module (`src/app/shared/`)

- **components/**: Reusable components (Navbar, Footer, Sidebar, Notification, Chat)
- **directives/**: Custom Angular directives
- **pipes/**: Custom Angular pipes
- **ui/**: UI/utility components

### Layouts (`src/app/layouts/`)

- **public-layout/**: Layout for unauthenticated routes (login, register)
- **user-layout/**: Layout for authenticated user routes
- **admin-layout/**: Layout for admin routes

### Features (`src/app/features/`)

Lazy-loaded feature modules:

- **home/**: Home page
- **auth/**: Login/Register/Logout
- **services/**: Service listings and management
- **workers/**: Workers directory and management
- **profile/**: User profile management
- **notifications/**: Notification system
- **chat/**: Real-time chat functionality
- **rewards/**: Rewards and points system
- **tasks/**: Task management
- **customer/**: Customer-specific features
- **worker/**: Worker-specific features
- **admin/**: Admin dashboard and management

## Architecture Principles

✅ **Modular**: Feature modules are lazy-loaded for better performance
✅ **Scalable**: Clear separation of concerns (core, shared, features)
✅ **Maintainable**: Organized folder structure for easy navigation
✅ **Secure**: Route guards for role-based access control
✅ **Reusable**: Shared components and services across modules

## Route Guards

- **CustomerGuard**: Protects customer-specific routes
- **WorkerGuard**: Protects worker-specific routes
- **AdminGuard**: Protects admin-specific routes

## Shared Components

- **Navbar**: Main navigation component
- **Footer**: Footer component
- **Sidebar**: Side navigation
- **Notification**: User notifications
- **Chat**: Real-time chat interface

## Next Steps

1. Generate actual component templates (TS, HTML, SCSS/CSS)
2. Implement service layer and API integration
3. Configure HTTP interceptors for authentication
4. Implement route guards logic
5. Create feature-specific components
6. Add styling and responsive design
