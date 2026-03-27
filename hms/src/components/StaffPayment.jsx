import React, { useState, useContext } from "react";
import dayjs from "dayjs";
import { Card, Table, Button, Space, Typography, Tag, Popconfirm, message, Modal, Form, Select, DatePicker, InputNumber } from "antd";
import { DollarOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../api/axiosConfig";
import { GlobalContext } from "../context/GlobalContext";

const { Text, Title } = Typography;
const { Option } = Select;

export default function StaffPayment() {
  const { workers, workerPayments, fetchWorkerPayments, loading } = useContext(GlobalContext);
  const [form] = Form.useForm();
  const [modal, setModal] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const handleDeletePayment = async (id) => {
    try {
      await api.delete(`/worker-payments/${id}`);
      message.success("Payment record deleted");
      fetchWorkerPayments();
    } catch (e) {
      message.error("Failed to delete record");
    }
  };

  return (
    <>
      <Card 
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={<Title level={4} style={{ margin: 0, fontWeight: 600 }}>Staff Payment Logs - {workerPayments.length}</Title>}
        extra={
          <Button type="primary" icon={<DollarOutlined />} style={{ borderRadius: 6 }} onClick={() => { form.resetFields(); setModal('salary'); }}>
            Record Payment
          </Button>
        }
      >
        <Table 
          dataSource={workerPayments} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 15, position: ['bottomRight'] }} 
          columns={[
            { title: 'No', render: (_, __, index) => index + 1, width: 60 },
            { title: 'Worker Name', dataIndex: 'workerName', render: (t) => <Text strong>{t}</Text> },
            { title: 'Month Assigned', dataIndex: 'month', render: m => <Tag color="gold">{m}</Tag> },
            { title: 'Amount Paid', render: (_, r) => <Text strong style={{ color: '#52c41a' }}>PKR {r.amount.toLocaleString()}</Text> },
            { title: 'Payment Date', dataIndex: 'date' },
            {
              title: 'View', render: (_, r) => (
                <Space>
                  <Button shape="circle" icon={<EditOutlined />} onClick={() => { 
                    setViewingItem(r); 
                    form.setFieldsValue({ ...r, m: dayjs(r.month, "MMMM YYYY"), w: r.workerName, a: r.amount }); 
                    setModal('salary_edit'); 
                  }} />
                  <Popconfirm title="Delete payment log?" onConfirm={() => handleDeletePayment(r._id)}>
                    <Button shape="circle" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              )
            }
          ]} 
        />
      </Card>

      <Modal title={modal === 'salary' ? "Pay Staff" : "Edit Payment Record"} open={modal === 'salary' || modal === 'salary_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v) => {
          try {
            const data = {
              workerName: v.w,
              amount: v.a,
              month: v.m?.format("MMMM YYYY"),
              date: new Date().toISOString().split('T')[0]
            };
            if (modal === 'salary') {
              await api.post('/worker-payments', data);
              message.success("Payment Recorded");
            } else {
              await api.put(`/worker-payments/${viewingItem._id}`, data);
              message.success("Record updated");
            }
            setModal(null);
            fetchWorkerPayments();
          } catch (e) {
            message.error("Failed to save payment: " + (e.response?.data?.message || e.message));
          }
        }}>
          <Form.Item name="w" label="Select Worker" rules={[{ required: true }]}><Select showSearch>{workers.map(w => <Option key={w._id} value={w.name}>{w.name} ({w.role})</Option>)}</Select></Form.Item>
          <Form.Item name="m" label="Select Dedicated Month (Multiple months require separate logs)" rules={[{ required: true }]}><DatePicker picker="month" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="a" label="Amount Paid" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Button type="primary" htmlType="submit" block style={{ marginTop: 10 }}>{modal === 'salary' ? "Confirm Payment" : "Update Record"}</Button>
        </Form>
      </Modal>
    </>
  );
}
