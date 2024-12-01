# RBAC System (Role-Based Access Control) 
## Live link: [Your Live Frontend Link](https://rabac.vercel.app/)

A robust backend system for implementing role-based access control using **TypeScript**, **Express**, and **Prisma**. This system ensures secure user authentication and authorization with a hierarchical permission structure.

---

## 🚀 Key Features

### 1. Authentication System
- **Token-Based Authentication**
  - **JWT (JSON Web Tokens)**
    - Access tokens (15-minute expiry)
    - Refresh tokens for extended sessions
    - Token blacklisting for secure logout
  - Secure token storage and validation
- **Password Security**
  - **Bcrypt** hashing with salt rounds for enhanced security
  - Password strength validation
  - Secure password reset mechanism
  - Rate limiting on authentication endpoints
- **Email Notifications**
  - Account verification emails
  - Password reset notifications
  - HTML email templates with **Nodemailer**

### 2. Role Management
- **Three-tier Role System**
  - **ADMIN**: Full system access, user management, and analytics.
  - **MODERATOR**: Content management and user monitoring.
  - **USER**: Basic profile management and feature access.
- **Dynamic Role Assignment**
  - Role updates and hierarchy enforcement
  - Role-based route protection
  - Audit logging for role changes

### 3. Permission System
- **Granular Permissions**
  - Individual and grouped permissions
  - Permission inheritance and overrides
- **Predefined Permissions**:
  ```typescript
  enum Permission {
    READ_USERS = 'READ_USERS',
    WRITE_USERS = 'WRITE_USERS',
    DELETE_USERS = 'DELETE_USERS',
    MANAGE_ROLES = 'MANAGE_ROLES',
    ACCESS_ADMIN_PANEL = 'ACCESS_ADMIN_PANEL',
    ACCESS_MODERATOR_PANEL = 'ACCESS_MODERATOR_PANEL'
  }

### 4. Database Schema (PostgreSQL)
```
model User {
  id                     Int              @id @default(autoincrement())
  username               String           @unique
  email                  String           @unique
  password               String    
  firstname              String
  lastname               String
  role                   Role             @default(USER)
  refreshToken           String?
  emailVerificationToken String?
  emailVerificationExpires DateTime?
  isEmailVerified        Boolean          @default(false)
  resetPasswordToken     String?
  resetPasswordExpires   DateTime?
  userPermissions        UserPermission[]
  createdAt              DateTime         @default(now())
  updatedAt              DateTime         @updatedAt
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
}

```
### 5. API Endpoints
```
POST /api/v1/user/register
POST /api/v1/user/login
POST /api/v1/user/forgotpassword
POST /api/v1/user/reset-password
POST /api/v1/user/change-password

```
## Role Management
```
POST /api/v1/roles/assign
// Admin-only endpoint

```

### 6. Security Measures
```
app.use(cors({
  origin: "*",  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

```
### 8. Development Server
```
git clone https://github.com/SwarnenduG07/RABAC-VRC.git
npm install           # Install dependencies
npx prisma migrate dev # Run database migrations
npx prisma generate    # Generate Prisma client
npm run dev            # Start development server
npm run build          # Build for production

```
### Environment Variables
```
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@yourdomain.com"

```
### 9. Testing
```
   Postman 
```
### 10. Deployment
```
   Vercel
```
## Frontend Setup

### Features
- Built with **Next.js**
- Role-based access control integrated with backend
- Responsive design
- API communication for data fetching and rendering

### Commands
```bash
npm install --legacy-peer-deps #install dependencies
npm run dev   # Development server
npm run build # Production build
npm run lint  # Code linting
```

### Contributing
1. **Fork the repository.**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request.**

### Acknowledgments
- **Express.js**: For the robust web framework.
- **TypeScript**: For type safety.
- **Prisma**: For the ORM.
- **PostgreSQL**: For the database.

