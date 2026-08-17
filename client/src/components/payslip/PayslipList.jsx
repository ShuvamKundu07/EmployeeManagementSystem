import React from 'react'
import { format } from 'date-fns'
import { Download } from 'lucide-react'

const PayslipList = ({ payslips = [], isAdmin = false }) => {
    return (
        <div className='card overflow-hidden'>
          <div className='overflow-x-auto'>
                <table className='table-modern w-full'>
                    <thead>
                        <tr className='border-b border-slate-100'>
                            {isAdmin && <th className='text-left py-3 px-4'>Employee</th>}
                            <th className='text-left py-3 px-4'>Period</th>
                            <th className='text-left py-3 px-4'>Basic Salary</th>
                            <th className='text-left py-3 px-4'>Net Salary</th>
                            <th className='text-center py-3 px-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payslips.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={isAdmin ? 5 : 4} 
                                    className='text-center py-12 text-slate-400 text-sm'
                                >
                                    No payslips found
                                </td>
                            </tr>
                        ) : (
                            payslips.map((payslip) => {
                                const id = payslip._id || payslip.id
                                
                                return (
                                    <tr key={id} className='border-b border-slate-100 hover:bg-slate-50/50 transition-colors'>
                                        {isAdmin && (
                                            <td className='py-3.5 px-4 font-medium text-slate-900'>
                                                {payslip.employee?.firstName} {payslip.employee?.lastName}
                                            </td>
                                        )}

                                        <td className='py-3.5 px-4 text-slate-600 text-sm'>
                                            {format(new Date(payslip.year, (payslip.month || 1) - 1), 'MMMM yyyy')}
                                        </td>

                                        <td className='py-3.5 px-4 text-slate-600 text-sm'>
                                            ${payslip.basicSalary?.toLocaleString() ?? 0}
                                        </td>

                                        <td className='py-3.5 px-4 font-semibold text-slate-800 text-sm'>
                                            ${payslip.netSalary?.toLocaleString() ?? 0}
                                        </td>

                                        <td className='py-3.5 px-4 text-center'>
                                            <button
                                                type='button'
                                                className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10'
                                                onClick={() => window.open(`/print/payslips/${id}`, '_blank')}
                                            >
                                                <Download className='w-3.5 h-3.5 mr-1.5' />
                                                Download
                                            </button>
                                        </td>
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

export default PayslipList