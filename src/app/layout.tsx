import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
  // Full weight spectrum for admin dashboard typography
  // 300: de-emphasized, 400: body, 500: emphasis/UI, 600: headings, 700: strong
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'tecton — Admin Dashboard',
  description:
    'Open-source admin dashboard starter. Production-ready Next.js template with auth, RBAC, and clean architecture.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="bg-background min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
