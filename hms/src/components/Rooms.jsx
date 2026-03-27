import React, { useState, useContext } from "react";
import { Card, Table, Button, Space, Typography, Tag, Progress, Row, Popconfirm, message, Modal, Form, Input, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import api from "../api/axiosConfig";
import { GlobalContext } from "../context/GlobalContext";
import * as xlsx from "xlsx";

const { Text, Title } = Typography;
const { Option } = Select;

export default function Rooms() {
  const { rooms, fetchRooms, loading } = useContext(GlobalContext);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [modal, setModal] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rooms/${id}`);
      message.success("Room deleted");
      fetchRooms();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete room");
    }
  };

  const exportToExcel = () => {
    const ws = xlsx.utils.json_to_sheet(filteredData.map((r, i) => ({
      No: i + 1,
      "Room Number": r.number,
      "Capacity": r.capacity + " Seater",
      "Occupied": r.occupied,
      "Available": r.available,
      "Status": r.available > 0 ? "Available" : "Full"
    })));
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Rooms");
    xlsx.writeFile(wb, "Rooms_Report.xlsx");
  };

  const filteredData = rooms.filter(r => 
    r.number?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Card 
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        title={<Title level={4} style={{ margin: 0, fontWeight: 600 }}>Rooms - {filteredData.length}</Title>}
        extra={
          <Space>
            <Input 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Search Room Number" 
              style={{ width: 220, borderRadius: 6 }} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button icon={<DownloadOutlined />} style={{ borderRadius: 6 }} onClick={exportToExcel} />
            <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 6 }} onClick={() => { form.resetFields(); setModal('room'); }}>
              Add Room
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
            { title: 'Room No.', dataIndex: 'number', render: n => <Text strong>{n}</Text> },
            { title: 'Type', dataIndex: 'capacity', render: c => <Tag color="blue">{c} Seater</Tag> },
            { 
              title: 'Occupancy', 
              render: (_, r) => {
                const percent = Math.round((r.occupied / r.capacity) * 100);
                const color = percent >= 100 ? '#ff4d4f' : percent >= 75 ? '#faad14' : '#52c41a';
                return (
                  <div style={{ width: 150 }}>
                    <Progress percent={percent} size="small" strokeColor={color} format={() => `${r.occupied}/${r.capacity}`} />
                  </div>
                );
              }
            },
            { title: 'Status', render: (_, r) => r.available > 0 ? <Tag color="success">{r.available} Available</Tag> : <Tag color="error">FULL</Tag> },
            {
              title: 'View', render: (_, r) => (
                <Space>
                  <Button shape="circle" icon={<EditOutlined />} onClick={() => { setViewingItem(r); form.setFieldsValue({ number: r.number, capacity: r.capacity }); setModal('room_edit'); }} />
                  <Popconfirm title="Delete room?" onConfirm={() => handleDelete(r._id)}>
                    <Button shape="circle" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              )
            }
          ]} 
        />
      </Card>

      <Modal title={modal === 'room' ? "Add Room" : "Edit Room"} open={modal === 'room' || modal === 'room_edit'} onCancel={() => setModal(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={async (v) => {
          try {
            if (modal === 'room') {
              await api.post('/rooms', v);
              message.success("Room created");
            } else {
              await api.put(`/rooms/${viewingItem._id}`, { capacity: v.capacity });
              message.success("Room capacity updated");
            }
            setModal(null);
            fetchRooms();
          } catch (e) {
            message.error("Failed to save room: " + (e.response?.data?.message || e.message));
          }
        }}>
          <Form.Item name="number" label="Room Number" rules={[{ required: true }]}><Input disabled={modal === 'room_edit'} placeholder="e.g. 101" /></Form.Item>
          <Form.Item name="capacity" label="Capacity (Seats)" rules={[{ required: true }]}><Select><Option value={1}>1 Seater</Option><Option value={2}>2 Seater</Option><Option value={3}>3 Seater</Option><Option value={4}>4 Seater</Option><Option value={5}>5 Seater</Option><Option value={6}>6 Seater</Option></Select></Form.Item>
          <Button type="primary" htmlType="submit" block>{modal === 'room' ? "Save Room" : "Update Room"}</Button>
        </Form>
      </Modal>
    </>
  );
}
