
import React from 'react';
import { CheckCircle2, Calendar, Clock, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BookingConfirmation = ({ appointment, onReset }) => {
  if (!appointment) return null;

  return (
    <div className="flex items-center justify-center min-h-[50vh] animate-in zoom-in duration-300">
      <Card className="max-w-md w-full border-none shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Agendamento Confirmado!</CardTitle>
          <p className="text-gray-500 mt-2">
            Obrigado, {appointment.guest_name}. Seu agendamento foi realizado com sucesso.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-sm text-gray-500">Código de Confirmação</span>
              <span className="font-mono font-bold text-gray-900">{appointment.id.slice(0, 8).toUpperCase()}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={12} /> Data
                </span>
                <p className="font-medium text-gray-900 capitalize">
                  {format(parseISO(appointment.date), "dd MMM, yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                  <Clock size={12} /> Horário
                </span>
                <p className="font-medium text-gray-900">
                  {appointment.time.slice(0, 5)}
                </p>
              </div>
            </div>
            
            <div className="space-y-1 pt-2">
               <span className="text-xs text-gray-500">Serviço</span>
               <p className="font-medium text-gray-900">{appointment.exam_type}</p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Um email com os detalhes foi enviado para<br/>
            <span className="font-medium text-gray-900">{appointment.guest_email}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button onClick={onReset} className="w-full bg-[#C94B6D] hover:bg-[#b03d5b]">
            Agendar Outro Horário
          </Button>
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" /> Voltar para Início
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
