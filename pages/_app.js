import '../styles/globals.css';
import Navbar from '@/components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <div className="nav-bar"> {/* Adjust pt value as needed based on navbar height */}
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
