# RBAC (Role-Based Access Control) System

A comprehensive backend system implementing role-based access control with TypeScript, Express, and Prisma. The system manages user authentication and authorization through a hierarchical permission structure.

## Key Components Used

### 1. Authentication System
- **JWT (JSON Web Tokens)**
  - Access tokens with 15-minute expiry
  - Refresh tokens for extended sessions
  - Secure token storage and validation
  - Token blacklisting for logout

- **Password Security**
  - Bcrypt hashing with salt rounds
  - Password strength validation
  - Secure reset mechanism
  - Rate limiting on auth endpoints

- **Email System**
  - Verification emails for new accounts
  - Password reset notifications
  - HTML email templates
  - SMTP configuration with nodemailer

### 2. Role Management
- **Three-tier Role System**
  - `ADMIN`
    - Full system access
    - User management capabilities
    - System configuration access
    - Analytics and logs access
  
  - `MODERATOR`
    - Limited administrative access
    - Content management
    - User monitoring
    - Report generation
  
  - `USER`
    - Basic access rights
    - Profile management
    - Standard feature access

- **Role Assignment Features**
  - Dynamic role updates
  - Role hierarchy enforcement
  - Audit logging for role changes
  - Role-based route protection

### 3. Permission System
- **Granular Controls**
  - Individual permission assignments
  - Permission grouping
  - Inheritance structure
  - Override capabilities

- **Permission Types**  ```typescript
  enum Permission {
    READ_USERS = 'READ_USERS',
    WRITE_USERS = 'WRITE_USERS',
    DELETE_USERS = 'DELETE_USERS',
    MANAGE_ROLES = 'MANAGE_ROLES',
    ACCESS_ADMIN_PANEL = 'ACCESS_ADMIN_PANEL',
    ACCESS_MODERATOR_PANEL = 'ACCESS_MODERATOR_PANEL'
  }  ```

### 4. Database Architecture
- **PostgreSQL Schema**  ```prisma
  model User {
    id                     Int              @id @default(autoincrement())
    username               String           @unique
    email                  String           @unique
    password              String    
    firstname             String
    lastname              String
    role                   Role             @default(USER)
    refreshToken          String?
    emailVerificationToken String?
    emailVerificationExpires DateTime?
    isEmailVerified       Boolean          @default(false)
    resetPasswordToken    String?
    resetPasswordExpires  DateTime?
    userPermissions       UserPermission[]
    createdAt             DateTime         @default(now())
    updatedAt             DateTime         @updatedAt
  }

  model Permission {
    id              Int              @id @default(autoincrement())
    name            String           @unique
    description     String?
    userPermissions UserPermission[]
  }

  model UserPermission {
    id           Int        @id @default(autoincrement())
    user         User       @relation(fields: [userId], references: [id])
    userId       Int
    permission   Permission @relation(fields: [permissionId], references: [id])
    permissionId Int
    createdAt    DateTime   @default(now())

    @@unique([userId, permissionId])
  }  ```

### 5. API Structure
- **Authentication Endpoints**  ```typescript
  POST /api/v1/user/register
  // Request body
  {
    "email": "user@example.com",
    "username": "username",
    "password": "SecurePass123!",
    "firstname": "John",
    "lastname": "Doe"
  }

  POST /api/v1/user/login
  // Request body
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }  ```

- **Role Management Endpoints**  ```typescript
  POST /api/v1/roles/assign
  // Request body (Admin only)
  {
    "userId": 1,
    "role": "MODERATOR"
  }  ```

### 6. Security Implementation
- **CORS Configuration**  ```typescript
  app.use(cors({
    origin: "*",  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));  ```

- **Authentication Middleware**  ```typescript
  export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    // ... token verification logic
  };  ```

### 7. Error Handling
- **Standardized Error Responses**  ```typescript
  {
    "status": "error",
    "code": 400-500,
    "message": "Detailed error message",
    "details": {} // Optional additional information
  }  ```

- **Common Error Types**
  - Authentication failures
  - Permission denials
  - Input validation errors
  - Database constraints
  - Rate limiting errors

### 8. Development Setup
- **Environment Configuration**  ```env
  DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
  JWT_SECRET="your-secret-key"
  SMTP_HOST="your-smtp-host"
  SMTP_PORT=587
  SMTP_USER="your-smtp-username"
  SMTP_PASS="your-smtp-password"
  SMTP_FROM="noreply@yourdomain.com"  ```

- **Development Commands**  ```bash
  # Install dependencies
  npm install

  # Run database migrations
  npx prisma migrate dev

  # Generate Prisma client
  npx prisma generate

  # Start development server
  npm run dev

  # Build for production
  npm run build  ```

### 9. Testing
- Unit tests for core functionality
- Integration tests for API endpoints
- Authentication flow testing
- Permission validation testing
- Error handling verification

### 10. Deployment
- **Vercel Configuration**  ```json
  {
    "version": 2,
    "builds": [
      {
        "src": "dist/index.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "dist/index.js"
      }
    ]
  }  ```

## Contributing Guidelines
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License
This project is licensed under the ISC License.

## Acknowledgments
- Express.js team for the robust web framework
- TypeScript for the better type safety
- Prisma team for the excellent ORM
- PostgreSQL for the reliable database system