# Abkhazia Tax Service Portal

A modern web application designed for the Tax Service of the Republic of Abkhazia, providing comprehensive digital tax management solutions for citizens and businesses.

## Features

- User authentication and account management
- Tax obligations tracking and payment management
- Document viewing and management
- Notifications and support requests
- Educational resources for tax filing
- Mobile-responsive design
- Russian language interface

## Technology Stack

- **Frontend**: React.js, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Data Storage**: In-memory storage with PostgreSQL option
- **Authentication**: Session-based authentication
- **Internationalization**: i18next for translations
- **Form Handling**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/abkhazia-tax-service.git
cd abkhazia-tax-service
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

- `/client` - React frontend application
  - `/src/components` - Reusable UI components
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions and configuration
  - `/src/pages` - Application pages
- `/server` - Express backend server
  - `/routes.ts` - API routes
  - `/storage.ts` - Data storage implementation
  - `/auth.ts` - Authentication logic
- `/shared` - Shared types and schemas
  - `/schema.ts` - Database schema and type definitions

## Abkhazia-Specific Customizations

- Abkhazian tax categories and document types
- Localized payment methods (Sberbank, VTB, PSB, APRA)
- Cash payment options for rural areas
- Local security standards compliance
- Dual currency support (Russian Ruble/Apsar)

## License

This project is licensed under the MIT License - see the LICENSE file for details.