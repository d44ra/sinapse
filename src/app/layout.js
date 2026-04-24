import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/satoshi/Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/satoshi/Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/satoshi/Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi", // Nome da variável que será usada no CSS
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={satoshi.variable}>
      {/* A classe 'font-satoshi' deve estar configurada no seu tailwind.config.js 
          ou você pode usar o satoshi.className diretamente aqui.
      */}
      <body className="font-satoshi antialiased">
        {children}
      </body>
    </html>
  );
}