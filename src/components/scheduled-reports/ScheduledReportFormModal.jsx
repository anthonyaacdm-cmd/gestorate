
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ScheduledReportForm from './ScheduledReportForm';
import { FileClock } from 'lucide-react';

const ScheduledReportFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  const isEditing = !!initialData;

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileClock className="h-5 w-5 text-[#C94B6D]" />
            {isEditing ? 'Editar Relatório Agendado' : 'Novo Relatório Agendado'}
          </DialogTitle>
        </DialogHeader>
        <ScheduledReportForm 
          initialData={initialData} 
          onSubmit={handleFormSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledReportFormModal;
