import React, { useState } from 'react';
import InputField from '../components/InputField';
import axiosInstance from '../helper/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { openErrorNotification, openSuccessNotification } from '../helper/notification';
import { Button } from 'antd';


interface FormData {
    email: string;
    password: string;
    code: string;
}

const ForgetPassPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ email: '', password: '', code: '' });
    const [sendRequest, setSendRequest] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRequest = async () => {
        try {
            await axiosInstance.post("/auth/forget-password/request", {
                email: formData.email
            });
            openSuccessNotification("Code sent")
            setSendRequest(true)
            navigate('/login')
        } catch (error: any) {
            openErrorNotification(error.response.data.message)
        }
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post("/auth/forget-password/submit", formData);
            openSuccessNotification("Password updated")
        } catch (error: any) {
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
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Forget Password</h2>

                {!sendRequest && (
                    <>
                        <InputField
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                            style={{ marginBottom: '16px', width: '100%' }}
                        />
                        <Button
                            type="primary"
                            onClick={handleRequest}
                            style={{ width: '100%', backgroundColor: '#000', borderColor: '#000', marginBottom: '20px' }}
                        >
                            Request Forget Password
                        </Button>
                    </>
                )}

                {sendRequest && (
                    <>
                        <InputField
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                            style={{ marginBottom: '16px', width: '100%' }}
                        />
                        <InputField
                            placeholder="New Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                            style={{ marginBottom: '16px', width: '100%' }}
                        />

                        <InputField
                            placeholder="Code"
                            type="text"
                            value={formData.code}
                            onChange={handleChange}
                            name="code"
                            style={{ marginBottom: '16px', width: '100%' }}
                        />
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            style={{ width: '100%', backgroundColor: '#000', borderColor: '#000', marginBottom: '20px' }}
                        >
                            Submit Forget Password
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgetPassPage;
