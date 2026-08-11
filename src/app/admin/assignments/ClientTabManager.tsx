'use client'

import { useState } from 'react'

export default function ClientTabManager({ children }: { children: React.ReactNode[] }) {
  const [activeTab, setActiveTab] = useState<'assignments' | 'quizzes'>('assignments')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-2xl w-full max-w-sm">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'assignments' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Materi & Tugas
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'quizzes' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Kuis
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
        {activeTab === 'assignments' ? children[0] : children[1]}
      </div>
    </div>
  )
}
