import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Table, Tag, Button, Row, Col, Modal, Tooltip } from 'antd';
import axiosInstance from '../helper/axiosInstance';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { openErrorNotification } from '../helper/notification';
import moment from 'moment';

const ResumeSinglePage = () => {
    const { id } = useParams<{ id: string }>();
    const [resume, setResume] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const getResume = async () => {
        try {
            const response = await axiosInstance.get(`/resume/${id}`);
            setResume(response.data.data);
        } catch (error: any) {
            console.log(error);
            openErrorNotification("Can't fetch resume details");
        }
    };

    useEffect(() => {
        getResume();
    }, [id]);

    const showModal = (content: string) => {
        setModalContent(content);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const viewResume = async () => {
        try {
            const response = await axiosInstance.get(`/resume/file/${id}`);
            const fileUrl = response.data.data;

            window.open(fileUrl, '_blank');
        } catch (error: any) {
            console.log(error);
            openErrorNotification("Can't fetch resume file");
        }
    };

    if (!resume) {
        return <div>Loading...</div>;
    }

    const reviewColumns = [
        {
            title: 'Review Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: any) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text: any) => (
                <Tooltip title={text.length > 20 ? text : ''}>
                    <span onClick={() => showModal(text)}>
                        {text.length > 20 ? `${text.substring(0, 20)}...` : text}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Anonymous',
            dataIndex: 'anonymous',
            key: 'anonymous',
            render: (text: any) => (
                <Tag color={text ? 'green' : 'red'}>
                    {text ? 'Yes' : 'No'}
                </Tag>
            ),
        },
    ];

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
                    <h1 style={{ marginBottom: '10px' }}>{resume.title}</h1>
                    <Row gutter={[8, 8]}>
                        <Col span={4}>
                            <p>Reviewable: <span style={{ color: resume.isReviewable ? 'green' : 'red' }}>{resume.isReviewable ? 'Yes' : 'No'}</span></p>
                        </Col>
                        <Col span={5}>
                            <p>Create Date: {moment(resume.created_at).format('YYYY-MM-DD')}</p>
                        </Col>
                        <Col span={4}>
                            <p>Update Date: {moment(resume.updated_at).format('YYYY-MM-DD')}</p>
                        </Col>
                    </Row>
                    <Button type="primary" onClick={viewResume} style={{ marginTop: '16px' }}>View Resume</Button>

                    <h2 style={{ marginTop: '20px' }}>Received Reviews</h2>
                    <Table dataSource={resume.review} columns={reviewColumns} rowKey="id" />

                    <Modal title="Review Content" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <p>{modalContent}</p>
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ResumeSinglePage;