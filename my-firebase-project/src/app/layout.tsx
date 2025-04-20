// This must remain as a server component
import { Metadata } from 'next';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: 'Firebase Project',
  description: 'Next.js with Firebase Authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}