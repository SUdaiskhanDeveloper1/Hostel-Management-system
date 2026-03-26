import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Layout, Menu, Card, Table, Button, Modal, Form,
  Input, Select, Tag, Badge, Statistic, Row, Col,
  Space, Typography, Progress, Divider, message,
  InputNumber, Popconfirm, DatePicker, Tabs, Descriptions, Checkbox
} from "antd";

import {
  HomeOutlined, UserOutlined, BankOutlined,
  DollarOutlined, SettingOutlined, LockOutlined,
  LogoutOutlined, PlusOutlined,
  DeleteOutlined, TeamOutlined,
  WalletOutlined, ToolOutlined,
  ThunderboltOutlined, FireOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined,
  HistoryOutlined, RiseOutlined, FallOutlined,
  EyeOutlined, EditOutlined
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;


const INITIAL_STUDENTS = [
  { id: "S101", name: "Ahmed Ali", phone: "0300-1234567", room: "101", status: "Active", cnic: "42101-1234567-1", guardian: "Ali Khan", joined: "2025-01-01" },
  { id: "S102", name: "Sara Ahmed", phone: "0301-2345678", room: "202", status: "Active", cnic: "42101-7654321-2", guardian: "Ahmed Jan", joined: "2025-02-05" },
];

const INITIAL_ROOMS = [
  { id: 1, roomNo: "101", type: "Double", capacity: 2, occupied: 1, fee: 6000, status: "Available" },
  { id: 2, roomNo: "102", type: "Single", capacity: 1, occupied: 1, fee: 8000, status: "Full" },
];

const INITIAL_PAYMENTS = [
  { id: 1, name: "Ahmed Ali", room: "101", month: "January 2025", amount: 6000, date: "2025-01-01", status: "Paid" },
  { id: 2, name: "Sara Ahmed", room: "202", month: "February 2025", amount: 8000, date: "2025-02-05", status: "Paid" },
];

const INITIAL_WORKERS = [
  { id: 1, name: "Ghulam Nabi", role: "Guard", salary: 25000, phone: "0321-1112223" },
];

const INITIAL_WORKER_PAYMENTS = [
  { id: 1, workerName: "Ghulam Nabi", month: "January 2025", amount: 25000, date: "2025-01-05", status: "Paid" },
];

const INITIAL_EXPENSES = [
  { id: 1, category: "Electricity", amount: 12500, month: "January 2025", date: "2025-01-10", description: "WAPDA Bill" },
];

const LoginPage = ({ onLogin }) => (
   <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #001529, #003a8c)",
      }}
    >
      <Card
        style={{
          width: 380,
          borderRadius: 16,
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <BankOutlined
          style={{ fontSize: 45, color: "#1890ff", marginBottom: 10 }}
        />

        <Title level={3} style={{ marginBottom: 0 }}>
          HMS ELITE
        </Title>
        <Text type="secondary">Login to your account</Text>

        {/* Form */}
        <Form
          onFinish={onLogin}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          {/* Username */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Enter Username"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Enter Password"
            />
          </Form.Item>

          {/* Extra Options */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <Checkbox>Remember me</Checkbox>
            {/* <a href="#">Forgot password?</a> */}
          </div>

          {/* Button */}
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            style={{
              borderRadius: 8,
              height: 45,
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
);


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();

  // Persistence Helper
  const getInitialData = (key, fallback) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  // States
  const [students, setStudents] = useState(() => getInitialData("hms_students", INITIAL_STUDENTS));
  const [rooms, setRooms] = useState(() => getInitialData("hms_rooms", INITIAL_ROOMS));
  const [payments, setPayments] = useState(() => getInitialData("hms_payments", INITIAL_PAYMENTS));
  const [workers, setWorkers] = useState(() => getInitialData("hms_workers", INITIAL_WORKERS));
  const [workerPayments, setWorkerPayments] = useState(() => getInitialData("hms_worker_payments", INITIAL_WORKER_PAYMENTS));
  const [expenses, setExpenses] = useState(() => getInitialData("hms_expenses", INITIAL_EXPENSES));

  // Modal States
  const [modal, setModal] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  // Sync to LocalStorage
  React.useEffect(() => {
    localStorage.setItem("hms_students", JSON.stringify(students));
    localStorage.setItem("hms_rooms", JSON.stringify(rooms));
    localStorage.setItem("hms_payments", JSON.stringify(payments));
    localStorage.setItem("hms_workers", JSON.stringify(workers));
    localStorage.setItem("hms_worker_payments", JSON.stringify(workerPayments));
    localStorage.setItem("hms_expenses", JSON.stringify(expenses));
  }, [students, rooms, payments, workers, workerPayments, expenses]);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  // Financial Helpers
  const sum = (arr) => arr.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const income = sum(payments);
  const payroll = sum(workerPayments);
  const bills = sum(expenses);
  const monthlySalaryLiability = workers.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
  const outflow = payroll + bills;
  const balance = income - outflow;

  const renderDashboard = () => (
    <div style={{ padding: '0 4px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderLeft: '6px solid #52c41a', borderRadius: 8 }}>
            <Statistic title="Total Revenue" value={income} prefix={<RiseOutlined />} suffix="PKR" valueStyle={{ color: '#3f8600', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderLeft: '6px solid #f5222d', borderRadius: 8 }}>
            <Statistic title="Total Outflow" value={outflow} prefix={<FallOutlined />} suffix="PKR" valueStyle={{ color: '#cf1322', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderLeft: '6px solid #1890ff', borderRadius: 8 }}>
            <Statistic title="Net Balance" value={balance} prefix={<WalletOutlined />} suffix="PKR" valueStyle={{ color: balance >= 0 ? '#1890ff' : '#faad14', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title={<Space><ToolOutlined /> Staff Payroll Analytics</Space>} style={{ borderRadius: 12 }}>
            <Row>
              <Col span={12}><Statistic title="Paid this Month" value={sum(workerPayments.filter(p => p.month === new Date().toLocaleString('default', { month: 'long', year: 'numeric' })))} prefix="PKR" valueStyle={{ fontSize: 18 }} /></Col>
              <Col span={12}><Statistic title="Total Liability" value={monthlySalaryLiability} prefix="PKR" valueStyle={{ fontSize: 18, color: '#1890ff' }} /></Col>
            </Row>
            <Progress percent={Math.min(100, Math.round((payroll/monthlySalaryLiability)*100))} strokeColor="#1890ff" status="active" />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={<Space><HistoryOutlined /> Monthly Ledger History</Space>} style={{ borderRadius: 12 }}>
             <Table 
               dataSource={[...new Set([...payments, ...expenses, ...workerPayments].map(x => x.month))].sort().reverse().slice(0, 4)}
               pagination={false} size="small"
               columns={[
                 { title: 'Month', dataIndex: 'month', render: (m) => <Tag color="blue">{m}</Tag> },
                 { title: 'Revenue', render: (m) => <Text style={{color:'#52c41a'}}>+{sum(payments.filter(p=>p.month===m)).toLocaleString()}</Text> },
                 { title: 'Expense', render: (m) => <Text style={{color:'#f5222d'}}>-{(sum(expenses.filter(e=>e.month===m)) + sum(workerPayments.filter(w=>w.month===m))).toLocaleString()}</Text> },
               ]}
             />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderContent = () => {
    switch (activeKey) {
      case "dashboard": return renderDashboard();
      case "students": return (
        <Card title={<Row justify="space-between" align="middle"><span>Student Management</span><Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModal('student'); }}>Register Student</Button></Row>} style={{ borderRadius: 12 }}>
          <Table dataSource={students} rowKey="id" columns={[
            { title: 'Student Info', render: (_, r) => <Space direction="vertical" size={0}><Text strong>{r.name}</Text><Text type="secondary" style={{fontSize:11}}>{r.id} | {r.phone}</Text></Space> },
            { title: 'Room', dataIndex: 'room', render: (r) => <Tag color="geekblue">Room {r}</Tag> },
            { title: 'Status', dataIndex: 'status', render: (s) => <Badge status={s === 'Active' ? 'success' : 'error'} text={s} /> },
            { title: 'Actions', render: (_, r) => (
              <Space>
                <Button size="small" icon={<EyeOutlined />} onClick={() => setViewingItem({ type: 'student', data: r })}>View</Button>
                <Button size="small" icon={<EditOutlined />} onClick={() => { setViewingItem(r); form.setFieldsValue(r); setModal('student_edit'); }}>Edit</Button>
                <Popconfirm title="Delete record?" onConfirm={() => setStudents(students.filter(s => s.id !== r.id))}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
              </Space>
            )}
          ]} />
        </Card>
      );
      case "workers": return (
        <Card title={<Row justify="space-between" align="middle"><span>Staff & Payroll</span><Space><Button icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModal('staff'); }}>Add Staff</Button><Button type="primary" icon={<DollarOutlined />} onClick={() => { form.resetFields(); setModal('salary'); }}>Record Salary</Button></Space></Row>} style={{ borderRadius: 12 }}>
          <Tabs items={[
            { key: '1', label: 'Directory', children: <Table dataSource={workers} rowKey="id" columns={[
              { title: 'Name', dataIndex: 'name', render: (t) => <Text strong>{t}</Text> },
              { title: 'Role', dataIndex: 'role', render: (r) => <Tag color="blue">{r}</Tag> },
              { title: 'Salary', render: (_, r) => `PKR ${r.salary.toLocaleString()}` },
              { title: 'Actions', render: (_, r) => (
                <Space>
                  <Button size="small" icon={<EditOutlined />} onClick={() => { setViewingItem(r); form.setFieldsValue(r); setModal('staff_edit'); }}>Edit</Button>
                  <Popconfirm title="Remove staff?" onConfirm={() => setWorkers(workers.filter(w => w.id !== r.id))}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
                </Space>
              )}
            ]} /> },
            { key: '2', label: 'Payment Logs', children: <Table dataSource={workerPayments} rowKey="id" columns={[
              { title: 'Staff', dataIndex: 'workerName' }, 
              { title: 'Month', dataIndex: 'month' }, 
              { title: 'Amount', render: (_, r) => <Text strong>PKR {r.amount.toLocaleString()}</Text> }, 
              { title: 'Date', dataIndex: 'date' },
              { title: 'Actions', render: (_, r) => (
                <Space>
                  <Button size="small" icon={<EditOutlined />} onClick={() => { setViewingItem(r); form.setFieldsValue({ ...r, m: dayjs(r.month, "MMMM YYYY"), w: r.workerName, a: r.amount }); setModal('salary_edit'); }}>Edit</Button>
                  <Popconfirm title="Delete log?" onConfirm={() => setWorkerPayments(workerPayments.filter(p => p.id !== r.id))}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
                </Space>
              )}
            ]} /> },
            { key: '3', label: 'Monthly History', children: (
               <Table dataSource={[...new Set(workerPayments.map(p => p.month))].map(m => ({ month: m, total: sum(workerPayments.filter(p => p.month === m)) }))} columns={[{ title: 'Month', dataIndex: 'month', render: m => <Tag color="gold">{m}</Tag> }, { title: 'Total Paid', render: (_, r) => <Text strong>PKR {r.total.toLocaleString()}</Text> }]} />
            )}
          ]} />
        </Card>
      );
      case "expenses": return (
        <Card title={<Row justify="space-between" align="middle"><span>Expense Tracking</span><Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModal('expense'); }}>Record Bill</Button></Row>} style={{ borderRadius: 12 }}>
           <Table dataSource={expenses} rowKey="id" columns={[
             { title: 'Category', dataIndex: 'category', render: c => <Tag color="orange">{c}</Tag> }, 
             { title: 'Month', dataIndex: 'month' }, 
             { title: 'Amount', render: (_, r) => <Text strong style={{color:'#f5222d'}}>PKR {r.amount.toLocaleString()}</Text> }, 
             { title: 'Date', dataIndex: 'date' },
             { title: 'Actions', render: (_, r) => (
                <Space>
                  <Button size="small" icon={<EditOutlined />} onClick={() => { setViewingItem(r); form.setFieldsValue({ ...r, m: dayjs(r.month, "MMMM YYYY"), c: r.category, a: r.amount }); setModal('expense_edit'); }}>Edit</Button>
                  <Popconfirm title="Delete record?" onConfirm={() => setExpenses(expenses.filter(e => e.id !== r.id))}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
                </Space>
             )}
           ]} />
        </Card>
      );
      case "payments": return (
        <Card title={<Row justify="space-between" align="middle"><span>Revenue Logs</span><Button type="primary" icon={<DollarOutlined />} onClick={() => { form.resetFields(); setModal('income'); }}>Collect Fee</Button></Row>} style={{ borderRadius: 12 }}>
           <Table dataSource={payments} rowKey="id" columns={[
             { title: 'Student', dataIndex: 'name' }, 
             { title: 'Room', dataIndex: 'room' }, 
             { title: 'Month', dataIndex: 'month' }, 
             { title: 'Amount', render: (_, r) => <Text strong style={{color:'#52c41a'}}>PKR {r.amount.toLocaleString()}</Text> }, 
             { title: 'Date', dataIndex: 'date' },
             { title: 'Actions', render: (_, r) => (
               <Space>
                  <Button size="small" icon={<EditOutlined />} onClick={() => { setViewingItem(r); form.setFieldsValue({ ...r, m: dayjs(r.month, "MMMM YYYY"), n: r.name, a: r.amount }); setModal('income_edit'); }}>Edit</Button>
                  <Popconfirm title="Delete record?" onConfirm={() => setPayments(payments.filter(p => p.id !== r.id))}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
               </Space>
             )}
           ]} />
        </Card>
      );
      default: return renderDashboard();
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark" style={{ background: "#001529" }}>
        <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', color: '#fff' }}>
          <BankOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          {!collapsed && <Text style={{ color: '#fff', fontWeight: 800, marginLeft: 12, fontSize: 18 }}>HMS ELITE</Text>}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[activeKey]} onClick={({ key }) => setActiveKey(key)} items={[
          { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
          { key: "students", icon: <TeamOutlined />, label: "Students" },
          { key: "workers", icon: <ToolOutlined />, label: "Staff Payroll" },
          { key: "expenses", icon: <ThunderboltOutlined />, label: "Expenses" },
          { key: "payments", icon: <DollarOutlined />, label: "Revenue" },
        ]} />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: '1px solid #f0f0f0' }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
          <Space>
             <Text type="secondary">System Balance:</Text>
             <Tag color={balance >= 0 ? 'success' : 'error'} style={{fontWeight:700}}>PKR {balance.toLocaleString()}</Tag>
             <Popconfirm title="Logout?" onConfirm={() => setIsLoggedIn(false)}><Button type="text" danger icon={<LogoutOutlined />} /></Popconfirm>
          </Space>
        </Header>
        <Content style={{ margin: "24px" }}>{renderContent()}</Content>
      </Layout>

      {/* MODALS */}
      <Modal title={modal === 'student' ? "Register Student" : "Edit Student"} open={modal === 'student' || modal === 'student_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={(v) => {
          if (modal === 'student') {
            setStudents([{ id: `S${Date.now().toString().slice(-4)}`, ...v }, ...students]);
            message.success("Student registered");
          } else {
            setStudents(students.map(s => s.id === viewingItem.id ? { ...s, ...v } : s));
            message.success("Student updated");
          }
          setModal(null);
        }}>
          <Form.Item name="name" label="Full Name" rules={[{required:true}]}><Input /></Form.Item>
          <Row gutter={16}>
             <Col span={12}><Form.Item name="cnic" label="CNIC / ID" rules={[{required:true}]}><Input /></Form.Item></Col>
             <Col span={12}><Form.Item name="phone" label="Phone No" rules={[{required:true}]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
             <Col span={12}><Form.Item name="room" label="Room No" rules={[{required:true}]}><Input /></Form.Item></Col>
             <Col span={12}><Form.Item name="status" label="Status" initialValue="Active"><Select><Option value="Active">Active</Option><Option value="Inactive">Inactive</Option></Select></Form.Item></Col>
          </Row>
          <Form.Item name="guardian" label="Guardian Name"><Input /></Form.Item>
          <Button type="primary" htmlType="submit" block>{modal === 'student' ? "Register" : "Update"}</Button>
        </Form>
      </Modal>

      <Modal title="Student Details" open={!!viewingItem && viewingItem.type === 'student'} onCancel={() => setViewingItem(null)} footer={null}>
        {viewingItem?.type === 'student' && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{viewingItem.data.name}</Descriptions.Item>
            <Descriptions.Item label="ID">{viewingItem.data.id}</Descriptions.Item>
            <Descriptions.Item label="CNIC">{viewingItem.data.cnic}</Descriptions.Item>
            <Descriptions.Item label="Phone">{viewingItem.data.phone}</Descriptions.Item>
            <Descriptions.Item label="Room">{viewingItem.data.room}</Descriptions.Item>
            <Descriptions.Item label="Guardian">{viewingItem.data.guardian}</Descriptions.Item>
            <Descriptions.Item label="Status"><Badge status={viewingItem.data.status === 'Active' ? 'success' : 'error'} text={viewingItem.data.status} /></Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal title={modal === 'staff' ? "Register Staff" : "Edit Staff"} open={modal === 'staff' || modal === 'staff_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={(v) => { 
          if (modal === 'staff') {
            setWorkers([...workers, { id: Date.now(), ...v }]); 
            message.success("Staff member registered"); 
          } else {
            setWorkers(workers.map(w => w.id === viewingItem.id ? { ...w, ...v } : w));
            message.success("Staff updated");
          }
          setModal(null); 
        }}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="role" label="Designation" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="salary" label="Base Monthly Salary" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Button type="primary" htmlType="submit" block>{modal === 'staff' ? "Register" : "Update"}</Button>
        </Form>
      </Modal>

      <Modal title={modal === 'salary' ? "Pay Salary" : "Edit Salary Record"} open={modal === 'salary' || modal === 'salary_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={(v) => { 
          if (modal === 'salary') {
            setWorkerPayments([{ id: Date.now(), workerName: v.w, amount: v.a, month: v.m?.format("MMMM YYYY"), date: new Date().toISOString().split('T')[0] }, ...workerPayments]); 
            message.success("Salary Payment Recorded"); 
          } else {
            setWorkerPayments(workerPayments.map(p => p.id === viewingItem.id ? { ...p, workerName: v.w, amount: v.a, month: v.m?.format("MMMM YYYY") } : p));
            message.success("Salary record updated");
          }
          setModal(null); 
        }}>
          <Form.Item name="w" label="Worker" rules={[{ required: true }]}><Select>{workers.map(w => <Option key={w.name} value={w.name}>{w.name}</Option>)}</Select></Form.Item>
          <Form.Item name="m" label="Select Month" rules={[{ required: true }]}><DatePicker picker="month" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="a" label="Amount Paid" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Button type="primary" htmlType="submit" block>{modal === 'salary' ? "Confirm Payment" : "Update Record"}</Button>
        </Form>
      </Modal>

      <Modal title={modal === 'expense' ? "Record Bill" : "Edit Bill"} open={modal === 'expense' || modal === 'expense_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={(v) => { 
          if (modal === 'expense') {
            setExpenses([{ id: Date.now(), category: v.c, amount: v.a, month: v.m?.format("MMMM YYYY"), date: new Date().toISOString().split('T')[0] }, ...expenses]); 
            message.success("Bill saved"); 
          } else {
            setExpenses(expenses.map(e => e.id === viewingItem.id ? { ...e, category: v.c, amount: v.a, month: v.m?.format("MMMM YYYY") } : e));
            message.success("Bill updated");
          }
          setModal(null); 
        }}>
          <Form.Item name="c" label="Category" rules={[{ required: true }]}><Select><Option value="Electricity">Electricity</Option><Option value="Gas">Gas</Option><Option value="Fuel">Fuel</Option><Option value="Maintenance">Maintenance</Option></Select></Form.Item>
          <Form.Item name="m" label="Month" rules={[{ required: true }]}><DatePicker picker="month" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="a" label="Amount" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Button type="primary" htmlType="submit" block>{modal === 'expense' ? "Record Expense" : "Update Expense"}</Button>
        </Form>
      </Modal>

      <Modal title={modal === 'income' ? "Collect Fee" : "Edit Fee Record"} open={modal === 'income' || modal === 'income_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={(v) => { 
          const student = students.find(s => s.name === v.n);
          if (modal === 'income') {
            setPayments([{ id: Date.now(), name: v.n, room: student?.room || "N/A", amount: v.a, month: v.m?.format("MMMM YYYY"), date: new Date().toISOString().split('T')[0] }, ...payments]); 
            message.success("Fee Recorded"); 
          } else {
            setPayments(payments.map(p => p.id === viewingItem.id ? { ...p, name: v.n, room: student?.room || p.room, amount: v.a, month: v.m?.format("MMMM YYYY") } : p));
            message.success("Fee record updated");
          }
          setModal(null); 
        }}>
          <Form.Item name="n" label="Student" rules={[{ required: true }]}><Select>{students.map(s => <Option key={s.name} value={s.name}>{s.name}</Option>)}</Select></Form.Item>
          <Form.Item name="m" label="Month" rules={[{ required: true }]}><DatePicker picker="month" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="a" label="Amount" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Button type="primary" htmlType="submit" block>{modal === 'income' ? "Record Payment" : "Update Record"}</Button>
        </Form>
      </Modal>
    </Layout>
  );
}
