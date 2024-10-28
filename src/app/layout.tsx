import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { PrismaClient } from "@prisma/client";

export const metadata: Metadata = {
  title: "Waitlis",
  description: "Warteschlangen live verwalten",
};

export const prisma = new PrismaClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body style={{ margin: 0 }}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
