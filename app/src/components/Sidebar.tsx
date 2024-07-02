import React, { useState } from 'react';
import { Button, Drawer, Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
const { Sider } = Layout;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [visible, setVisible] = useState(false);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleDrawer = () => {
        setVisible(!visible);
    };

    const menu = (
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
            {!collapsed && (
                <h2 style={{ color: 'black', marginBottom: '30px', marginLeft: '25px', marginTop: '30px' }} >Resume Review</h2>
            )}

            <Menu.Item key="dashboard" style={{ backgroundColor: 'white', color: 'black' }} onClick={() => navigate('/dashboard')}>
                Dashboard
            </Menu.Item>

            <Menu.Item key="resume" style={{ backgroundColor: 'white', color: 'black' }} onClick={() => navigate('/resume')}>
                My Resumes
            </Menu.Item>

            <Menu.Item key="reviewable-resume" style={{ backgroundColor: 'white', color: 'black' }} onClick={() => navigate('/reviewable-resume')}>
                Reviewable Resume
            </Menu.Item>

            <Menu.Item key="given-reviews" style={{ backgroundColor: 'white', color: 'black' }} onClick={() => navigate('/given-reviews')}>
                Given Reviews
            </Menu.Item>

            <Menu.Item key="logout" style={{ backgroundColor: 'white', color: 'black' }} onClick={logout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Button className="burger-menu" onClick={toggleDrawer} style={{ marginBottom: '20px', marginLeft: '20px', marginTop: '10px' }}>
                <MenuOutlined />
            </Button>
            <Drawer title="Menu" placement="left" onClose={toggleDrawer} visible={visible}>
                {menu}
            </Drawer>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ background: 'white' }} className="desktop-sidebar">
                {menu}
            </Sider>
        </>
    );
};

export default Sidebar;
