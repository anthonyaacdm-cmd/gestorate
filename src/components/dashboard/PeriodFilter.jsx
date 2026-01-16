
import React from 'react';

const PeriodFilter = ({ period, setPeriod }) => {
  const periods = [
    { id: '7d', label: '7 Dias' },
    { id: '30d', label: '30 Dias' },
    { id: '3m', label: '3 Meses' },
    { id: '6m', label: '6 Meses' },
    { id: '1y', label: '1 Ano' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4 bg-white p-1 rounded-lg border border-gray-100 shadow-sm w-fit">
      {periods.map((p) => (
        <button
          key={p.id}
          onClick={() => setPeriod(p.id)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            period === p.id
              ? 'bg-[#C94B6D] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodFilter;
