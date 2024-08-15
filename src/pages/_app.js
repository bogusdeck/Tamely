import "../styles/global.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="relative">
      <main className="p-4">
        {" "}
        {/* Adjust the margin to account for the sidebar width */}
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
