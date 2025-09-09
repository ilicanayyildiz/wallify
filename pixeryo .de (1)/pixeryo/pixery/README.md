# PIXERYO

A professional stock image marketplace built with Next.js and Supabase. This application allows users to browse, purchase, and download high-quality stock images.

![PIXERYO Platform](https://images.unsplash.com/photo-1542744173-8e7e53415bb0)

## Features

- **User Authentication**: Create an account, log in, and manage your profile
- **Image Catalog**: Browse through a large collection of high-quality stock images
- **Category Filtering**: Easily find images by category
- **Image Details**: View detailed information about stock images before purchasing
- **Purchase System**: Buy images using credits and access them from your profile
- **Credit System**: Purchase credits and use them to acquire images
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Choose your preferred theme

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Authentication & Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom theming
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/stock-image.git
   cd stock-image
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting Up Supabase

1. Run the database setup script located in `scripts/setup-supabase.sql` in your Supabase SQL editor.
2. (Optional) Run the sample data script in `scripts/sample-data.sql` to populate the database with sample images.

## Project Structure

```
stock-image/
├── public/             # Static assets
├── scripts/            # Database setup scripts
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # UI components
│   │   ├── ui/         # shadcn/ui components
│   │   └── ...         # Custom components
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions and configuration
│   └── styles/         # Global styles
├── .env.local          # Environment variables (not in repo)
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md
```

## Features in Detail

### Authentication

The application uses Supabase Authentication for:
- Email/password sign-up and login
- User profile management
- Protected routes for authenticated users

### Database Schema

The Supabase database includes the following tables:
- **profiles**: User profile information
- **products**: Stock image details and metadata
- **purchases**: Record of users' image purchases

### Deployment

The application is configured to deploy on Vercel, which provides:
- Seamless deployment from GitHub
- Automatic previews for pull requests
- Easy environment variable management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Unsplash](https://unsplash.com/) for sample images 