import { useState, useEffect } from 'react';
import { Layout, Table, Tag } from 'antd';
import axiosInstance from '../helper/axiosInstance';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { openErrorNotification } from '../helper/notification';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


const ReviewableResumePage = () => {
    const [resumes, setResumes] = useState([]);
    const navigate = useNavigate();

    const getResumes = async () => {
        try {
            const response = await axiosInstance.get("/resume/reviewable");
            setResumes(response.data.data);
        } catch (error: any) {
            console.log(error);
            openErrorNotification("Can't fetch resumes");
        }
    };

    useEffect(() => {
        getResumes();
    }, []);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Create Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: any) => moment(text).format('YYYY-MM-DD'),
        },
    ];

    const onRowClick = (record: any) => {
        navigate(`/reviewable-resume/${record.id}`);
    };

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
                    <h1 style={{ marginBottom: '10px' }}>Reviewable Resume</h1>
                    <div>
                        <Table
                            style={{ width: '1200px' }}
                            dataSource={resumes}
                            columns={columns}
                            onRow={(record) => ({
                                onClick: () => onRowClick(record),
                            })}
                        />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ReviewableResumePage;
