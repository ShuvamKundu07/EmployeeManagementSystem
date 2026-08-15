import React, { useState, useEffect } from 'react';
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets.jsx';
import Loading from '../components/Loading.jsx';
import EmployeeDashboard from '../components/EmployeeDashboard.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(dummyEmployeeDashboardData); // Replace with actual logic to fetch dashboard data
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a loading delay
  }, []);

  if (loading) {
    return <Loading />;
  }

  if(!data) {
    return <p className="text-center text-slate-500 py-12">Failed to load data</p>
  }

  if(data.role === 'ADMIN'){
    return <AdminDashboard data={data}/>
  }else{
    return <EmployeeDashboard data={data} />
  }
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard

