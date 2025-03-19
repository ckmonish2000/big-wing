# Flight Booking Management System

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.io/)
[![Pulumi](https://img.shields.io/badge/Pulumi-8A3391?style=flat-square&logo=pulumi&logoColor=white)](https://www.pulumi.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

A modern, real-time flight booking system featuring Server-Sent Events (SSE) for live updates and IndexedDB for offline-first capabilities.

## 🌟 Features

- Real-time flight updates using SSE
- Offline-first architecture with IndexedDB caching
- Scalable NestJS backend
- Modern React frontend with responsive design
- Infrastructure as Code using Pulumi
- Supabase for reliable data storage and real-time features

## 📁 Project Structure

This monorepo contains the following packages:

- `backend/` - NestJS server handling business logic and API endpoints
- `website/` - React frontend application with modern UI/UX
- `common/` - Shared TypeScript types, utilities, and constants
- `infra/` - Pulumi IaC for cloud infrastructure management
- `database/` - Supabase database schemas and migrations

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Docker](https://www.docker.com/) and Docker Compose
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## 🚀 Getting Started

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-username/flight-booking-system.git
cd flight-booking-system

# Install dependencies
pnpm install

# Build shared package
pnpm --filter common build
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

Required environment variables:
- `DATABASE_URL`: Supabase database connection string
- `SUPABASE_API_KEY`: Supabase API key
- `JWT_SECRET`: Secret for JWT authentication
- Additional variables as specified in `.env.example`

### 3. Database Setup

```bash
# Login to Supabase
supabase login

# Apply database migrations
cd packages/backend
supabase db push
```

### 4. Infrastructure Deployment (Optional)

If you want to deploy to the cloud:

```bash
# Configure cloud provider credentials first
cd infra
pulumi up
```

### 5. Local Development

```bash
# Start all services
docker-compose up --build

# Or start individual services
pnpm --filter backend dev
pnpm --filter website dev
```

### 6. Access the Application

Once running, access the applications at:
- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend API: [http://localhost:3000](http://localhost:3000)
- API Documentation: [http://localhost:3000/api](http://localhost:3000/api/docs)

## 📝 Development Guidelines

- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
- Write tests for new features
- Update documentation when making changes
- Run linting before committing: `pnpm lint`

## 🔍 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter backend test
```

## 📦 Production Deployment

1. Build all packages:
```bash
pnpm build
```

2. Deploy infrastructure:
```bash
cd infra
pulumi up
```

3. Deploy applications using your preferred cloud provider or container orchestration platform.
