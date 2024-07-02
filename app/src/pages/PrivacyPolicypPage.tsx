// src/pages/PrivacyPolicyPage.tsx

import React from 'react';
import { Layout, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

const { Title, Paragraph } = Typography;

const PrivacyPolicyPage: React.FC = () => {
    return (
        <Layout style={{ padding: '24px', background: '#fff' }}>
            <Content>
                <Typography>
                    <Title level={2}>Privacy Policy</Title>

                    <Title level={4}>Introduction</Title>
                    <Paragraph>
                        Welcome to Resume Review, a resume review application designed to help users improve their resumes through peer reviews. By using our website, you agree to the terms outlined in this Privacy Policy. Please read it carefully to understand how we collect, use, and share your information.
                    </Paragraph>

                    <Title level={4}>Information We Collect</Title>
                    <Paragraph>
                        We collect the following types of information:
                        <ul>
                            <li><strong>Uploaded Documents:</strong> Users can upload resumes and other documents for review. By uploading these files, you agree that their contents can be shared with all users on the platform.</li>
                            <li><strong>User Data:</strong> Information you provide when you register, such as your name, email address, and other contact details.</li>
                            <li><strong>Review Data:</strong> Comments and feedback you provide on other users’ resumes.</li>
                            <li><strong>Usage Data:</strong> Information about how you use the site, such as your interactions with other users and the content you upload or review.</li>
                        </ul>
                    </Paragraph>

                    <Title level={4}>User Responsibilities</Title>
                    <Paragraph>
                        <ul>
                            <li><strong>Sensitive Information:</strong> Users must remove any sensitive information from their resumes or other documents before uploading. Sensitive information includes, but is not limited to, personal identification numbers, financial information, and private addresses.</li>
                            <li><strong>Data Management:</strong> Users are responsible for managing and backing up their data. This includes uploaded documents, reviews, and any other data entered on the site.</li>
                            <li><strong>Public Mode:</strong> By setting your resume to public mode, you permit anyone to use the data contained in your resume for any purpose.</li>
                        </ul>
                    </Paragraph>

                    <Title level={4}>Data Use</Title>
                    <Paragraph>
                        We use the information collected for the following purposes:
                        <ul>
                            <li><strong>Service Provision:</strong> To operate and improve the resume review service.</li>
                            <li><strong>Communication:</strong> To contact you about updates, offers, and other information related to our services.</li>
                            <li><strong>User Experience:</strong> To personalize your experience on the site.</li>
                        </ul>
                    </Paragraph>

                    <Title level={4}>Data Sharing</Title>
                    <Paragraph>
                        <ul>
                            <li><strong>Public Resumes:</strong> Resumes set to public mode can be accessed and used by any user for any purpose.</li>
                            <li><strong>Internal Use:</strong> We may share your information within our organization to improve our services.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
                        </ul>
                    </Paragraph>

                    <Title level={4}>Data Security</Title>
                    <Paragraph>
                        We implement appropriate technical and organizational measures to protect your data. However, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee its absolute security.
                    </Paragraph>

                    <Title level={4}>Changes to This Privacy Policy</Title>
                    <Paragraph>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                    </Paragraph>

                    <Title level={4}>Contact Us</Title>
                    <Paragraph>
                        If you have any questions about this Privacy Policy, please contact us at masihmoloodian@gmail.com.
                    </Paragraph>

                    <Paragraph>
                        By using our site, you acknowledge that you have read and understood this Privacy Policy and agree to be bound by its terms.
                    </Paragraph>
                </Typography>
            </Content>
        </Layout>
    );
};

export default PrivacyPolicyPage;
