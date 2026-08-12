'use client'

import { useState } from 'react'

type Student = {
  id: string
  student_name: string
  age: number
  billing_count: number
  parent_name: string
  parent_phone: string
}

type ClassStat = {
  id: string
  name: string
  count: number
  students: Student[]
}

export default function ClassStatsClient({ classStats }: { classStats: ClassStat[] }) {
  const [selectedClass, setSelectedClass] = useState<ClassStat | null>(null)

  return (
    <div>
      {/* Box Grid */}
      {classStats.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {classStats.map((cls, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedClass(cls)}
              className="bg-surface-container-lowest border border-surface-variant/40 p-4 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors line-clamp-2">{cls.name}</p>
                <span className="material-symbols-outlined text-[16px] text-outline-variant group-hover:text-primary transition-colors">open_in_new</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-headline font-bold text-primary">{cls.count}</span>
                <span className="text-xs text-on-surface-variant mb-1 font-medium">Siswa Aktif</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-on-surface-variant italic p-4 bg-surface-container-lowest border border-surface-variant/40 rounded-2xl">
          Belum ada data siswa aktif di kelas manapun.
        </div>
      )}

      {/* Modal Detail Siswa */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedClass(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">class</span>
                  Siswa Aktif: {selectedClass.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Total {selectedClass.count} siswa yang sudah lunas (Verified)</p>
              </div>
              <button 
                onClick={() => setSelectedClass(null)} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* List */}
            <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
              {selectedClass.students.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">Tidak ada siswa aktif.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/80 sticky top-0 backdrop-blur-sm">
                    <tr>
                      <th className="py-3 px-6 font-semibold text-gray-600 border-b border-gray-100">Nama Siswa</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 border-b border-gray-100">Usia</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 border-b border-gray-100">Bulan SPP</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 border-b border-gray-100">Orang Tua</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 border-b border-gray-100">No. WA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedClass.students.map(student => (
                      <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-800">{student.student_name}</td>
                        <td className="py-4 px-6 text-gray-600">{student.age || '-'} Thn</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-md">
                            Bulan ke-{student.billing_count || 1}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{student.parent_name}</td>
                        <td className="py-4 px-6">
                          {student.parent_phone && student.parent_phone !== '-' ? (
                            <a 
                              href={`https://wa.me/${student.parent_phone.replace(/^0/, '62')}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-medium"
                            >
                              {student.parent_phone}
                              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
