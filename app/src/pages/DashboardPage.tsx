import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';

const DashboardPage = () => {
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
                    <div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardPage;