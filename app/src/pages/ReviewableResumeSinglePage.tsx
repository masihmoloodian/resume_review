import { useState, useEffect } from 'react';
import { Layout, Button, Input, Form } from 'antd';
import axiosInstance from '../helper/axiosInstance';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { openErrorNotification, openSuccessNotification } from '../helper/notification';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;

const ReviewableResumeSinglePage = () => {
    const [resume, setResume] = useState<any>(null);
    const { id } = useParams();

    const getResume = async () => {
        try {
            const response = await axiosInstance.get(`/resume/reviewer/${id}?status=reviewable`);
            setResume(response.data);
        } catch (error: any) {
            openErrorNotification("Can't fetch resume details");
        }
    };

    const saveReview = async (values: any) => {
        try {
            await axiosInstance.post('/review', {
                resumeId: id,
                content: values.content,
            });
            openSuccessNotification("Review submitted successfully");
        } catch (error: any) {
            openErrorNotification(error.response.data.message);
        }
    };

    const viewResume = async () => {
        try {
            const response = await axiosInstance.get(`/resume/file/${id}`);
            const fileUrl = response.data.data;
            window.open(fileUrl, '_blank');
        } catch (error: any) {
            openErrorNotification(error.response.data.message)
        }
    };

    useEffect(() => {
        getResume();
    }, [id]);

    return (
        <Layout style={{
            minHeight: '100vh',
            width: '100vw',
            backgroundImage: `url('/looper.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
        }}>
            <Sidebar />
            <Layout style={{ background: 'none' }}>
                <Content style={{
                    margin: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    padding: '20px',
                    borderRadius: '8px',
                    overflow: 'auto'
                }}>
                    {resume ? (
                        <>
                            <h1 style={{ marginBottom: '10px' }}>{resume.title}</h1>
                            <a href={resume.url} target="_blank" rel="noopener noreferrer">
                                <Button type="primary" onClick={viewResume} style={{ marginTop: '16px' }}>View Resume</Button>
                            </a>
                            <Form
                                layout="vertical"
                                onFinish={saveReview}
                                style={{ marginTop: '20px' }}
                            >
                                <Form.Item
                                    name="content"
                                    label="Review"
                                    rules={[{ required: true, message: 'Please enter your review' }]}
                                >
                                    <TextArea rows={8} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit Review
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ReviewableResumeSinglePage;
