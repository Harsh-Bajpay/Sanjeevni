import React, { useState, useEffect } from 'react';
import { Check, Clock, UserCheck } from 'lucide-react';
import { subscribeToStaff, updateStaffAttendance } from '../lib/firebase';

export default function Attendance() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would come from Auth. Hardcoded for demo.
  const currentDoctorId = 'doc_1';

  useEffect(() => {
    const unsubscribe = subscribeToStaff((data) => {
      setStaff(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCheckIn = async (status: string) => {
    try {
      await updateStaffAttendance(currentDoctorId, status);
    } catch (err) {
      console.error("Attendance update failed", err);
    }
  };

  const currentDoctor = staff.find(s => s.id === currentDoctorId);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Staff Attendance Roster</h2>
        <p className="text-gray-500">One-click check-in for doctors and active duty roster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card flex flex-col items-center text-center p-8">
          <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold mb-4 shadow-sm border border-primary-200">
            Dr. A
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. A. Sharma</h3>
          <p className="text-gray-500 mb-8">General Physician</p>
          
          {loading ? (
            <p className="text-gray-400">Loading status...</p>
          ) : (
            currentDoctor?.status === 'Present' ? (
              <button className="btn btn-danger w-full max-w-xs" onClick={() => handleCheckIn('Absent')}>
                <Clock size={18} /> Check-Out
              </button>
            ) : (
              <button className="btn btn-success w-full max-w-xs" onClick={() => handleCheckIn('Present')}>
                <Check size={18} /> Check-In for Duty
              </button>
            )
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-4 mb-4">
            <UserCheck size={20} className="text-primary-500" /> Live Duty Roster
          </h3>
          
          <div className="space-y-3">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm">
                    {(member.staff_name || member.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-tight">{member.staff_name || member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
                
                <div>
                  {member.status === 'Present' ? (
                    <span className="badge badge-low">On Duty</span>
                  ) : (
                    <span className="badge bg-gray-200 text-gray-600">Off Duty</span>
                  )}
                </div>
              </div>
            ))}
            
            {staff.length === 0 && !loading && (
              <p className="text-gray-500 text-center py-4 text-sm">No staff data available in Firestore.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
