import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Research Archive',
  description: '나만의 AI 연구 논문 아카이브',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-8">
            <nav className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold tracking-tight">
                AI Research Archive
              </a>
              <div className="flex gap-6 text-sm text-neutral-400">
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
                <a href="/papers" className="hover:text-white transition-colors">
                  Papers
                </a>
                <a href="/timeline" className="hover:text-white transition-colors">
                  Timeline
                </a>
                <a href="/graph" className="hover:text-white transition-colors">
                  Graph
                </a>
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
