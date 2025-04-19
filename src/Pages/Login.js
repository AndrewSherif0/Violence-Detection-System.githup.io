import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/8334315.png'; // Logo for the form side
import Footer from '../components/Footer';
import '../cssFolder/Login.css'; // Keep if needed for other styles or global styles
import img2 from '../assets/final.png'; // Background image

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
  },

  contentWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px', // Padding around the login box
    backgroundImage: `url(${img2})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  loginBox: {
    display: 'flex',
    // Increased height slightly to accommodate the register button comfortably
    minHeight: "620px", // Use minHeight instead of fixed height
    flexDirection: 'row', // Left and Right side by side
    width: '80%',
    maxWidth: '1000px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', // Enhanced shadow for depth
    overflow: 'hidden', // Keep children within rounded corners
    backdropFilter: 'blur(3px)', // Optional: subtle blur behind the box
    WebkitBackdropFilter: 'blur(3px)', // For Safari
  },
  // Left side: Text content
  leftSide: {
    // Dark blue, slightly transparent (can be solid if preferred)
    // backgroundColor: 'rgba(0, 30, 61, 0.85)',
    color: 'white',
    flex: 1, // Takes up half the space
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    textAlign: 'center', // Center text
  },
  logoText: {
    fontSize: 'clamp(40px, 6vw, 70px)', // Responsive font size
    fontWeight: 'bolder',
    fontFamily: 'Arial, sans-serif', // Choose a suitable font
    lineHeight: 1.2,
    position: 'relative',
  },
  spanSystem: {
    fontSize: 'clamp(30px, 4vw, 50px)', // Responsive font size
    fontWeight: 'bold', // Lighter weight for contrast
    marginTop: '10px', // Space below "Surveillance"
  },
  // Right side: Logo and Form
  rightSide: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white background
    color: '#333', // Darker text color for readability on whiteish background
    flex: 1, // Takes up half the space
    padding: '40px', // Standard padding
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center logo and form horizontally
    justifyContent: 'center', // Center content vertically
  },
  logoImage: { // Logo specific to the right side
    maxWidth: '120px', // Adjust size as needed
    height: 'auto',
    // Reduced marginBottom slightly to make space for register button
    marginBottom: '40px',
    transform: 'scaleX(-1)', // Keep if the flipped image is desired
  },
  form: {
    width: '100%', // Form takes full width of its container (rightSide padding)
    maxWidth: '400px', // Max width for the form itself for better proportions
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // Space between form elements (input, input, buttonContainer)
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly opaque white input background
    color: '#333', // Ensure input text is readable
    '&::placeholder': { // Style placeholder text if needed
      color: '#888',
    },
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    // Removed marginTop as gap in form provides spacing now
  },
  button: {
    // Base styles for all buttons
    padding: '12px',
    fontSize: '16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    fontWeight: 'bold',
  },
  loginBtn: {
    // Specific styles merged with base button styles
    flex: 1, // Takes half space in buttonContainer
    backgroundColor: 'rgb(0 30 61)', // Dark blue button
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(0, 50, 100)', // Slightly lighter blue on hover
    },
  },
  resetBtn: {
    // Specific styles merged with base button styles
    flex: 1, // Takes half space in buttonContainer
    backgroundColor: 'rgb(99 6 15)', // Dark red button
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(130, 10, 25)', // Slightly lighter red on hover
    },
  },
  // Style for the new Register button
  registerBtnContainer: {
    marginTop: '15px', // Space above the register button
    width: '100%', // Make container take full width
    display: 'flex', // Use flex to easily center the button if needed or make it full width
    justifyContent: 'center', // Center the button within this container
  },
  registerBtn: {
     // Specific styles merged with base button styles
    width: '100%', // Make register button full width
    maxWidth: '250px', // Optional: constrain max width
    backgroundColor: '#6c757d', // A neutral grey color
    color: 'white',
    '&:hover': {
      backgroundColor: '#5a6268', // Darker grey on hover
    },
  },
  errorMsg: {
    color: '#D8000C', // Stronger red for errors
    backgroundColor: '#FFD2D2', // Light red background for visibility
    border: '1px solid #D8000C',
    borderRadius: '5px',
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    // Adjusted margin, gap in form provides spacing
    marginTop: '0', // Remove top margin if gap is sufficient
    marginBottom: '5px', // Add some space below the error message
  },
  spinnerWrapper: {
    position: 'fixed', // Cover the whole screen during load
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Dim background during load
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure spinner is on top
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '6px solid #ccc',
    borderTop: '6px solid rgb(0 30 61)', // Use theme color
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Keyframes need to be defined globally or injected
const spinnerStyle = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading state
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Loading state for API call
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Shorter initial load time
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    if (!email || !password) {
        setError('Please enter both email and password.');
        setIsLoggingIn(false);
        return;
    }

    try {
      const response = await fetch('http://141.147.83.47:8083/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) { // Check for token presence as well
        localStorage.setItem('token', data.token);
        // Safely access roles - check if user and roles exist
        const role = data.user?.roles?.[0] || 'user'; // Default to 'user' if missing
        localStorage.setItem('role', role);
        localStorage.setItem('name', data.user?.name || 'User'); // Default name

        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        // Use message from server response, or a default
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
        console.error("Login API error:", err);
        setError('Login failed. Please check your connection or try again later.');
    } finally {
      setIsLoggingIn(false);
    }
  };

    const handleReset = () => {
        setEmail('');
        setPassword('');
        setError('');
    };

    // Handler for the Register button
    const handleRegisterClick = () => {
        navigate('/register'); // Navigate to the '/register' route
    };

  // Show initial loading spinner
  if (loading) {
    return (
        <div style={styles.spinnerWrapper}>
          <style>{spinnerStyle}</style>
          <div style={styles.spinner}></div>
        </div>
    );
  }

  // Show login page content
  return (
    <div style={styles.container}>
      <style>{spinnerStyle}</style>
      {/* Show spinner overlay during login API call */}
      {isLoggingIn && (
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
        </div>
      )}

      <div style={styles.contentWrapper}>
        <div style={styles.loginBox}>

          {/* Left side: Text Only */}
          <div style={styles.leftSide}>
            <div style={styles.logoText } className='Surveillance'>Surveillance</div>
            <span style={styles.spanSystem}>System</span>
          </div>

          {/* Right side: Logo and Form */}
          <div style={styles.rightSide}>
            <img src={img1} alt="System Logo" style={styles.logoImage} />

            <form style={styles.form} onSubmit={handleLogin} noValidate>
              <input
                type="email"
                placeholder="Email Address"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
              />
              <input
                type="password"
                placeholder="Password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />

              {/* Display error message inside the form area */}
              {error && <p style={styles.errorMsg}>{error}</p>}

              <div style={styles.buttonContainer}>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.loginBtn }} // Merge base and specific styles
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </button>
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.resetBtn }} // Merge base and specific styles
                  onClick={handleReset}
                  disabled={isLoggingIn}
                >
                  Reset
                </button>
              </div>

              {/* --- Register Button Added Here --- */}
              <div style={styles.registerBtnContainer}>
                <button
                    type="button" // Prevent form submission
                    style={{ ...styles.button, ...styles.registerBtn }} // Merge base and specific styles
                    onClick={handleRegisterClick}
                    disabled={isLoggingIn} // Optionally disable during login
                >
                    Register
                </button>
              </div>
              {/* --- End of Register Button --- */}

            </form>
          </div> {/* End rightSide */}

        </div> {/* End loginBox */}
      </div> {/* End contentWrapper */}

      <Footer />
    </div> // End container
  );
}

export default Login;