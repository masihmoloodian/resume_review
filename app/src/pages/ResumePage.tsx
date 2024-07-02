import { useState, useEffect } from 'react';
import { Layout, Table, Tag, Button, Modal, Form, Input, Select, Upload, Popconfirm } from 'antd';
import axiosInstance from '../helper/axiosInstance';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { openErrorNotification, openSuccessNotification } from '../helper/notification';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const ResumePage = () => {
    const [resumes, setResumes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [editingResume, setEditingResume] = useState<any>(null);

    const getResumes = async () => {
        try {
            const response = await axiosInstance.get("/resume");
            setResumes(response.data.data);
        } catch (error: any) {
            console.log(error);
            openErrorNotification("Can't fetch resumes");
        }
    };

    useEffect(() => {
        getResumes();
    }, []);

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

            const updateData: any = {};
            Object.keys(values).forEach((key) => {
                if (values[key] !== editingResume[key]) {
                    updateData[key] = values[key];
                }
            });

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
                    ...values,
                    objectKey,
                });
                openSuccessNotification("Resume added successfully");
            }

            setIsModalVisible(false);
            getResumes();
        } catch (error) {
            console.log(error);
            openErrorNotification("Failed to add or update resume");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/resume/${id}`);
            openSuccessNotification("Resume deleted successfully");
            getResumes();
        } catch (error) {
            console.error("Delete failed:", error);
            openErrorNotification("Failed to delete resume");
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Visibility',
            dataIndex: 'visibility',
            key: 'visibility',
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
            title: 'Anonymous',
            dataIndex: 'isAnonymous',
            key: 'isAnonymous',
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
                    <Button type="link" onClick={() => showModal(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure delete this resume?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </span>
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
                    <h1 style={{ marginBottom: '15px' }}>My Resumes</h1>
                    <Button type="primary" onClick={() => showModal()} style={{ marginBottom: '16px' }}>
                        Add Resume
                    </Button>
                    <div>
                        <Table style={{ width: '1200px' }} dataSource={resumes} columns={columns} />
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
                        name="visibility"
                        label="Visibility"
                        rules={[{ required: !editingResume, message: 'Please select visibility' }]}
                    >
                        <Select>
                            <Option value="public">Public</Option>
                            <Option value="private">Private</Option>
                        </Select>
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
                        name="isAnonymous"
                        label="Anonymous"
                        rules={[{ required: !editingResume, message: 'Please select if anonymous' }]}
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
        </Layout>
    );
};

export default ResumePage;
