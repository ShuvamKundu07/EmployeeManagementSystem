import { Loader2Icon, LogInIcon, LogOutIcon } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const CheckInButton = ({ todayRecord, onAction }) => {
    const [loading, setLoading] = useState(false)

    const handleAttendance = async () => {
        setLoading(true)
        try {
            const res = await api.post("/attendance")
            toast.success(res.data.type === "CHECK_IN" ? "Checked in successfully!" : "Checked out successfully!")
            if (onAction) onAction()
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.message || "Failed to record attendance")
        } finally {
            setLoading(false)
        }
    }

    // User is checked in if checkIn exists but checkOut does not
    const isCheckedIn = Boolean(todayRecord?.checkIn && !todayRecord?.checkOut)
    const isCompleted = Boolean(todayRecord?.checkIn && todayRecord?.checkOut)

    if (isCompleted) {
        return (
            <div className='flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200'>
                <h3 className='text-lg font-bold text-slate-900'>Work Day Completed</h3>
                <p className='text-slate-500 text-sm mt-1'>Great job! See you tomorrow</p>
            </div>
        )
    }

    return (
        <div className='fixed bottom-6 right-6 z-40'>
            <button 
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl transition-all duration-200 text-white ${
                    isCheckedIn 
                        ? "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black" 
                        : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                }`}
                onClick={handleAttendance} 
                disabled={loading}
            >
                {loading ? (
                    <Loader2Icon className='size-6 animate-spin' />
                ) : isCheckedIn ? (
                    <LogOutIcon className='size-6' />
                ) : (
                    <LogInIcon className='size-6' />
                )}

                <div className='text-left'>
                    <h2 className='text-sm font-semibold leading-tight'>
                        {loading ? "Processing..." : isCheckedIn ? "Clock Out" : "Clock In"}
                    </h2>
                    <p className='text-xs text-indigo-100 opacity-80 mt-0.5'>
                        {isCheckedIn ? "Click to end your shift" : "Start your work day"}
                    </p>
                </div>
            </button>
        </div>
    )
}

export default CheckInButton