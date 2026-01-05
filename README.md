# Authentication & Dashboard Addon

A complete, standalone authentication and dashboard system built with Next.js 14, NextAuth.js, Prisma, and TypeScript. Features role-based access control (RBAC), user and admin dashboards, and OAuth integration.

## ✨ Features

### Authentication

- 🔐 Email/Password authentication with bcrypt hashing
- 🌐 OAuth providers (Google, GitHub)
- ✉️ Email verification
- 🔄 Password reset functionality
- 🔒 Two-factor authentication (2FA) ready
- 🚫 Rate limiting and brute force protection
- 📱 Session management

### Role-Based Access Control (RBAC)

- 👤 **User** - Standard user access
- 👮 **Moderator** - Content moderation privileges
- 👑 **Admin** - Full system access

### User Dashboard

- 👤 Profile management
- 🔑 Password change
- 🖼️ Avatar upload
- 📊 Activity logs
- 🔗 Connected accounts (OAuth)
- ⚙️ Settings & preferences
- 🌙 Dark/Light theme toggle

### Admin Dashboard

- 👥 User management (CRUD operations)
- 🔍 Search and filter users
- ⚡ Bulk actions
- 📈 System analytics
- 📋 Audit logs
- 🛡️ Security monitoring
- 📧 Email template management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or MySQL, SQLite)
- npm/pnpm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/addon-auth.git
   cd addon-auth
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/auth_addon"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed database with test users
   npm run prisma:seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Test Credentials

After seeding, you can log in with:

- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`
- **Moderator**: `moderator@example.com` / `password123`

## 📁 Project Structure

```
addon-auth/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── app/               # Next.js 14 App Router
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # User dashboard
│   │   └── admin/        # Admin dashboard
│   ├── components/        # Reusable components
│   │   ├── ui/           # UI components (buttons, inputs, etc.)
│   │   ├── auth/         # Auth-specific components
│   │   └── dashboard/    # Dashboard components
│   ├── lib/              # Utility functions
│   │   ├── auth.ts       # NextAuth configuration
│   │   ├── prisma.ts     # Prisma client
│   │   └── utils.ts      # Helper functions
│   └── types/            # TypeScript types
├── public/               # Static assets
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

| Variable               | Description                      | Required |
| ---------------------- | -------------------------------- | -------- |
| `DATABASE_URL`         | PostgreSQL connection string     | Yes      |
| `NEXTAUTH_SECRET`      | Random string for JWT encryption | Yes      |
| `NEXTAUTH_URL`         | Your app URL                     | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID           | No       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret              | No       |
| `GITHUB_ID`            | GitHub OAuth app ID              | No       |
| `GITHUB_SECRET`        | GitHub OAuth secret              | No       |
| `RESEND_API_KEY`       | Email service API key            | No       |

### OAuth Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 📊 Database Schema

### Core Models

- **User** - User accounts with authentication
- **Account** - OAuth provider accounts
- **Session** - Active user sessions
- **Profile** - Extended user information
- **AuditLog** - Security and activity logging

See [prisma/schema.prisma](prisma/schema.prisma) for complete schema.

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ CSRF protection
- ✅ Rate limiting (optional with Redis)
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection (Next.js built-in)
- ✅ Audit logging for security events
- ✅ Email verification
- ✅ Account lockout after failed attempts

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Prisma commands
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database
npm run prisma:push      # Push schema without migration

# Setup command
npm run setup        # Install deps, generate client, migrate
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

```bash
# Build image
docker build -t addon-auth .

# Run container
docker run -p 3000:3000 --env-file .env addon-auth
```

### Other Platforms

This addon works on any platform that supports Next.js:

- Netlify
- Railway
- Render
- AWS
- Digital Ocean

## 🔌 Integration with Other Addons

This authentication addon can be integrated with other addons in the ecosystem:

1. **Blog Engine** - User authentication for authors
2. **E-commerce Cart** - Customer accounts and orders
3. **Booking System** - Service provider and customer auth

Simply use the same database and NextAuth configuration across addons.

## 🛠️ Customization

### Adding New Roles

Edit `prisma/schema.prisma`:

```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
  CUSTOM_ROLE  // Add your role
}
```

Run migration:

```bash
npm run prisma:migrate
```

### Customizing UI

- Edit components in `src/components/`
- Modify Tailwind theme in `tailwind.config.ts`
- Update global styles in `src/app/globals.css`

### Adding OAuth Providers

1. Add credentials to `.env`
2. Configure in `src/lib/auth.ts`
3. Update UI in auth pages

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🐛 Issues & Support

Found a bug or need help?

- Open an issue on [GitHub](https://github.com/your-username/addon-auth/issues)
- Check existing issues first
- Provide reproduction steps

## 🗺️ Roadmap

- [ ] Two-factor authentication (2FA)
- [ ] Social login (Facebook, Twitter)
- [ ] Magic link authentication
- [ ] Advanced audit logging
- [ ] User impersonation (admin)
- [ ] API key management
- [ ] WebAuthn/Passkey support
- [ ] Mobile app authentication

## 👥 Authors

- Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NextAuth.js for authentication
- Prisma for the database toolkit
- Shadcn for UI components inspiration

---

**Built with ❤️ using Next.js, NextAuth.js, Prisma, and TypeScript**
