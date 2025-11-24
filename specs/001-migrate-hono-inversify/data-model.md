# Data Model: Better Auth Integration

**Spec**: [specs/001-migrate-hono-inversify/spec.md](spec.md)
**Database**: PostgreSQL (via Prisma)

## Entity Updates

### User (Existing -> Updated)
The `User` entity must be updated to support Better Auth's required schema while maintaining existing application fields.

```prisma
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false) @map("email_verified") // New (Better Auth)
  image         String?   // New (Better Auth)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  // Application specific
  role          Role      @default(USER)
  password      String?   // Retained for credentials auth, optional for social

  // Better Auth Relations
  sessions      Session[]
  accounts      Account[]

  @@map("user") // Better Auth defaults to singular "user" usually, but we can map to "users" to match existing. 
                // IMPORTANT: Better Auth expects specific table names or configuration. 
                // Research indicates Better Auth is flexible with mapping. 
                // We will keep "users" map but ensure fields match.
}
```

### Session (New)
Required for Better Auth session management.

```prisma
model Session {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("session")
}
```

### Account (New)
Required for OAuth providers (if used in future) and internal linking.

```prisma
model Account {
  id                    String    @id @default(uuid())
  userId                String    @map("user_id")
  accountId             String    @map("account_id")
  providerId            String    @map("provider_id")
  accessToken           String?   @map("access_token")
  refreshToken          String?   @map("refresh_token")
  accessTokenExpiresAt  DateTime? @map("access_token_expires_at")
  refreshTokenExpiresAt DateTime? @map("refresh_token_expires_at")
  scope                 String?
  idToken               String?   @map("id_token")
  password              String?
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("account")
}
```

### Verification (New)
Required for email verification/magic links.

```prisma
model Verification {
  id         String   @id @default(uuid())
  identifier String
  value      String
  expiresAt  DateTime @map("expires_at")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@map("verification")
}
```

## Validation Schemas (Zod)

### Auth

```typescript
// Login
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Register (if applicable)
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});
```

### User

```typescript
// Update User
export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});
```

