import React, { useState, useContext } from "react";
import dayjs from "dayjs";
import { Card, Table, Button, Space, Typography, Popconfirm, message, Modal, Form, Input, InputNumber, Select, DatePicker, Upload, Image, Tag } from "antd";
import { DollarOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined, UploadOutlined, FileImageOutlined } from "@ant-design/icons";
import api from "../api/axiosConfig";
import { GlobalContext } from "../context/GlobalContext";
import * as xlsx from "xlsx";

const { Text, Title } = Typography;
const { Option } = Select;

export default function Revenue() {
  const { payments, students, fetchPayments, loading } = useContext(GlobalContext);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [modal, setModal] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [receiptImg, setReceiptImg] = useState("");

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      message.success("Payment record deleted");
      fetchPayments();
    } catch (error) {
      message.error("Failed to delete record");
    }
  };

  const exportToExcel = () => {
    const ws = xlsx.utils.json_to_sheet(filteredData.map((p, i) => ({
      No: i + 1, 
      Student: p.name, 
      Room: p.room, 
      Month: p.month, 
      Amount: p.amount, 
      Method: p.paymentMethod || 'Cash',
      Date: p.date, 
      ID: p._id
    })));
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Revenue");
    xlsx.writeFile(wb, "Revenue_Data.xlsx");
  };

  const handleUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => setReceiptImg(reader.result);
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  const filteredData = payments.filter(p => 
    p.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    p.room?.toLowerCase().includes(searchText.toLowerCase()) ||
    p._id?.toLowerCase().includes(searchText.toLowerCase()) ||
    p.month?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Card 
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={<Title level={4} style={{ margin: 0, fontWeight: 600 }}>Revenue Logs - {filteredData.length}</Title>}
        extra={
          <Space>
            <Input 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Search Student, Room, Month" 
              style={{ width: 220, borderRadius: 6 }} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button icon={<DownloadOutlined />} style={{ borderRadius: 6 }} onClick={exportToExcel} />
            <Button type="primary" icon={<DollarOutlined />} style={{ borderRadius: 6 }} onClick={() => { 
                form.resetFields(); 
                setReceiptImg(""); 
                setModal('income'); 
              }}>
              Collect Fee
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
            { title: 'Student', dataIndex: 'name' },
            { title: 'Room', dataIndex: 'room', render: r => <Tag>Room {r}</Tag> },
            { title: 'Month', dataIndex: 'month' },
            { title: 'Amount', render: (_, r) => <Text strong style={{ color: '#52c41a' }}>PKR {r.amount.toLocaleString()}</Text> },
            { title: 'Method', dataIndex: 'paymentMethod', render: m => m || 'Cash' },
            { title: 'Date', dataIndex: 'date' },
            {
              title: 'Receipt', render: (_, r) => r.receiptImage ? 
                <Image src={r.receiptImage} width={40} height={40} style={{ borderRadius: 4, objectFit: 'cover' }} preview={{ mask: <FileImageOutlined /> }} /> 
                : <Text type="secondary" style={{ fontSize: 11 }}>N/A</Text>
            },
            {
              title: 'Action', render: (_, r) => (
                <Space>
                  <Button shape="circle" icon={<EditOutlined />} onClick={() => { 
                    setViewingItem(r); 
                    form.setFieldsValue({ 
                      ...r, 
                      m: dayjs(r.month, "MMMM YYYY"), 
                      n: r.name, 
                      a: r.amount,
                      pm: r.paymentMethod || 'Cash'
                    }); 
                    setReceiptImg(r.receiptImage || "");
                    setModal('income_edit'); 
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

      <Modal title={modal === 'income' ? "Collect Fee" : "Edit Fee Record"} open={modal === 'income' || modal === 'income_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v) => {
          try {
            const student = students.find(s => s.name === v.n);
            const data = {
              name: v.n,
              room: student?.room || "N/A",
              amount: v.a,
              month: v.m?.format("MMMM YYYY"),
              date: new Date().toISOString().split('T')[0],
              paymentMethod: v.pm || 'Cash',
              receiptImage: receiptImg
            };
            
            if (modal === 'income') {
              await api.post('/payments', data);
              message.success("Fee Recorded");
            } else {
              await api.put(`/payments/${viewingItem._id}`, data);
              message.success("Fee record updated");
            }
            setModal(null);
            fetchPayments();
          } catch (e) {
            message.error("Failed to save fee: " + (e.response?.data?.message || e.message));
          }
        }}>
          <Form.Item name="n" label="Student" rules={[{ required: true }]}><Select showSearch>{students.map(s => <Option key={s._id} value={s.name}>{s.name} (Room {s.room})</Option>)}</Select></Form.Item>
          
          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="m" label="Month" rules={[{ required: true }]} style={{ width: '100%' }}><DatePicker picker="month" style={{ width: 150 }} /></Form.Item>
            <Form.Item name="a" label="Amount" rules={[{ required: true }]} style={{ width: '100%' }}><InputNumber style={{ width: 150 }} /></Form.Item>
          </Space>
          
          <Form.Item name="pm" label="Payment Method" initialValue="Cash">
            <Select>
              <Option value="Cash">Cash</Option>
              <Option value="Bank">Bank Transfer</Option>
              <Option value="Easypaisa">Easypaisa</Option>
              <Option value="Jazzcash">Jazzcash</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Receipt Image (Max 2MB, Optional)">
            <Upload beforeUpload={handleUpload} maxCount={1} accept="image/*" showUploadList={false}>
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {receiptImg && (
              <div style={{ marginTop: 10, position: 'relative', width: 100 }}>
                 <Image src={receiptImg} width={100} height={100} style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid #d9d9d9' }} />
                 <Button size="small" danger shape="circle" icon={<DeleteOutlined />} style={{ position: 'absolute', top: -10, right: -10 }} onClick={(e) => { e.stopPropagation(); setReceiptImg(""); }} />
              </div>
            )}
          </Form.Item>

          <Button type="primary" htmlType="submit" block style={{ marginTop: 15 }}>{modal === 'income' ? "Submit Payment" : "Update Record"}</Button>
        </Form>
      </Modal>
    </>
  );
}
