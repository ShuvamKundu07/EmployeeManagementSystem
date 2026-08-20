import React, { useState, useEffect } from 'react';
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets.jsx';
import Loading from '../components/Loading.jsx';
import EmployeeDashboard from '../components/EmployeeDashboard.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('dashboard').then((res)=>setData(res.data)).catch((err)=>toast.error(err.response?.data?.error || err?.message)).finally(()=>setLoading(false))
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

