import type { Metadata } from 'next';
import './root.css';

export const metadata: Metadata = {
  title: 'CE.SDK Demo',
  description: 'Build using the CE.SDK'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Kalkinso Software (OPC) Private Limited provides innovative software solutions and AI-powered tools to bring your ideas to life."
        />
        <meta name="keywords" content="Kalkinso Software, AI tools, software solutions, innovative technology, AI-powered software, OPC Private Limited" />
        <meta name="author" content="Kalkinso Software (OPC) Private Limited" />
        <meta property="og:title" content="Kalkinso Software (OPC) Private Limited" />
        <meta property="og:image" content="%PUBLIC_URL%/logo-new.png" />
        <meta property="og:description" content="Bringing innovative software ideas to life with cutting-edge AI tools and solutions." />
        {`<script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-93QSDHVG8E');
        </script>`}
      </head>
      <body style={{ minHeight: '100vh' }}>{children}</body>
    </html>
  );
}
