import "../styles/global.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <div className="relative">
      <Head>
        <title>Tamely - Task Management</title>
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <header className="fixed top-0 right-0 z-10 p-4 md:p-6 flex items-center justify-end w-full pointer-events-none">
        <div className="flex items-center bg-dark-tertiary bg-opacity-80 backdrop-blur-md p-2 rounded-full shadow-dark-lg pointer-events-auto">
          <img src="/icon.png" alt="Tamely Logo" className="h-8 w-8" />
        </div>
      </header>
      <main className="p-4">
        {/* Adjust the margin to account for the sidebar width */}
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
