import React from 'react';
import { Users, Stethoscope, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-500">Today's summary across the PHC.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="bg-primary-100 p-4 rounded-xl text-primary-600">
            <Users size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Patients Today</p>
            <h3 className="text-2xl font-bold text-gray-900">42</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="bg-red-100 p-4 rounded-xl text-red-600">
            <Stethoscope size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">High Priority</p>
            <h3 className="text-2xl font-bold text-gray-900">5</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Doctors Active</p>
            <h3 className="text-2xl font-bold text-gray-900">3 / 5</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Triages</h3>
          <p className="text-sm text-gray-500">View the Triage module for full details.</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Stock Alerts</h3>
          <p className="text-sm text-gray-500">View the Inventory module to manage stock.</p>
        </div>
      </div>
    </div>
  );
}
