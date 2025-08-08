# Portfolio Tracker

## Overview

This is a full-stack investment portfolio tracking application built with React, Express, and PostgreSQL. The application allows users to authenticate via Replit Auth, manage their investment holdings, and track portfolio performance with real-time calculations of gains/losses.

The system follows a modern monorepo structure with shared schemas and types between frontend and backend, ensuring type safety across the entire application stack.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod resolver for type-safe form validation
- **Routing**: Wouter for lightweight client-side routing
- **Build System**: Vite with custom aliases for clean imports and development experience

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect for secure user authentication
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API with comprehensive error handling and logging

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Tables**:
  - `sessions`: Session storage for authentication (required for Replit Auth)
  - `users`: User profiles with OAuth integration
  - `investments`: Investment holdings with purchase/current prices and calculated metrics
- **Relationships**: Foreign key constraints with cascade deletes for data integrity

### Authentication & Authorization
- **Provider**: Replit Auth with OAuth 2.0/OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Middleware**: Route-level authentication guards with user context injection
- **User Management**: Automatic user creation/update on first login with profile sync

### Shared Architecture
- **Type Safety**: Shared TypeScript schemas between client and server using Drizzle-Zod
- **Validation**: Zod schemas for runtime validation and TypeScript inference
- **API Contracts**: Consistent request/response types across the application
- **Error Handling**: Centralized error handling with proper HTTP status codes

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Environment**: Requires `DATABASE_URL` environment variable for database connectivity

### Authentication Services
- **Replit Auth**: OAuth 2.0 provider for user authentication
- **Required Variables**: `REPL_ID`, `ISSUER_URL`, `SESSION_SECRET`, `REPLIT_DOMAINS`

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit-specific development features
- **Hot Module Replacement**: Vite HMR with Express middleware for seamless development

### UI Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Modern icon library with consistent styling
- **Date-fns**: Utility library for date manipulation and formatting

### Build & Development
- **TypeScript**: Full type checking across client, server, and shared code
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer