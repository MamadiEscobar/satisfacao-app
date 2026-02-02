# Replit.md

## Overview

This is a customer feedback kiosk application built with a React frontend and Express backend. Users can submit satisfaction ratings (happy, neutral, sad) through a simple kiosk-style interface, while administrators can view analytics, statistics, and export data through a protected admin dashboard. The application uses PostgreSQL for data persistence and features real-time dashboard updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with HMR support
- **Charts**: Recharts for admin dashboard visualizations
- **Animations**: Framer Motion for UI transitions

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Authentication**: Basic HTTP authentication for admin routes (environment-configured credentials)
- **Session**: connect-pg-simple for PostgreSQL session storage

### Project Structure
```
├── client/          # React frontend application
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utility functions
│       └── pages/       # Route components (Home, Admin)
├── server/          # Express backend
│   ├── routes.ts    # API route handlers
│   ├── storage.ts   # Database operations layer
│   └── db.ts        # Database connection
├── shared/          # Shared code between client/server
│   ├── schema.ts    # Drizzle database schema
│   └── routes.ts    # API route definitions with Zod schemas
└── migrations/      # Database migrations (Drizzle Kit)
```

### Key Design Patterns
- **Shared Schema**: Database schema and API contracts defined once in `shared/` and used by both frontend and backend
- **Type Safety**: End-to-end TypeScript with Zod validation for runtime safety
- **Storage Abstraction**: `IStorage` interface allows swapping database implementations
- **Component Library**: shadcn/ui provides consistent, customizable UI primitives

### Data Flow
1. Frontend uses custom hooks (`use-feedback.ts`) wrapping React Query
2. API calls go to Express routes with Zod validation
3. Storage layer (`storage.ts`) handles all database operations via Drizzle ORM
4. Responses flow back through React Query cache for automatic UI updates

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations with `npm run db:push`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `ADMIN_USER`: Admin username for dashboard (default: "admin")
- `ADMIN_PASSWORD`: Admin password for dashboard (default: "admin")

### Third-Party Libraries
- **UI Components**: Full shadcn/ui component suite with Radix UI primitives
- **Data Visualization**: Recharts for bar/pie charts in admin dashboard
- **Date Handling**: date-fns for date formatting
- **Export Formats**: csv-stringify and ExcelJS for data exports
- **Validation**: Zod with drizzle-zod integration

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development environment indicator