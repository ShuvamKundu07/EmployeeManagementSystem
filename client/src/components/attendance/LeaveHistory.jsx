import { Check, Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import { format } from 'date-fns'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
    const [processing, setProcessing] = useState(null)

    const handleStatusUpdate = async (id, status) => {
        setProcessing(id)
        try {
            await api.patch(`/leave/${id}`, { status })
            toast.success(`Leave request marked as ${status.toLowerCase()}`)
            if (onUpdate) onUpdate()
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || "Failed to update status")
        } finally {
            setProcessing(null)
        }
    }

    return (
        <div className='card overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='table-modern w-full text-left border-collapse'>
                    <thead>
                        <tr className='border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                            {isAdmin && <th className='p-4'>Employee</th>}
                            <th className='p-4'>Type</th>
                            <th className='p-4'>Dates</th>
                            <th className='p-4'>Reason</th>
                            <th className='p-4'>Status</th>
                            {isAdmin && <th className='p-4 text-center'>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100 text-sm'>
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 4} className='text-center py-12 text-slate-400'>
                                    No leave applications found
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave) => {
                                const leaveId = leave._id || leave.id
                                const fullName = leave.employee?.firstName 
                                    ? `${leave.employee.firstName} ${leave.employee.lastName || ''}`.trim()
                                    : "Unknown Employee"

                                return (
                                    <tr key={leaveId} className='hover:bg-slate-50/50 transition-colors'>
                                        {isAdmin && (
                                            <td className='p-4'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium text-xs shrink-0'>
                                                        {leave.employee?.firstName?.[0]?.toUpperCase() || "E"}
                                                    </div>
                                                    <div>
                                                        <p className='font-medium text-slate-900 leading-snug'>{fullName}</p>
                                                        <p className='text-xs text-slate-400'>{leave.employee?.department || leave.employee?.email || ''}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        
                                        <td className='p-4'>
                                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize'>
                                                {leave.type?.toLowerCase()}
                                            </span>
                                        </td>
        
                                        <td className='p-4 text-xs text-slate-500 whitespace-nowrap'>
                                            {leave.startDate && leave.endDate ? (
                                                <>
                                                    {format(new Date(leave.startDate), "MMM dd")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                                                </>
                                            ) : "-"}
                                        </td>
        
                                        <td className='p-4 max-w-xs truncate text-slate-500' title={leave.reason}>
                                            {leave.reason}
                                        </td>
        
                                        <td className='p-4'>
                                            <span className={`badge ${
                                                leave.status === "APPROVED" 
                                                    ? "badge-success" 
                                                    : leave.status === "REJECTED" 
                                                    ? "badge-danger" 
                                                    : "badge-warning"
                                            }`}>
                                                {leave.status}
                                            </span>
                                        </td>

                                        {isAdmin && (
                                            <td className='p-4'>
                                                {leave.status === "PENDING" ? (
                                                    <div className='flex justify-center gap-2'>
                                                        <button 
                                                            type='button'
                                                            title='Approve'
                                                            className='p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors' 
                                                            disabled={!!processing}
                                                            onClick={() => handleStatusUpdate(leaveId, "APPROVED")}
                                                        >
                                                            {processing === leaveId ? <Loader2 className='w-4 h-4 animate-spin'/> : <Check className='w-4 h-4'/>}
                                                        </button>

                                                        <button 
                                                            type='button'
                                                            title='Reject'
                                                            className='p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors' 
                                                            disabled={!!processing}
                                                            onClick={() => handleStatusUpdate(leaveId, "REJECTED")}
                                                        >
                                                            {processing === leaveId ? <Loader2 className='w-4 h-4 animate-spin'/> : <X className='w-4 h-4'/>}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className='text-center text-xs text-slate-400'>—</div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LeaveHistory