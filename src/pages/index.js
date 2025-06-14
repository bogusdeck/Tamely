import { useState, useEffect } from 'react';
import { signInWithPopup, provider, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "../lib/firebase";
import { useRouter } from "next/router";
import { FiArrowRight, FiMail, FiLock, FiUser, FiClock, FiCheckCircle, FiBarChart2, FiCalendar } from "react-icons/fi";
import Head from 'next/head';

export default function LandingPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animationReady, setAnimationReady] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setAnimationReady(true);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      router.push("/home");
    } catch (error) {
      console.error("Error logging in:", error);
      setError('Failed to login with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        // Sign up logic
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Update profile with name if provided
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        console.log("User signed up:", result.user);
        router.push("/home");
      } else {
        // Login logic
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", result.user);
        router.push("/home");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message.replace('Firebase: ', '').replace(/\(auth.*\)/, ''));
    } finally {
      setLoading(false);
    }
  };

  function toggleAuthMode() {
    setIsSignUp(!isSignUp);
    setError('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-primary to-dark-secondary flex flex-col md:flex-row">
      <Head>
        <title>Tamely - Track Your Time, Master Your Tasks</title>
        <meta name="description" content="Tamely helps you manage your tasks efficiently with powerful time tracking, beautiful visualizations, and productivity insights." />
      </Head>
      {/* Left side - Hero section */}
      <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
        <div className={`transition-opacity duration-700 ${animationReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center mb-6 animate-slide-in" style={{animationDelay: '0.1s'}}>
            <img src="/icon.png" alt="Tamely Logo" className="h-12 w-12 mr-3 animate-pulse-subtle" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-dark-accent to-dark-accentHover bg-clip-text text-transparent">
              Tamely
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-dark-text mb-4 animate-slide-in" style={{animationDelay: '0.2s'}}>
            Track Your Time, <span className="text-dark-accent">Master Your Tasks</span>
          </h2>
          
          <p className="text-dark-muted text-lg mb-8 max-w-xl animate-slide-in" style={{animationDelay: '0.3s'}}>
            Tamely helps you manage your tasks efficiently with powerful time tracking, 
            beautiful visualizations, and productivity insights to help you achieve more.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 animate-slide-in" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center p-3 rounded-lg bg-dark-secondary bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-2 rounded-full bg-dark-tertiary mr-3 shadow-glow">
                <FiClock className="text-dark-accent h-6 w-6" />
              </div>
              <span className="text-dark-text">Time Tracking</span>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-dark-secondary bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-2 rounded-full bg-dark-tertiary mr-3 shadow-glow">
                <FiCheckCircle className="text-dark-accent h-6 w-6" />
              </div>
              <span className="text-dark-text">Task Management</span>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-dark-secondary bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-2 rounded-full bg-dark-tertiary mr-3 shadow-glow">
                <FiBarChart2 className="text-dark-accent h-6 w-6" />
              </div>
              <span className="text-dark-text">Productivity Analytics</span>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-dark-secondary bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-2 rounded-full bg-dark-tertiary mr-3 shadow-glow">
                <FiCalendar className="text-dark-accent h-6 w-6" />
              </div>
              <span className="text-dark-text">Schedule Planning</span>
            </div>
          </div>
          
          <div className="hidden md:block animate-slide-in" style={{animationDelay: '0.5s'}}>
            <button 
              onClick={() => setIsSignUp(true)}
              className="btn-primary flex items-center gap-2 text-lg"
            >
              Get Started <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth form */}
      <div className="w-full md:w-2/5 p-8 md:p-12 flex items-center justify-center">
        <div className={`w-full max-w-md bg-dark-tertiary bg-opacity-50 backdrop-blur-md p-8 rounded-xl shadow-dark-lg transition-all duration-700 transform ${animationReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-dark-text">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-dark-muted mt-2">
              {isSignUp ? 'Start tracking your productivity' : 'Login to continue your journey'}
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-md text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-dark-muted text-sm mb-1" htmlFor="name">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-secondary border border-dark-border rounded-md py-2 pl-10 pr-3 text-dark-text focus:outline-none focus:border-dark-accent"
                    placeholder="John Doe"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-dark-muted text-sm mb-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-secondary border border-dark-border rounded-md py-2 pl-10 pr-3 text-dark-text focus:outline-none focus:border-dark-accent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-dark-muted text-sm mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-secondary border border-dark-border rounded-md py-2 pl-10 pr-3 text-dark-text focus:outline-none focus:border-dark-accent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2 flex justify-center items-center transition-all duration-300 hover:shadow-glow"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                <span>{isSignUp ? 'Sign Up' : 'Login'}</span>
              )}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-tertiary text-dark-muted">Or continue with</span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-4 w-full flex justify-center items-center gap-2 py-2 px-4 border border-dark-border rounded-md bg-dark-secondary hover:bg-dark-hover transition-colors duration-200"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>
          </div>
          
          <p className="mt-6 text-center text-dark-muted text-sm">
            {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
            <button 
              onClick={toggleAuthMode}
              className="ml-1 text-dark-accent hover:underline focus:outline-none"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
