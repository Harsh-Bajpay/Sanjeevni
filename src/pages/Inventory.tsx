import React, { useEffect, useState } from 'react';
import { PackageMinus, Activity } from 'lucide-react';
import { subscribeToInventory, prescribeMedicine } from '../lib/firebase';

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToInventory((data) => {
      setInventory(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePrescribe = async (id: string, currentStock: number) => {
    if (currentStock <= 0) return;
    try {
      await prescribeMedicine(id, 1);
    } catch (err) {
      console.error("Failed to prescribe:", err);
      alert("Failed to update stock. Are you offline?");
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pharmacy Inventory</h2>
        <p className="text-gray-500">Real-time medicine stock levels with offline sync.</p>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Activity className="animate-pulse mb-4 text-primary-500" size={32} />
            <p>Loading inventory from Firestore...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 font-medium">
                  <th className="p-4">Medicine Name</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Min. Threshold</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No inventory items found. Add them to Firestore.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{item.item_name}</td>
                      <td className="p-4">
                        <span className={`font-bold ${item.current_stock <= (item.minimum_threshold || 10) ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.current_stock}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{item.minimum_threshold || 10}</td>
                      <td className="p-4">
                        <button 
                          className="btn text-sm px-3 py-1.5"
                          style={{ 
                            backgroundColor: item.current_stock > 0 ? 'var(--bg-color)' : '#fee2e2',
                            color: item.current_stock > 0 ? 'var(--primary-color)' : '#b91c1c',
                            border: '1px solid var(--border-color)',
                          }}
                          // Use inline styling above just to bypass full tailwind complex conditions, or better yet, full tailwind:
                          className={`btn text-sm px-3 py-1.5 border ${
                            item.current_stock > 0 
                              ? 'bg-white border-gray-200 text-primary-600 hover:bg-gray-50' 
                              : 'bg-red-50 border-red-100 text-red-600 opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => handlePrescribe(item.id, item.current_stock)}
                          disabled={item.current_stock <= 0}
                        >
                          <PackageMinus size={16} /> Prescribe 1 Unit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
