import React, { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import axiosInstance from '../helper/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';
import { openErrorNotification, openSuccessNotification } from '../helper/notification';
import { Button } from 'antd';

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setFormData({
        ...formData,
        ['email']: email,
      });
    }
  }, []);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      localStorage.setItem('email', formData.email);
      const response = await axiosInstance.post("/auth/login", formData);

      setLoading(false)
      if (response.status === 201) {
        openSuccessNotification("Login Successfully")
        const token = response.data.data.accessToken;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      }
    } catch (error: any) {
      setLoading(false)
      openErrorNotification(error.response.data.message)
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'white',
      backgroundImage: `url('/looper.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
    >
      <img src='/logo.png' alt="Logo" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        width: '100px',
        height: 'auto',
      }} />

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Slightly transparent background for form container to ensure readability
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Login</h2>
        <InputField
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          name="email"
          style={{ marginBottom: '16px', width: '100%' }}
        />
        <InputField
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          style={{ marginBottom: '16px', width: '100%' }}
        />

        <Button
          loading={loading}
          type="primary"
          onClick={handleSubmit}
          style={{ width: '100%', backgroundColor: '#000', borderColor: '#000', marginBottom: '20px' }}
        >
          Login
        </Button>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <small>
            <Link
              onClick={() => navigate('/register')}
              style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}
            >
              Don't have an account? Sign up now!
            </Link>
          </small>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <small>
            <Link
              onClick={() => navigate('/forget-password')}
              style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }} // Change text color to black
            >
              Forgot password?
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
