# Deployment Guide

Complete guide for deploying Addon Auth to production.

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Production build succeeds (`npm run build`)
- [ ] Environment variables prepared
- [ ] Database ready (PostgreSQL)
- [ ] OAuth credentials configured (if using)
- [ ] Domain name ready
- [ ] SSL certificate ready (or using platform SSL)

## Environment Variables

### Required Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-random-secret-64-characters-or-more"
```

### Optional Variables (OAuth)

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 64
```

## Deployment Platforms

### 1. Vercel (Recommended)

#### Initial Setup

1. **Push to GitHub**:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. **Import to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project settings

3. **Add Environment Variables**:

   - Go to Project Settings → Environment Variables
   - Add all required variables
   - Click "Deploy"

4. **Set Up Database**:

```bash
# After deployment, run migrations
npm run prisma:migrate -- --name init
npm run prisma:seed
```

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build && npx prisma generate",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

#### Database Options for Vercel

**Option 1: Vercel Postgres**

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create database
vercel postgres create

# Connect to project
vercel env pull
```

**Option 2: Neon (Recommended)**

- Sign up at [neon.tech](https://neon.tech)
- Create new project
- Copy DATABASE_URL
- Add to Vercel environment variables

**Option 3: Supabase**

- Sign up at [supabase.com](https://supabase.com)
- Create new project
- Get connection string from Settings → Database
- Add to Vercel environment variables

#### Post-Deployment Steps

1. **Run Migrations**:

```bash
# Using Vercel CLI
vercel env pull .env.production.local
npx prisma migrate deploy
npx prisma db seed
```

2. **Update OAuth Callbacks**:

   - Google: `https://yourdomain.com/api/auth/callback/google`
   - GitHub: `https://yourdomain.com/api/auth/callback/github`

3. **Test Authentication**:
   - Visit your deployed site
   - Test login with test accounts
   - Test OAuth providers
   - Test admin dashboard

### 2. Railway

1. **Create Railway Account**: [railway.app](https://railway.app)

2. **Create New Project**:

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL**:

   - Click "New"
   - Select "Database"
   - Choose "PostgreSQL"
   - Copy DATABASE_URL

4. **Configure Environment**:

   - Go to your service
   - Add all environment variables
   - Set NEXTAUTH_URL to Railway-provided domain

5. **Deploy**:
   - Railway automatically builds and deploys
   - Run migrations using Railway CLI or service commands

### 3. AWS (Advanced)

#### Using AWS Amplify

1. **Connect Repository**:

   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Configure build settings

2. **Build Configuration** (`amplify.yml`):

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npx prisma generate
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

3. **Database**: Use Amazon RDS PostgreSQL

#### Using EC2 (Manual)

1. **Launch EC2 Instance**:

   - Ubuntu 22.04 LTS
   - t2.small or larger
   - Configure security groups (ports 80, 443, 22)

2. **Install Dependencies**:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

3. **Clone and Setup**:

```bash
git clone your-repo.git
cd your-repo/packages/addon-auth
npm install
cp .env.example .env
# Edit .env with production values
npm run build
```

4. **Run with PM2**:

```bash
pm2 start npm --name "addon-auth" -- start
pm2 startup
pm2 save
```

5. **Setup Nginx**:

```bash
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/addon-auth
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/addon-auth /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **SSL with Let's Encrypt**:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 4. Docker Deployment

#### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/addon_auth
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: addon_auth
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Deploy

```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

## Database Migrations in Production

### Before Deploying Schema Changes

1. **Test locally**:

```bash
npx prisma migrate dev --name your_migration_name
```

2. **Commit migration files**:

```bash
git add prisma/migrations
git commit -m "Add migration: your_migration_name"
```

3. **Deploy to production**:

```bash
# On production server or in CI/CD
npx prisma migrate deploy
```

### Handling Breaking Changes

1. **Create backward-compatible migration first**
2. **Deploy application changes**
3. **Deploy breaking migration**
4. **Clean up old code**

Example:

```sql
-- Step 1: Add new column (nullable)
ALTER TABLE "User" ADD COLUMN "newField" TEXT;

-- Step 2: Migrate data
UPDATE "User" SET "newField" = "oldField";

-- Step 3: Make required (in next migration)
ALTER TABLE "User" ALTER COLUMN "newField" SET NOT NULL;

-- Step 4: Drop old column (in next migration)
ALTER TABLE "User" DROP COLUMN "oldField";
```

## Monitoring & Maintenance

### Health Checks

Create health check endpoint (`src/app/api/health/route.ts`):

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "healthy", timestamp: new Date() });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: "Database connection failed" },
      { status: 503 }
    );
  }
}
```

### Logging

Add production logging:

```bash
npm install pino pino-pretty
```

### Performance Monitoring

Consider adding:

- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Vercel Analytics](https://vercel.com/analytics) for web vitals

### Backups

**Automated Database Backups**:

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Add to crontab:

```bash
0 2 * * * /path/to/backup-script.sh
```

## Security Hardening

1. **Enable HTTPS only** (HSTS headers)
2. **Set secure headers** in `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
```

3. **Rate limiting** for auth endpoints
4. **Regular dependency updates**: `npm audit fix`
5. **Monitor security advisories**

## Troubleshooting

### Build Fails

- Check TypeScript errors: `npm run type-check`
- Verify all dependencies installed
- Clear cache: `rm -rf .next && npm run build`

### Database Connection Issues

- Verify DATABASE_URL format
- Check SSL mode: add `?sslmode=require` for production
- Test connection: `npx prisma db push`

### OAuth Not Working

- Verify callback URLs match exactly
- Check environment variables are set
- Ensure NEXTAUTH_URL matches deployed domain
- Test provider credentials

### Session Issues

- Regenerate NEXTAUTH_SECRET
- Clear browser cookies
- Check domain settings in NextAuth config

## Rollback Procedure

If deployment fails:

1. **Revert code**:

```bash
git revert HEAD
git push
```

2. **Rollback database** (if migration applied):

```bash
# Restore from backup
psql $DATABASE_URL < backup_file.sql
```

3. **Redeploy previous version** through platform dashboard

---

**For help**: Check logs, health endpoint, and database connectivity first.
