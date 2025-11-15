import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin", "cyrillic"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Пекарня - Авторская выпечка",
  description:
    "Свежая выпечка каждый день. Индивидуальные торты на заказ. Только натуральные ингредиенты.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "Пекарня - Авторская выпечка",
    description:
      "Свежая выпечка каждый день. Индивидуальные торты на заказ. Только натуральные ингредиенты.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Пекарня - Авторская выпечка",
    description:
      "Свежая выпечка каждый день. Индивидуальные торты на заказ. Только натуральные ингредиенты.",
  },
  alternates: {
    canonical: "https://bakery.ru",
    languages: {
      ru: "https://bakery.ru",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.className} ${playfair.variable} antialiased`}>{children}</body>
    </html>
  )
}
