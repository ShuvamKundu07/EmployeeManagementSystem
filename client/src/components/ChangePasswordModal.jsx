import { Loader2Icon, LockIcon, X } from 'lucide-react'
import React, { useState } from 'react'
import api from '../api/axios'

const ChangePasswordModal = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: "", text: "" })

        const form = e.currentTarget
        const formData = new FormData(form)
        const currentPassword = formData.get("currentPassword")
        const newPassword = formData.get("newPassword")

        try {
            // Destructure data from the Axios response
            const res = await api.post("/auth/change-password", { currentPassword, newPassword })

            setMessage({ type: "success", text: res.data?.message || "Password updated successfully" })
            form.reset()

            // Automatically close modal after brief delay on success
            setTimeout(() => {
                onClose?.()
            }, 1200)
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.error || error.message || "Failed to update password"
            })
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div 
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            onClick={onClose}
        >
            <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' />

            <div 
                className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between p-6 pb-0'>
                    <h2 className='text-lg font-medium text-slate-900 flex items-center gap-2'>
                        <LockIcon className='w-5 h-5 text-slate-400' /> Change Password
                    </h2>
                    <button 
                        type='button'
                        className='p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'
                        onClick={onClose}
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-5'>
                    {message.text && (
                        <div className={`p-3 rounded-xl text-sm flex items-start gap-3 ${
                            message.type === "success" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                message.type === "success" ? "bg-emerald-500" : "bg-rose-500"
                            }`} />
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                            Current Password
                        </label>
                        <input 
                            type="password" 
                            name='currentPassword' 
                            required 
                            placeholder='••••••••'
                            className='w-full rounded-lg px-3 py-2 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>
                            New Password
                        </label>
                        <input 
                            type="password" 
                            name='newPassword' 
                            required 
                            placeholder='••••••••'
                            className='w-full rounded-lg px-3 py-2 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                    </div>

                    <div className='flex gap-3 pt-2'>
                        <button 
                            type='button' 
                            onClick={onClose} 
                            className='btn-secondary flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors'
                        >
                            Cancel
                        </button>
                        <button 
                            type='submit' 
                            disabled={loading} 
                            className='btn-primary flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium'
                        >
                            {loading ? <Loader2Icon className='w-4 h-4 animate-spin' /> : null}
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordModal