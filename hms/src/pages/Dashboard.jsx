import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    const studentSnap = await getDocs(collection(db, "students"));
    setStudents(studentSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const expenseSnap = await getDocs(collection(db, "expenses"));
    setExpenses(expenseSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addStudent = async () => {
    await addDoc(collection(db, "students"), { name: studentName });
    setStudentName("");
    fetchData();
  };

  const updateStudent = async (id, newName) => {
    const studentRef = doc(db, "students", id);
    await updateDoc(studentRef, { name: newName });
    fetchData();
  };

  const removeStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
    fetchData();
  };

  const addExpense = async () => {
    await addDoc(collection(db, "expenses"), { title: expenseTitle, amount: expenseAmount });
    setExpenseTitle("");
    setExpenseAmount("");
    fetchData();
  };

  const updateExpense = async (id, newTitle, newAmount) => {
    const expenseRef = doc(db, "expenses", id);
    await updateDoc(expenseRef, { title: newTitle, amount: newAmount });
    fetchData();
  };

  const removeExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    fetchData();
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <h3>Students</h3>
      <input
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Student name"
      />
      <button onClick={addStudent}>Add Student</button>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name}{" "}
            <button onClick={() => removeStudent(s.id)}>Delete</button>
            <button
              onClick={() => {
                const newName = prompt("Enter new name:", s.name);
                if (newName) updateStudent(s.id, newName);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      <h3>Expenses</h3>
      <input
        value={expenseTitle}
        onChange={(e) => setExpenseTitle(e.target.value)}
        placeholder="Expense Title"
      />
      <input
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={addExpense}>Add Expense</button>
      <ul>
        {expenses.map((ex) => (
          <li key={ex.id}>
            {ex.title} - ${ex.amount}{" "}
            <button onClick={() => removeExpense(ex.id)}>Delete</button>
            <button
              onClick={() => {
                const newTitle = prompt("Enter new title:", ex.title);
                const newAmount = prompt("Enter new amount:", ex.amount);
                if (newTitle && newAmount) updateExpense(ex.id, newTitle, newAmount);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
