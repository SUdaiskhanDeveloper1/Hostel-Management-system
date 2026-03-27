import React, { useContext } from "react";
import { Card, Statistic, Row, Col, Space, Typography, Progress, Table, Tag } from "antd";
import { RiseOutlined, FallOutlined, WalletOutlined, ToolOutlined, HistoryOutlined } from "@ant-design/icons";
import { GlobalContext } from "../context/GlobalContext";

const { Text } = Typography;

export default function Dashboard() {
  const { students, workers, expenses, payments, workerPayments, loading } = useContext(GlobalContext);

  const sum = (arr) => arr.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  
  const income = sum(payments);
  const payroll = sum(workerPayments);
  const bills = sum(expenses);
  const monthlySalaryLiability = workers.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
  const outflow = payroll + bills;
  const balance = income - outflow;

  return (
    <div style={{ padding: '0 4px', opacity: loading ? 0.5 : 1 }}>
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
            <Progress percent={Math.min(100, Math.round((monthlySalaryLiability > 0 ? payroll / monthlySalaryLiability : 0) * 100))} strokeColor="#1890ff" status="active" />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={<Space><HistoryOutlined /> Monthly Ledger History</Space>} style={{ borderRadius: 12 }}>
            <Table
              dataSource={[...new Set([...payments, ...expenses, ...workerPayments].map(x => x.month))].filter(Boolean).sort().reverse().slice(0, 4)}
              pagination={false} size="small"
              columns={[
                { title: 'Month', render: (m) => <Tag color="blue">{m}</Tag> },
                { title: 'Revenue', render: (m) => <Text style={{ color: '#52c41a' }}>+{sum(payments.filter(p => p.month === m)).toLocaleString()}</Text> },
                { title: 'Expense', render: (m) => <Text style={{ color: '#f5222d' }}>-{(sum(expenses.filter(e => e.month === m)) + sum(workerPayments.filter(w => w.month === m))).toLocaleString()}</Text> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
