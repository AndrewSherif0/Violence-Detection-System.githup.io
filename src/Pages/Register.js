import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/8334315.png'; // Logo for the form side
import Footer from '../components/Footer';
import '../cssFolder/Login.css'; // Keep using Login.css if styles are shared or rename/create Register.css
import img2 from '../assets/final.png'; // Background image

// Styles remain the same as the previous version
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
    padding: '40px',
    backgroundImage: `url(${img2})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  loginBox: {
    display: 'flex',
    minHeight: "680px",
    flexDirection: 'row',
    width: '80%',
    maxWidth: '1000px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  },
  leftSide: {
    color: 'white',
    flex: 1,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  logoText: {
    fontSize: 'clamp(40px, 6vw, 70px)',
    fontWeight: 'bolder',
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.2,
    position: 'relative',
  },
  spanSystem: {
    fontSize: 'clamp(30px, 4vw, 50px)',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  rightSide: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    color: '#333',
    flex: 1,
    padding: '30px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    maxWidth: '100px',
    height: 'auto',
    marginBottom: '25px',
    transform: 'scaleX(-1)',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '14px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#333',
    '&::placeholder': {
      color: '#888',
    },
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    fontWeight: 'bold',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: 'rgb(0 30 61)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(0, 50, 100)',
    },
  },
  resetBtn: {
    flex: 1,
    backgroundColor: 'rgb(99 6 15)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(130, 10, 25)',
    },
  },
  backToLoginBtnContainer: {
    marginTop: '15px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  backToLoginBtn: {
    width: '100%',
    maxWidth: '250px',
    backgroundColor: '#6c757d',
    color: 'white',
    '&:hover': {
      backgroundColor: '#5a6268',
    },
  },
  errorMsg: {
    color: '#D8000C',
    backgroundColor: '#FFD2D2',
    border: '1px solid #D8000C',
    borderRadius: '5px',
    padding: '8px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '3px',
    marginBottom: '3px',
  },
   successMsg: {
    color: '#2F855A',
    backgroundColor: '#E6FFFA',
    border: '1px solid #38A169',
    borderRadius: '5px',
    padding: '8px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '3px',
    marginBottom: '3px',
  },
  spinnerWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '6px solid #ccc',
    borderTop: '6px solid rgb(0 30 61)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

const spinnerStyle = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

function Register() {
  // State variables remain the same
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsRegistering(true);

    if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        setIsRegistering(false);
        return;
    }
    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsRegistering(false);
        return;
    }

    try {
      const response = await fetch('http://141.147.83.47:8083/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Add password_confirmation to the request body
        body: JSON.stringify({ name, email, password, password_confirmation: password }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) { // Check for token and user object
        // --- AUTO-LOGIN LOGIC ---
        setSuccess(data.message || 'Registration successful! Logging you in...'); // Use server message
        setError('');

        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        const role = data.user?.roles?.[0] || 'user'; // Safely get role, default to 'user'
        localStorage.setItem('role', role);
        localStorage.setItem('name', data.user?.name || 'User'); // Safely get name, default to 'User'

        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Redirect to the appropriate dashboard immediately (or after a very short delay)
        // Optional: Short delay to show success message
        setTimeout(() => {
            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        }, 500); // 0.5 second delay (adjust or remove if not needed)

      } else {
        // Registration failed or response format incorrect
        setError(data.message || 'Registration failed. Please try again.');
        setSuccess('');
      }
    } catch (err) {
        console.error("Registration API error:", err);
        setError('Registration failed. Could not connect to the server.');
        setSuccess('');
    } finally {
      setIsRegistering(false);
    }
  };

  // handleReset and handleLoginClick remain the same
    const handleReset = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
    };

    const handleLoginClick = () => {
        navigate('/');
    };

  // --- Render Logic ---
  if (loading) {
    return (
        <div style={styles.spinnerWrapper}>
          <style>{spinnerStyle}</style>
          <div style={styles.spinner}></div>
        </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{spinnerStyle}</style>
      {isRegistering && (
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
        </div>
      )}

      <div style={styles.contentWrapper}>
        <div style={styles.loginBox}>

          {/* Left side */}
          <div style={styles.leftSide}>
            <div style={styles.logoText } className='Surveillance'>Surveillance</div>
            <span style={styles.spanSystem}>System</span>
          </div>

          {/* Right side */}
          <div style={styles.rightSide}>
            <img src={img1} alt="System Logo" style={styles.logoImage} />
            <h2 style={{ marginBottom: '15px', color: 'rgb(0 30 61)'}}>Create your account</h2>
            <form style={styles.form} onSubmit={handleRegister} noValidate>
              {/* Input fields including Confirm Password */}
              <input
                type="text"
                placeholder="Full Name"
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Full Name"
              />
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
              <input
                type="password"
                placeholder="Confirm Password"
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-label="Confirm Password"
              />

              {/* Messages */}
              {error && <p style={styles.errorMsg}>{error}</p>}
              {success && <p style={styles.successMsg}>{success}</p>}

              {/* Buttons */}
              <div style={styles.buttonContainer}>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.submitBtn }}
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Registering...' : 'Register'}
                </button>
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.resetBtn }}
                  onClick={handleReset}
                  disabled={isRegistering}
                >
                  Reset
                </button>
              </div>

              {/* Back to Login */}
              <div style={styles.backToLoginBtnContainer}>
                <button
                    type="button"
                    style={{ ...styles.button, ...styles.backToLoginBtn }}
                    onClick={handleLoginClick}
                    disabled={isRegistering}
                >
                    Back to Login
                </button>
              </div>
            </form>
          </div> {/* End rightSide */}

        </div> {/* End loginBox */}
      </div> {/* End contentWrapper */}

      <Footer />
    </div> // End container
  );
}

export default Register;




