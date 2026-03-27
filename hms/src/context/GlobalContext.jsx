import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { message } from "antd";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [workerPayments, setWorkerPayments] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Data Loading States
  const [loading, setLoading] = useState(false);

  // Note: For this simplified global state, we fetch all data to avoid pagination 
  // complexity across tabs, or we can fetch a large limit if pagination isn't strictly needed for the UI scope.
  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students?limit=10000");
      setStudents(data.students);
    } catch (err) {
      message.error("Failed to load students");
    }
  };

  const fetchRooms = async () => {
    try {
      const { data } = await api.get("/rooms");
      setRooms(data.rooms);
    } catch (err) {
      message.error("Failed to load rooms");
    }
  };

  const fetchWorkers = async () => {
    try {
      const { data } = await api.get("/workers?limit=10000");
      setWorkers(data.workers);
    } catch (err) {
      message.error("Failed to load staff");
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/expenses?limit=10000");
      setExpenses(data.expenses);
    } catch (err) {
      message.error("Failed to load expenses");
    }
  };

  const fetchPayments = async () => {
    try {
      const { data } = await api.get("/payments?limit=10000");
      setPayments(data.payments);
    } catch (err) {
      message.error("Failed to load payments");
    }
  };

  const fetchWorkerPayments = async () => {
    try {
      const { data } = await api.get("/worker-payments?limit=10000");
      setWorkerPayments(data.payments);
    } catch (err) {
      message.error("Failed to load staff payments");
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStudents(),
      fetchWorkers(),
      fetchExpenses(),
      fetchPayments(),
      fetchWorkerPayments(),
      fetchRooms()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        students,
        workers,
        expenses,
        payments,
        workerPayments,
        rooms,
        fetchStudents,
        fetchWorkers,
        fetchExpenses,
        fetchPayments,
        fetchWorkerPayments,
        fetchRooms,
        loading
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
