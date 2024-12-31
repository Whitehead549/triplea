import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../Config/Config'; // Ensure `auth` and `db` are correctly imported
import { v4 as uuidv4 } from 'uuid';
import backgroundImage from '../assets/places/enginner.jpeg'; // Import your image
import LoaderSpinner from './LoaderSpinner'; // Import the LoaderSpinner component
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const uuid = uuidv4();
  const email = `${uuid}@example.com`;
  const password = uuid;
  const fullName = `User-${uuid}`;

  useEffect(() => {
    createUser(); // Automatically create user on component mount
  }, []);

  const createUser = async () => {
    setLoading(true);

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      await addDoc(collection(db, "users"), {
        fullName: fullName,
        email: email,
        uid: user.uid
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error creating user:", error);
      alert(`Error creating user: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      // await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.error("Error logging in:", error);
      alert(`Error logging in: ${error.message}`);
    }
  };
 

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, height: '100vh', backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        {loading && <LoaderSpinner />} {/* Display LoaderSpinner if loading is true */}
        <button
          onClick={handleLogin}
          disabled={loading} // Disable button when loading is true
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            margin: '10px',
            backgroundColor: '#007BFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Login;
