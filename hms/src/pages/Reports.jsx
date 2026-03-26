import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Reports() {
  const [students, setStudents] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const fetchData = async () => {
    const studentSnap = await getDocs(collection(db, "students"));
    setStudents(studentSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const expenseSnap = await getDocs(collection(db, "expenses"));
    setExpenses(expenseSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStudents = students.length;
  const totalExpenses = expenses.reduce((sum, ex) => sum + Number(ex.amount), 0);

  const chartData = {
    labels: expenses.map((ex) => ex.title),
    datasets: [
      {
        label: "Expenses ($)",
        data: expenses.map((ex) => ex.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h2>Reports</h2>
      <p>Total Students: {totalStudents}</p>
      <p>Total Expenses: ${totalExpenses}</p>

      <div style={{ width: "500px", marginTop: "20px" }}>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default Reports;
