import React, { useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
import { Card, Table, Button, Space, Typography, Tag, Badge, Row, Col, Popconfirm, message, Modal, Form, Input, Select, Descriptions, InputNumber, DatePicker, Divider } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import api from "../api/axiosConfig";
import { GlobalContext } from "../context/GlobalContext";
import * as xlsx from "xlsx";

const { Text, Title } = Typography;
const { Option } = Select;

export default function Students() {
  const { students, rooms, payments, fetchStudents, fetchRooms, loading } = useContext(GlobalContext);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [modal, setModal] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      message.success("Student deleted");
      fetchStudents(); 
      fetchRooms(); // room capacity freed up
    } catch (error) {
      message.error("Failed to delete student");
    }
  };

  const exportToExcel = () => {
    const ws = xlsx.utils.json_to_sheet(filteredData.map((s, i) => ({
      No: i + 1,
      Name: s.name,
      ID: s._id,
      Phone: s.phone,
      CNIC: s.cnic,
      Room: s.room,
      Status: s.status,
      "Registered On": dayjs(s.registrationDate).format('YYYY-MM-DD'),
      "Duration (Months)": s.duration
    })));
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Students");
    xlsx.writeFile(wb, "Students_Report.xlsx");
  };

  const filteredData = students.filter(s => 
    s.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    s._id?.toLowerCase().includes(searchText.toLowerCase()) ||
    s.cnic?.toLowerCase().includes(searchText.toLowerCase()) ||
    s.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
    s.room?.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderStayTracking = (student) => {
    if (!student.registrationDate || !student.duration) return null;
    
    const startMonth = dayjs(student.registrationDate);
    const months = [];
    for(let i=0; i<student.duration; i++) {
      const monthStr = startMonth.add(i, 'month').format("MMMM YYYY");
      const hasPaid = payments.some(p => p.name === student.name && p.month === monthStr);
      months.push({ month: monthStr, paid: hasPaid });
    }

    return (
      <div style={{ marginTop: 20 }}>
        <Title level={5} style={{ display: 'flex', justifyContent: 'space-between' }}>
          Monthly Stay Tracking 
          <Tag color="cyan">{student.duration} Months Overall</Tag>
        </Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginTop: 15 }}>
          {months.map((m, i) => (
            <Card key={i} size="small" style={{ background: m.paid ? '#f6ffed' : '#fffbe6', borderColor: m.paid ? '#b7eb8f' : '#ffe58f' }}>
              <Space>
                {m.paid ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <ClockCircleOutlined style={{ color: '#faad14' }} />}
                <Text strong={m.paid}>{m.month}</Text>
              </Space>
              <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4, marginLeft: 22 }}>
                {m.paid ? "Fee Paid" : "Pending Payment"}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card 
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={<Typography.Title level={4} style={{ margin: 0, fontWeight: 600 }}>Students - {filteredData.length}</Typography.Title>}
        extra={
          <Space>
            <Input 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Search Name, ID, Room" 
              style={{ width: 220, borderRadius: 6 }} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button icon={<DownloadOutlined />} style={{ borderRadius: 6 }} onClick={exportToExcel} />
            <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 6 }} onClick={() => { form.resetFields(); setModal('student'); }}>
              Register Student
            </Button>
          </Space>
        }
      >
        <Table 
          dataSource={filteredData} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 10, position: ['bottomRight'] }}
          columns={[
            { title: 'No', render: (_, __, index) => index + 1, width: 60 },
            { title: 'Student Info', render: (_, r) => <Space direction="vertical" size={0}><Text strong>{r.name}</Text><Text type="secondary" style={{ fontSize: 11 }}>{r.cnic} | {r.phone}</Text></Space> },
            { title: 'Room', dataIndex: 'room', render: (r) => <Tag color="geekblue">Room {r}</Tag> },
            { title: 'Status', dataIndex: 'status', render: (s) => <Badge status={s === 'Active' ? 'success' : 'error'} text={s} /> },
            {
              title: 'View', render: (_, r) => (
                <Space>
                  <Button shape="circle" icon={<EyeOutlined />} onClick={() => setViewingItem({ type: 'student', data: r })} />
                  <Button shape="circle" icon={<EditOutlined />} onClick={() => { 
                    setViewingItem(r); 
                    form.setFieldsValue({
                      ...r,
                      registrationDate: r.registrationDate ? dayjs(r.registrationDate) : dayjs()
                    }); 
                    setModal('student_edit'); 
                  }} />
                  <Popconfirm title="Delete record?" onConfirm={() => handleDelete(r._id)}>
                    <Button shape="circle" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              )
            }
          ]} 
        />
      </Card>

      <Modal title={modal === 'student' ? "Register Student" : "Edit Student"} open={modal === 'student' || modal === 'student_edit'} onCancel={() => setModal(null)} footer={null} width={650}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'Active', registrationDate: dayjs(), duration: 1 }}
          onFinish={async (v) => {
            try {
              const cleanData = {
                ...v,
                registrationDate: v.registrationDate ? v.registrationDate.toISOString() : undefined
              };
              if (modal === 'student') {
                await api.post('/students', cleanData);
                message.success("Student registered");
              } else {
                await api.put(`/students/${viewingItem._id}`, cleanData);
                message.success("Student updated");
              }
              setModal(null);
              fetchStudents(); 
              fetchRooms();
            } catch (e) {
              message.error("Failed to save student: " + (e.response?.data?.message || e.message));
            }
          }}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="name" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="cnic" label="CNIC / ID" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="phone" label="Phone No" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="guardian" label="Guardian Name"><Input /></Form.Item></Col>
          </Row>
          <Divider orientation="left" style={{ margin: '10px 0' }}>Booking Details</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="room" label="Assign Room" rules={[{ required: true }]}>
                <Select showSearch placeholder="Select Room">
                  {rooms.map(rm => (
                    <Option key={rm.number} value={rm.number} disabled={rm.available === 0 && (modal === 'student' || viewingItem?.room !== rm.number)}>
                      <span>Room {rm.number}</span>
                      <Tag style={{ marginLeft: 8 }} color={rm.available > 0 ? "success" : "error"}>
                        {rm.available > 0 ? `${rm.available} Spots Left` : 'FULL'}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}><Form.Item name="status" label="Status"><Select><Option value="Active">Active</Option><Option value="Inactive">Inactive</Option></Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="registrationDate" label="Registration Date" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="duration" label="Duration of Stay (Months)" rules={[{ required: true }]}><InputNumber min={1} max={60} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>

          <Button type="primary" htmlType="submit" block style={{ marginTop: 10 }}>{modal === 'student' ? "Register & Assign Room" : "Update Student Record"}</Button>
        </Form>
      </Modal>

      <Modal width={700} title="Student Profile & Stay Details" open={!!viewingItem && viewingItem.type === 'student'} onCancel={() => setViewingItem(null)} footer={null}>
        {viewingItem?.type === 'student' && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Name" span={2}>{viewingItem.data.name}</Descriptions.Item>
              <Descriptions.Item label="ID">{viewingItem.data._id}</Descriptions.Item>
              <Descriptions.Item label="Room"><Tag color="geekblue">Room {viewingItem.data.room}</Tag></Descriptions.Item>
              <Descriptions.Item label="CNIC">{viewingItem.data.cnic}</Descriptions.Item>
              <Descriptions.Item label="Phone">{viewingItem.data.phone}</Descriptions.Item>
              <Descriptions.Item label="Guardian">{viewingItem.data.guardian || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Status"><Badge status={viewingItem.data.status === 'Active' ? 'success' : 'error'} text={viewingItem.data.status} /></Descriptions.Item>
            </Descriptions>
            
            {renderStayTracking(viewingItem.data)}
            
            <Divider />
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setViewingItem(null)}>Close</Button>
              <Button type="primary" onClick={() => {
                 setModal('student_edit');
                 form.setFieldsValue({
                    ...viewingItem.data,
                    registrationDate: dayjs(viewingItem.data.registrationDate)
                 });
              }}>Extend / Edit Stay</Button>
            </Space>
          </div>
        )}
      </Modal>
    </>
  );
}
