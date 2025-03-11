# Abkhazia Tax Service Web Application

A modern tax service web application designed for Abkhazian citizens, providing comprehensive digital tax management solutions.

## Key Features

- Localized date and currency formatting (Russian format)
- Payments and document management interface
- Multi-language support
- Responsive web design
- Secure government portal integration
- Support for Abkhazian payment methods
- Dual currency support (Russian Ruble/Apsar)

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Node.js/Express
- Database: PostgreSQL
- State Management: TanStack Query
- UI Components: shadcn/ui
- Forms: React Hook Form
- Validation: Zod
- Styling: Tailwind CSS
- Internationalization: i18next
- Date Formatting: date-fns

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Tiri0n/abkhazia-tax-service.git
cd abkhazia-tax-service
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL database connection string
- `SESSION_SECRET`: Secret for session management

## License

This project is licensed under the MIT License - see the LICENSE file for details.