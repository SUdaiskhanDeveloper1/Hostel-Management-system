import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Space,
  Typography,
  Button,
  message,
  Popconfirm,
  Tag,
  Checkbox,
  Card,
  Form,
  Input,
} from "antd";

import {
  HomeOutlined,
  UserOutlined,
  BankOutlined,
  BuildOutlined,
  DollarOutlined,
  LockOutlined,
  LogoutOutlined,
  TeamOutlined,
  ToolOutlined,
  WalletOutlined,
  ThunderboltOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import api from "./api/axiosConfig";
import { GlobalProvider } from "./context/GlobalContext";
import Dashboard from "./components/Dashboard";
import Rooms from "./components/Rooms";
import Students from "./components/Students";
import Workers from "./components/Workers";
import StaffPayment from "./components/StaffPayment";
import Expenses from "./components/Expenses";
import Revenue from "./components/Revenue";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const LoginPage = ({ onLogin }) => (
  // ... keep same auth code
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #001529, #003a8c)",
      overflow: "hidden",
    }}
  >
    {/* <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, background: "rgba(24, 144, 255, 0.15)", borderRadius: "50%", filter: "blur(80px)" }} />
    <div style={{ position: "absolute", bottom: -100, right: -100, width: 400, height: 400, background: "rgba(82, 196, 26, 0.1)", borderRadius: "50%", filter: "blur(80px)" }} /> */}

    <Card
      style={{
        width: 460,
        borderRadius: 20,
        boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      bodyStyle={{ padding: "50px 45px" }}
    >
      {" "}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <BankOutlined style={{ fontSize: 40, color: "#1890ff" }} />
        <Title level={2} style={{ color: "#fff", fontWeight: 700, margin: 0 }}>
          Abu Hashim Hostel
        </Title>
      </div>
      {/* <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>Sign in to continue</Text> */}
      <Form onFinish={onLogin} layout="vertical" style={{ marginTop: 30 }}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
            placeholder="Enter Email"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              height: 50,
              borderRadius: 10,
            }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: "rgba(255,255,255,0.4)" }} />}
            placeholder="Enter Password"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              height: 50,
              borderRadius: 10,
            }}
          />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 25,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <Checkbox style={{ color: "rgba(255,255,255,0.6)" }}>
            Remember me
          </Checkbox>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          style={{
            borderRadius: 10,
            height: 50,
            fontWeight: 600,
            fontSize: 16,
            background: "linear-gradient(90deg, #1890ff, #0050b3)",
            border: "none",
            boxShadow: "0 4px 15px rgba(24, 144, 255, 0.4)",
          }}
        >
          Login
        </Button>
      </Form>
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 20,
          paddingBottom: 10,
          color: "rgba(255,255,255,0.5)",
          fontSize: 13,
        }}
      >
        © {new Date().getFullYear()} Abu Hashim Hostel. All Rights Reserved.
      </div>
    </Card>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [activeKey, setActiveKey] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const onLogin = async (values) => {
    try {
      const { data } = await api.post("/auth/login", {
        email: values.username,
        password: values.password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      message.success("Logged in successfully");
    } catch (error) {
      message.error(
        "Login failed: " + (error.response?.data?.message || error.message),
      );
    }
  };

  const onLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    message.success("Logged out");
  };

  if (!user) return <LoginPage onLogin={onLogin} />;

  const renderContent = () => {
    return (
      <GlobalProvider>
        <div style={{ position: "relative" }}>
          <div
            style={{ display: activeKey === "dashboard" ? "block" : "none" }}
          >
            <Dashboard activeKey={activeKey} />
          </div>
          <div style={{ display: activeKey === "rooms" ? "block" : "none" }}>
            <Rooms />
          </div>
          <div style={{ display: activeKey === "students" ? "block" : "none" }}>
            <Students />
          </div>
          <div style={{ display: activeKey === "workers" ? "block" : "none" }}>
            <Workers />
          </div>
          <div
            style={{
              display: activeKey === "staff-payments" ? "block" : "none",
            }}
          >
            <StaffPayment />
          </div>
          <div style={{ display: activeKey === "expenses" ? "block" : "none" }}>
            <Expenses />
          </div>
          <div style={{ display: activeKey === "payments" ? "block" : "none" }}>
            <Revenue activeKey={activeKey} />
          </div>
        </div>
      </GlobalProvider>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        style={{ background: "#001529" }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <BankOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          {!collapsed && (
            <Text
              style={{
                color: "#fff",
                fontWeight: 800,
                marginLeft: 12,
                fontSize: 18,
              }}
            >
              HMS SYSTEM
            </Text>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={({ key }) => setActiveKey(key)}
          items={[
            { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
            { key: "rooms", icon: <BuildOutlined />, label: "Rooms" },
            { key: "students", icon: <TeamOutlined />, label: "Students" },
            {
              key: "payments",
              icon: <DollarOutlined />,
              label: "Student Fees",
            },
            {
              key: "workers",
              icon: <UserOutlined />,
              label: "Staff Directory",
            },
            {
              key: "staff-payments",
              icon: <WalletOutlined />,
              label: "Staff Payroll",
            },
            {
              key: "expenses",
              icon: <ThunderboltOutlined />,
              label: "Expenses",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {/* <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} /> */}
          <Space>
            <Popconfirm title="Logout?" onConfirm={onLogout}>
              <Button type="text" danger icon={<LogoutOutlined />}>
                Logout
              </Button>
            </Popconfirm>{" "}
          </Space>
        </Header>
        <Content style={{ margin: "24px" }}>{renderContent()}</Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#f4f7fe",
            fontSize: 14,
            color: "#888",
            padding: "12px 50px",
          }}
        >
          © {new Date().getFullYear()} Abu Hashim Hostel. All Rights Reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}
