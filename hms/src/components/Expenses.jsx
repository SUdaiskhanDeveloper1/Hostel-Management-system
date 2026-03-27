import React, { useState, useContext } from "react";
import dayjs from "dayjs";
import { Card, Table, Button, Space, Typography, Tag, Row, Popconfirm, message, Modal, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import api from "../api/axiosConfig";
import { GlobalContext } from "../context/GlobalContext";
import * as xlsx from "xlsx";

const { Text, Title } = Typography;
const { Option } = Select;

export default function Expenses() {
  const { expenses, fetchExpenses, loading } = useContext(GlobalContext);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [modal, setModal] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      message.success("Expense record deleted");
      fetchExpenses();
    } catch (error) {
      message.error("Failed to delete record");
    }
  };

  const exportToExcel = () => {
    const ws = xlsx.utils.json_to_sheet(filteredData.map((e, i) => ({
      No: i + 1, Category: e.category, Month: e.month, Amount: e.amount, Date: e.date, ID: e._id
    })));
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");
    xlsx.writeFile(wb, "Expenses_Data.xlsx");
  };

  const filteredData = expenses.filter(e => 
    e.category?.toLowerCase().includes(searchText.toLowerCase()) ||
    e._id?.toLowerCase().includes(searchText.toLowerCase()) ||
    e.month?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Card 
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={<Title level={4} style={{ margin: 0, fontWeight: 600 }}>Expenses - {filteredData.length}</Title>}
        extra={
          <Space>
            <Input 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Search Category, ID, Month" 
              style={{ width: 220, borderRadius: 6 }} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button icon={<DownloadOutlined />} style={{ borderRadius: 6 }} onClick={exportToExcel} />
            <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 6 }} onClick={() => { form.resetFields(); setModal('expense'); }}>
              Record Bill
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
            { title: 'Category', dataIndex: 'category', render: c => <Tag color="orange">{c}</Tag> },
            { title: 'Month', dataIndex: 'month' },
            { title: 'Amount', render: (_, r) => <Text strong style={{ color: '#f5222d' }}>PKR {r.amount.toLocaleString()}</Text> },
            { title: 'Date', dataIndex: 'date' },
            {
              title: 'View', render: (_, r) => (
                <Space>
                  <Button shape="circle" icon={<EditOutlined />} onClick={() => { setViewingItem(r); form.setFieldsValue({ ...r, m: dayjs(r.month, "MMMM YYYY"), c: r.category, a: r.amount }); setModal('expense_edit'); }} />
                  <Popconfirm title="Delete record?" onConfirm={() => handleDelete(r._id)}>
                    <Button shape="circle" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              )
            }
          ]} 
        />
      </Card>

      <Modal title={modal === 'expense' ? "Record Bill" : "Edit Bill"} open={modal === 'expense' || modal === 'expense_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v) => {
          try {
            const data = {
              category: v.c,
              amount: v.a,
              month: v.m?.format("MMMM YYYY"),
              date: new Date().toISOString().split('T')[0]
            };
            if (modal === 'expense') {
              await api.post('/expenses', data);
              message.success("Bill saved");
            } else {
              await api.put(`/expenses/${viewingItem._id}`, data);
              message.success("Bill updated");
            }
            setModal(null);
            fetchExpenses();
          } catch (e) {
            message.error("Failed to save bill: " + (e.response?.data?.message || e.message));
          }
        }}>
          <Form.Item name="c" label="Category" rules={[{ required: true }]}><Select><Option value="Electricity">Electricity</Option><Option value="Gas">Gas</Option><Option value="Fuel">Fuel</Option><Option value="Maintenance">Maintenance</Option></Select></Form.Item>
          <Form.Item name="m" label="Month" rules={[{ required: true }]}><DatePicker picker="month" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="a" label="Amount" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Button type="primary" htmlType="submit" block>{modal === 'expense' ? "Record Expense" : "Update Expense"}</Button>
        </Form>
      </Modal>
    </>
  );
}
