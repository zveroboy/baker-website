import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Торты - Пекарня",
  description: "Каталог наших вкусных тортов и выпечки",
};

export default function CakesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">🎂</h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900">
          Скоро здесь появятся наши торты
        </h2>
        <p className="text-gray-500 mb-8">
          Мы готовим для вас каталог удивительных тортов
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
