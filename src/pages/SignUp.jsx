// Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Config/Config';
import { collection, addDoc } from 'firebase/firestore';
import backgroundImage from '../assets/places/enginner.jpeg'; // Import your image
import LoaderSpinner from './LoaderSpinner'; // Import the LoaderSpinner component

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before signup process starts

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adding user to Firestore
      await addDoc(collection(db, 'users'), {
        fullName: fullName,
        email: email,
        uid: user.uid,
      });

      setSuccessMsg(`Signed up as ${user.email}`);
      setFullName('');
      setEmail('');
      setPassword('');
      setErrorMsg('');

      setTimeout(() => {
        setSuccessMsg('');
        navigate('/login');
      }, 3000);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setErrorMsg('Invalid email address');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Email already in use');
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters');
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false); // Set loading to false after signup process completes (success or failure)
    }
  };

  return (
    <div
      className="container mx-auto mt-20 px-4 py-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="rounded-lg p-8 shadow-lg mt-20 pt-20" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)' }}>
        <h1 className="text-3xl font-semibold mb-4">Register/Sign Up</h1>
        <hr className="mb-4" />
        {successMsg && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMsg}</div>
        )}
        <form className="space-y-4" autoComplete="off" onSubmit={handleSignup}>
          <div>
            <label htmlFor="fullName" className="block mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input w-full px-3 py-2 border rounded bg-gray-200"
              required
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input w-full px-3 py-2 border rounded bg-gray-200"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input w-full px-3 py-2 border rounded bg-gray-200"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="flex justify-between items-center">
            <span>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 font-semibold underline">
                Login here
              </Link>
            </span>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <LoaderSpinner /> // Show LoaderSpinner while loading
              ) : (
                'SignUp'
              )}
            </button>
          </div>
        </form>
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 mt-4 rounded">{errorMsg}</div>
        )}
      </div>
    </div>
  );
};

export default Signup;
