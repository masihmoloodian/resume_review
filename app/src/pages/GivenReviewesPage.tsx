import { useState, useEffect } from 'react';
import { Button, Layout, Table, Modal, Form, Input } from 'antd';
import axiosInstance from '../helper/axiosInstance';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { openErrorNotification, openSuccessNotification } from '../helper/notification';
import moment from 'moment';
import { getDiffieHellman } from 'crypto';

const GivenReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentReview, setCurrentReview] = useState<any>(null);
    const [deleteId, setDeleteId] = useState(null);
    const [form] = Form.useForm();

    const getReviews = async (page: any) => {
        try {
            const response = await axiosInstance.get(`/review?page=${page}`);
            setReviews(response.data.data);
            setTotalItems(response.data.metadata.total);
        } catch (error) {
            openErrorNotification("Can't fetch reviews");
        }
    };

    const getReview = async (id: any) => {
        try {
            const response = await axiosInstance.get(`/review/${id}`);
            return response.data.data;
        } catch (error) {
            openErrorNotification("Can't fetch review");
            return null;
        }
    };

    const getFile = async (id: string) => {
        try {
            const response = await axiosInstance.get(`/resume/file/${id}`);
            const fileUrl = response.data.data;
            window.open(fileUrl, '_blank');
        } catch (error: any) {
            openErrorNotification(error.response.data.message);
        }
    };

    const handleDelete = async (id: any) => {
        try {
            await axiosInstance.delete(`/review/${id}`);
            openSuccessNotification('Review deleted successfully');
            getReviews(currentPage); // Refresh the reviews list
            setIsDeleteModalVisible(false);
        } catch (error) {
            openErrorNotification("Can't delete review");
        }
    };

    useEffect(() => {
        getReviews(currentPage);
    }, [currentPage]);

    const columns = [
        {
            title: 'Create Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: any) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <span>
                    <Button type="link" onClick={(e) => { e.stopPropagation(); getFile(record.resumeId); }}>Get File</Button>
                    <Button type="link" onClick={(e) => { e.stopPropagation(); showEditModal(record); }}>Edit</Button>
                    <Button type="link" danger onClick={(e) => { e.stopPropagation(); showDeleteConfirm(record.id); }}>Delete</Button>
                </span>
            ),
        },
    ];

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
    };

    const showEditModal = async (record: any) => {
        const review = await getReview(record.id);
        if (review) {
            setCurrentReview(review);
            form.setFieldsValue({ content: review.content });
            setIsModalVisible(true);
        }
    };

    const showDeleteConfirm = (id: any) => {
        setDeleteId(id);
        setIsDeleteModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const handleUpdate = async (values: any) => {
        try {
            await axiosInstance.put(`/review/${currentReview.id}`, values);
            openSuccessNotification('Review updated successfully');
            setIsModalVisible(false);
            getReviews(currentPage); // Refresh the reviews list
        } catch (error) {
            openErrorNotification("Can't update review");
        }
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
                    <h1 style={{ marginBottom: '20px' }}>Given Reviews</h1>

                    <div>
                        <Table
                            style={{ width: '1200px' }}
                            dataSource={reviews}
                            columns={columns}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: totalItems,
                            }}
                            onChange={handleTableChange}
                        />
                    </div>

                    <Modal
                        title="Edit Review"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" onClick={() => form.submit()}>
                                Update
                            </Button>,
                        ]}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleUpdate}
                        >
                            <Form.Item
                                name="content"
                                label="Content"
                                rules={[{ required: true, message: 'Please input the review content!' }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Confirm Delete"
                        visible={isDeleteModalVisible}
                        onOk={() => handleDelete(deleteId)}
                        onCancel={handleDeleteCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <p>Are you sure you want to delete this review?</p>
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default GivenReviewsPage;
