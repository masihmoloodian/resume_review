import { useState, useEffect } from 'react';
import { Layout, Table } from 'antd';
import axiosInstance from '../helper/axiosInstance';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { openErrorNotification } from '../helper/notification';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ReviewableResumePage = () => {
    const [resumes, setResumes] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const navigate = useNavigate();

    const getResumes = async (page: number) => {
        try {
            const response = await axiosInstance.get(`/resume/reviewer?page=${page}&pageSize=${pageSize}&status=reviewable`);
            setResumes(response.data.data);
            setTotal(response.data.metadata.total);
        } catch (error: any) {
            openErrorNotification("Can't fetch resumes");
        }
    };

    useEffect(() => {
        getResumes(currentPage);
    }, [currentPage]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
    };

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
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: total,
                            }}
                            onChange={handleTableChange}
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
