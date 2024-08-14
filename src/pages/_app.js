import "../styles/global.css";
import Sidebar from "../components/sidebar";

function MyApp({ Component, pageProps }) {
  return (
    <div className="relative">
      <Sidebar />
      <main className="p-4">
        {" "}
        {/* Adjust the margin to account for the sidebar width */}
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
