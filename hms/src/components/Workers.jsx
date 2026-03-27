import React, { useState, useContext } from "react";
import dayjs from "dayjs";
import { Card, Table, Button, Space, Typography, Tag, Popconfirm, message, Modal, Form, Input, InputNumber, DatePicker, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../api/axiosConfig";
import { GlobalContext } from "../context/GlobalContext";

const { Text, Title } = Typography;

export default function Workers() {
  const { workers, fetchWorkers, loading } = useContext(GlobalContext);
  const [form] = Form.useForm();
  const [modal, setModal] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/workers/${id}`);
      message.success("Staff member removed");
      fetchWorkers();
    } catch (e) {
      message.error("Failed to remove staff");
    }
  };

  return (
    <>
      <Card 
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={<Title level={4} style={{ margin: 0, fontWeight: 600 }}>Workers Directory - {workers.length}</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 6 }} onClick={() => { form.resetFields(); setModal('staff'); }}>
            Add Worker
          </Button>
        }
      >
        <Table 
          dataSource={workers} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 15, position: ['bottomRight'] }} 
          columns={[
            { title: 'No', render: (_, __, index) => index + 1, width: 60 },
            { title: 'Name', dataIndex: 'name', render: (t) => <Text strong>{t}</Text> },
            { title: 'Role', dataIndex: 'role', render: (r) => <Tag color="blue">{r}</Tag> },
            { title: 'Salary', render: (_, r) => `PKR ${r.salary.toLocaleString()}` },
            { title: 'Start Date', render: (_, r) => r.startingDate ? dayjs(r.startingDate).format('YYYY-MM-DD') : '-' },
            { title: 'End Date', render: (_, r) => r.endDate ? dayjs(r.endDate).format('YYYY-MM-DD') : '-' },
            {
              title: 'View', render: (_, r) => (
                <Space>
                  <Button shape="circle" icon={<EditOutlined />} onClick={() => { 
                    setViewingItem(r); 
                    form.setFieldsValue({
                      ...r,
                      startingDate: r.startingDate ? dayjs(r.startingDate) : null,
                      endDate: r.endDate ? dayjs(r.endDate) : null
                    }); 
                    setModal('staff_edit'); 
                  }} />
                  <Popconfirm title="Remove staff?" onConfirm={() => handleDelete(r._id)}>
                    <Button shape="circle" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              )
            }
          ]} 
        />
      </Card>

      <Modal title={modal === 'staff' ? "Register Worker" : "Edit Worker"} open={modal === 'staff' || modal === 'staff_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v) => {
          try {
            const cleanData = {
              name: v.name,
              role: v.role,
              salary: v.salary,
              startingDate: v.startingDate ? v.startingDate.toISOString() : undefined,
              endDate: v.endDate ? v.endDate.toISOString() : undefined
            };
            if (modal === 'staff') {
              await api.post('/workers', cleanData);
              message.success("Worker registered");
            } else {
              await api.put(`/workers/${viewingItem._id}`, cleanData);
              message.success("Worker updated");
            }
            setModal(null);
            fetchWorkers();
          } catch (e) {
            message.error("Failed to save worker: " + (e.response?.data?.message || e.message));
          }
        }}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="role" label="Role / Designation" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="salary" label="Base Salary" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="startingDate" label="Starting Date (Optional)"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="endDate" label="End Date (Optional)"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Button type="primary" htmlType="submit" block style={{ marginTop: 10 }}>{modal === 'staff' ? "Register Worker" : "Update Worker"}</Button>
        </Form>
      </Modal>
    </>
  );
}
