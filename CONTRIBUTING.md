# Contributing to Addon Auth

Thank you for your interest in contributing to Addon Auth! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository** or create a new branch
2. **Clone your fork** locally
3. **Install dependencies**: `npm install`
4. **Set up environment**: Copy `.env.example` to `.env` and configure
5. **Run setup**: `npm run setup`
6. **Start dev server**: `npm run dev`

## Development Workflow

### Before Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Ensure your local setup works: `npm run dev`
3. Run the test accounts to verify functionality

### Making Changes

1. **Code Style**:

   - Use TypeScript for all new files
   - Follow existing code formatting
   - Use meaningful variable and function names
   - Add comments for complex logic

2. **Database Changes**:

   - Update `prisma/schema.prisma` for schema changes
   - Create migration: `npx prisma migrate dev --name your_migration_name`
   - Update seed file if needed
   - Test migration thoroughly

3. **API Changes**:

   - Follow REST conventions
   - Add proper error handling
   - Validate inputs with Zod
   - Add audit logging for admin actions
   - Check authentication and authorization

4. **UI Changes**:
   - Keep components reusable
   - Use existing Shadcn UI components where possible
   - Ensure responsive design (mobile-first)
   - Test dark mode compatibility
   - Maintain accessibility standards

### Testing Your Changes

1. **Manual Testing**:

   - Test with all three roles (USER, MODERATOR, ADMIN)
   - Test OAuth flows if affected
   - Test edge cases and error states
   - Verify responsive design on different screen sizes

2. **Database Testing**:

   - Test with fresh database: `npx prisma migrate reset`
   - Verify seed data works
   - Check data integrity

3. **Build Testing**:
   - Run production build: `npm run build`
   - Check for TypeScript errors: `npm run type-check`
   - Run linter: `npm run lint`

### Committing Changes

1. **Commit Messages**:

   - Use clear, descriptive messages
   - Format: `type: description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - Examples:
     - `feat: add password reset functionality`
     - `fix: resolve OAuth callback error`
     - `docs: update API endpoint documentation`

2. **Commit Often**:
   - Make small, logical commits
   - Each commit should be a complete, working change

## Pull Request Process

1. **Before Submitting**:

   - Update documentation if needed
   - Add your changes to README if user-facing
   - Ensure code builds without errors
   - Test all affected functionality

2. **PR Description**:

   - Clearly describe what changes were made
   - Explain why the changes were necessary
   - List any breaking changes
   - Include screenshots for UI changes
   - Reference related issues

3. **PR Template**:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested locally
- [ ] Tested with all user roles
- [ ] Tested OAuth flows
- [ ] Verified database migrations

## Checklist

- [ ] Code follows project style
- [ ] Documentation updated
- [ ] No TypeScript errors
- [ ] Build succeeds
```

## Areas for Contribution

### High Priority

- [ ] Email verification system
- [ ] Password reset flow
- [ ] Two-factor authentication (2FA)
- [ ] Session management page
- [ ] Profile picture upload
- [ ] Advanced audit log viewer

### Medium Priority

- [ ] Bulk user operations in admin
- [ ] Export user data (CSV/JSON)
- [ ] Rate limiting implementation
- [ ] Email notification templates
- [ ] Social profile completion after OAuth
- [ ] Custom field UI for profiles

### Documentation

- [ ] API endpoint examples
- [ ] Video tutorials
- [ ] Migration guides
- [ ] Best practices guide
- [ ] Security hardening guide

### Testing

- [ ] Unit tests for utilities
- [ ] Integration tests for API routes
- [ ] E2E tests for user flows
- [ ] Component tests for UI

## Code Guidelines

### TypeScript

```typescript
// Use proper typing
interface User {
  id: string;
  email: string;
  role: Role;
}

// Avoid 'any' type
const getUser = async (id: string): Promise<User> => {
  // Implementation
};
```

### React Components

```typescript
// Use TypeScript for props
interface Props {
  user: User;
  onUpdate: (user: User) => void;
}

// Prefer function components
export function UserCard({ user, onUpdate }: Props) {
  return (
    // JSX
  );
}
```

### API Routes

```typescript
// Consistent error handling
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Business logic
    const data = await fetchData();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

### Database Queries

```typescript
// Use Prisma's type-safe queries
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    profile: true,
    auditLogs: {
      take: 10,
      orderBy: { createdAt: "desc" },
    },
  },
});

// Handle null results
if (!user) {
  throw new Error("User not found");
}
```

## Security Considerations

- **Never commit secrets** (.env should be gitignored)
- **Validate all inputs** using Zod or similar
- **Sanitize user data** before displaying
- **Check authorization** on all protected routes
- **Use bcrypt** for password hashing (never store plain text)
- **Audit log sensitive actions** (especially admin actions)
- **Rate limit** authentication endpoints
- **Use HTTPS** in production

## Database Best Practices

- **Indexes**: Add indexes for frequently queried fields
- **Relations**: Define proper foreign keys and cascades
- **Migrations**: Never edit old migrations, create new ones
- **Seeding**: Keep seed data realistic but safe
- **Backups**: Always backup before major schema changes

## Getting Help

- Check existing documentation in README.md
- Review similar components/routes in codebase
- Look at Prisma schema for data structure
- Check NextAuth.js documentation for auth questions
- Ask questions in discussions/issues

## Recognition

Contributors will be:

- Listed in the README contributors section
- Credited in release notes for significant contributions
- Appreciated for making this addon better!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Addon Auth! 🎉
