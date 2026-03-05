# Personal Book Manager

A modern, full-stack web application for managing your personal book collection. Built with Next.js, React, TypeScript, and MongoDB.

## Features

### 📚 Book Management
- **Add Books**: Easily add new books with title, author, status, and tags
- **Track Progress**: Categorize books as "Want to Read", "Reading", or "Completed"
- **Organize with Tags**: Add up to 5 tags per book for better organization
- **Edit & Delete**: Update book details or remove books from your collection

### 🔐 User Authentication
- **Secure Registration**: Create an account with email and password
- **Login System**: Secure authentication with JWT tokens
- **Session Management**: Automatic session handling with cookies
- **Protected Routes**: All book management features require authentication

### 🎨 Modern UI
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean Interface**: Minimalist design focused on usability
- **Interactive Elements**: Smooth animations and transitions
- **Dark/Light Theme Support**: Built with modern CSS-in-JS styling

## Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with server-side rendering
- **React 19.2.3** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - State management
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing and security
- **jose** - JWT token handling

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Type checking and development experience

## Project Structure

```
personal-book-manager/
├── app/                    # Next.js App Router structure
│   ├── (protected)/        # Protected routes requiring authentication
│   │   ├── layout.tsx      # Protected layout with header
│   │   └── library/        # Main library page
│   ├── (unauthenticated)/  # Public routes (auth pages)
│   │   └── auth/           # Login and registration
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   └── protected/      # Protected API endpoints
│   └── page.tsx           # Landing page
├── components/             # React components
│   ├── AddBook.tsx        # Add new book form
│   ├── BookCard.tsx       # Individual book display
│   ├── BookDetail.tsx     # Book detail view and editor
│   ├── Landing.tsx        # Public landing page
│   ├── Library.tsx        # Main library component
│   ├── LogoutButton.tsx   # Logout functionality
│   └── TabGroup.tsx       # Status filter tabs
├── hooks/                  # Custom React hooks
│   └── useBooks.ts        # Book management hooks
├── lib/                    # Shared utilities and types
│   ├── server/            # Server-side utilities
│   │   ├── jwt.ts         # JWT token handling
│   │   ├── middleware.server.ts # Authentication middleware
│   │   ├── mongodb.ts     # MongoDB connection
│   │   └── models/        # Database models
│   ├── shared/            # Shared types and interfaces
│   │   └── types/         # TypeScript type definitions
│   └── stores/            # State management stores
│       └── book.store.ts  # Book state management
├── public/                # Static assets
├── prisma/                # Database schema (if using Prisma)
├── .env                   # Environment variables
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies
└── README.md             # This file
```

## Installation

### Prerequisites
- Node.js (version 18 or higher)
- MongoDB Atlas account or local MongoDB instance

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd personal-book-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
   NODE_ENV="development"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit `http://localhost:3000`

## Usage

### Getting Started
1. **Create an Account**: Visit the registration page to create your account
2. **Login**: Use your credentials to access your personal library
3. **Add Books**: Click "Add a Book" to start building your collection
4. **Organize**: Use tags and status filters to organize your books

### Key Features

#### Adding Books
- **Title**: Maximum 500 characters
- **Author**: Maximum 200 characters
- **Status**: Choose from "Want to Read", "Reading", or "Completed"
- **Tags**: Add up to 5 tags per book (50 characters max per tag)

#### Managing Your Library
- **Filter by Status**: Use the tab interface to filter books by reading status
- **Edit Books**: Click on any book to edit its details
- **Delete Books**: Remove books you no longer want to track

#### Authentication
- **Secure Login**: Your data is protected with secure authentication
- **Session Management**: Stay logged in across browser sessions
- **Logout**: Secure logout functionality

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Protected Endpoints (require authentication)
- `GET /api/protected/books` - Get all user's books
- `POST /api/protected/books` - Add a new book
- `GET /api/protected/books/:id` - Get specific book by ID
- `PUT /api/protected/books/:id` - Update a book
- `DELETE /api/protected/books/:id` - Delete a book

## Development

### Code Style
The project uses ESLint for code linting. Run the following command to check for linting issues:
```bash
npm run lint
```

### Type Checking
TypeScript is used throughout the project. Run type checking with:
```bash
npx tsc --noEmit
```

### Building for Production
```bash
npm run build
npm start
```

## Database Schema

### Users Collection
```typescript
interface User {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Books Collection
```typescript
interface Book {
  _id: ObjectId;
  title: string;
  author: string;
  status: 'want' | 'reading' | 'completed';
  tags: string[];
  createdBy: ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}
```

## Security Features

- **Password Hashing**: All passwords are securely hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Client and server-side validation for all inputs
- **Protected Routes**: Authentication middleware protects all book management features
- **CORS Protection**: Proper CORS configuration for API security

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/personal-book-manager/issues) section
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## Future Enhancements

- [ ] Reading progress tracking
- [ ] Book ratings and reviews
- [ ] Reading statistics and insights
- [ ] Import/export functionality
- [ ] Book cover image support
- [ ] Reading challenges and goals
- [ ] Social features (sharing, recommendations)

---

**Built with ❤️ using Next.js and MongoDB**