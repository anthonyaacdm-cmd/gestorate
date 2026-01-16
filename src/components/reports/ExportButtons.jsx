
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';

const ExportButtons = ({ onExportPDF, onExportExcel, onExportCSV, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-gray-100 mt-4">
      <Button 
        variant="outline" 
        onClick={onExportCSV} 
        disabled={disabled}
        className="text-gray-600 border-gray-300 hover:bg-gray-50"
      >
        <Download size={16} className="mr-2" /> CSV
      </Button>
      <Button 
        variant="outline" 
        onClick={onExportExcel} 
        disabled={disabled}
        className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
      >
        <FileSpreadsheet size={16} className="mr-2" /> Excel
      </Button>
      <Button 
        onClick={onExportPDF} 
        disabled={disabled}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        <FileText size={16} className="mr-2" /> PDF
      </Button>
    </div>
  );
};

export default ExportButtons;
