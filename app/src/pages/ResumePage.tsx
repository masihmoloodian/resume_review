import { useState, useEffect } from 'react';
import { Layout, Table, Tag, Button, Modal, Form, Input, Select, Upload, Switch } from 'antd';
import axiosInstance from '../helper/axiosInstance';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { openErrorNotification, openSuccessNotification } from '../helper/notification';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ResumePage = () => {
    const [resumes, setResumes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [editingResume, setEditingResume] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [keepFile, setKeepFile] = useState(true);
    const [deletingResumeId, setDeletingResumeId] = useState<number | null>(null);
    const navigate = useNavigate();

    const getResumes = async (page: number) => {
        try {
            const response = await axiosInstance.get(`/resume?page=${page}`);
            setResumes(response.data.data.data);
            setTotalItems(response.data.data.metadata.total);
        } catch (error: any) {
            console.log(error);
            openErrorNotification("Can't fetch resumes");
        }
    };

    useEffect(() => {
        getResumes(currentPage);
    }, [currentPage]);

    const showModal = (resume = null) => {
        if (resume) {
            form.setFieldsValue(resume);
            setEditingResume(resume);
        } else {
            form.resetFields();
            setEditingResume(null);
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file as any);

        try {
            setUploading(true);
            const response = await axiosInstance.post('/storage/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data.key;
        } catch (error) {
            console.error("Upload failed:", error);
            openErrorNotification("File upload failed");
            setUploading(false);
            return null;
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            let objectKey = null;

            if (file) {
                objectKey = await handleUpload();
                if (!objectKey) return;
            }

            const updateData: any = {
                title: values.title,
                isReviewable: values.isReviewable,
            };

            if (objectKey) {
                updateData['objectKey'] = objectKey;
            }

            if (editingResume) {
                await axiosInstance.put(`/resume/${editingResume.id}`, updateData);
                openSuccessNotification("Resume updated successfully");
            } else {
                if (!file) {
                    openErrorNotification("Please select a file before submitting");
                    return;
                }

                await axiosInstance.post("/resume", {
                    title: values.title,
                    isReviewable: values.isReviewable,
                    objectKey,
                });
                openSuccessNotification("Resume added successfully");
            }

            setIsModalVisible(false);
            getResumes(currentPage);
        } catch (error) {
            console.log(error);
            openErrorNotification("Failed to add or update resume");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (deletingResumeId !== null) {
            try {
                await axiosInstance.delete(`/resume/${deletingResumeId}?keepFile=${keepFile}`);
                openSuccessNotification("Resume deleted successfully");
                getResumes(currentPage);
            } catch (error) {
                console.error("Delete failed:", error);
                openErrorNotification("Failed to delete resume");
            } finally {
                setIsDeleteModalVisible(false);
                setDeletingResumeId(null);
            }
        }
    };

    const handleDelete = (id: number) => {
        setDeletingResumeId(id);
        setIsDeleteModalVisible(true);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Reviewable',
            dataIndex: 'isReviewable',
            key: 'isReviewable',
            render: (text: any) => (
                <Tag color={text ? 'green' : 'red'}>
                    {text ? 'Yes' : 'No'}
                </Tag>
            ),
        },
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
                    <Button type="link" onClick={(e) => { e.stopPropagation(); showModal(record); }}>Edit</Button>
                    <Button type="link" danger onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}>Delete</Button>
                </span>
            ),
        },
    ];

    const onRowClick = (record: any) => {
        navigate(`/resume/${record.id}`);
    };

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
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
                    <h1 style={{ marginBottom: '20px' }}>My Resumes</h1>
                    <Button type="primary" onClick={() => showModal()} style={{ marginBottom: '16px' }}>
                        Add Resume
                    </Button>
                    <div>
                        <Table
                            style={{ width: '1200px' }}
                            dataSource={resumes}
                            columns={columns}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: totalItems,
                            }}
                            onChange={handleTableChange}
                            onRow={(record) => ({
                                onClick: () => onRowClick(record),
                            })}
                        />
                    </div>
                </Content>
            </Layout>
            <Modal
                title={editingResume ? "Edit Resume" : "Add Resume"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={uploading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: !editingResume, message: 'Please enter the resume title' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="isReviewable"
                        label="Reviewable"
                        rules={[{ required: !editingResume, message: 'Please select if reviewable' }]}
                    >
                        <Select>
                            <Option value={true}>Yes</Option>
                            <Option value={false}>No</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Upload Resume"
                    >
                        <Upload
                            accept=".pdf"
                            beforeUpload={(file: any) => {
                                setFile(file);
                                return false;
                            }}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Delete Resume"
                visible={isDeleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this resume?</p>

                <Switch checked={keepFile} onChange={setKeepFile} /> Keep File
                <p>By allowing us to keep your file, you help improve our system and support the community.</p>
            </Modal>
        </Layout>
    );
};

export default ResumePage;
