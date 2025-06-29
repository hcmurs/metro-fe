import { useState } from 'react';
// import FeedbackTab from './components/FeedbackTab'
import StudentRequestTab from './components/StudentRequestTab';
import UserInfoTab from './components/UserInfoTab';
import FeedbackTab from './components/FeedbackTab';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="bg-[#e6fffd]/30 py-8 px-4 min-h-full min-w-full">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#e6fffd]">
          <div className="flex flex-row md:flex-col">
            <button
              className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium text-left transition-all duration-200 ${activeTab === 'info' ? 'text-teal-800 bg-[#e6fffd] border-b-2 md:border-b-0 md:border-l-4 border-teal-500' : 'text-gray-600 hover:text-teal-700 hover:bg-[#e6fffd]/50'}`}
              onClick={() => setActiveTab('info')}
            >
              Personal Information
            </button>
            <button
              className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium text-left transition-all duration-200 ${activeTab === 'student' ? 'text-teal-800 bg-[#e6fffd] border-b-2 md:border-b-0 md:border-l-4 border-teal-500' : 'text-gray-600 hover:text-teal-700 hover:bg-[#e6fffd]/50'}`}
              onClick={() => setActiveTab('student')}
            >
              Student Request
            </button>
            <button
              className={`flex-1 md:flex-none px-6 py-4 text-sm font-medium text-left transition-all duration-200 ${activeTab === 'feedback' ? 'text-teal-800 bg-[#e6fffd] border-b-2 md:border-b-0 md:border-l-4 border-teal-500' : 'text-gray-600 hover:text-teal-700 hover:bg-[#e6fffd]/50'}`}
              onClick={() => setActiveTab('feedback')}
            >
              Feedback
            </button>
          </div>
        </div>
        <div className="p-8 flex-1 bg-white">
          {activeTab === 'info' && <UserInfoTab />}
          {activeTab === 'student' && <StudentRequestTab />}
          {activeTab === 'feedback' && <FeedbackTab />}
        </div>
      </div>
    </div>
  )
}
