import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
   import Header from '@/components/header/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ weight: ['600','700'], subsets: ['latin'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'ENCHO — Taxi Rental for Drivers',
  description: 'Accommodation, food, vehicles — healthy environment to empower drivers to earn more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
      <>
     
            <Header />
            {children}
      </></body>
    </html>
  );
}
