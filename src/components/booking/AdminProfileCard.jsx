
import React from 'react';
import { User, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminProfileCard = ({ admin }) => {
  if (!admin) return null;

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-white">
      <div className="h-24 bg-gradient-to-r from-[#C94B6D] to-purple-600"></div>
      <CardContent className="pt-0 relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-12 mb-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-md">
            <AvatarImage src={admin.avatar_url || ""} />
            <AvatarFallback className="bg-gray-100 text-gray-500 text-2xl">
              {admin.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 mt-2 sm:mt-0">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {admin.name}
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </h2>
            <p className="text-gray-500 font-medium">Especialista / Profissional</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-[#C94B6D]" />
            <span className="text-sm truncate">{admin.email}</span>
          </div>
          {admin.phone && (
            <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-[#C94B6D]" />
              <span className="text-sm">{admin.phone}</span>
            </div>
          )}
        </div>

        {/* Placeholder for Specializations if we had a column for it */}
        <div className="mt-6">
           <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
             <Award className="w-4 h-4 text-[#C94B6D]" />
             Especialidades
           </h3>
           <div className="flex flex-wrap gap-2">
             <span className="px-3 py-1 bg-pink-50 text-pink-700 text-xs rounded-full font-medium">Consultas</span>
             <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">Exames</span>
             <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">Atendimento Geral</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProfileCard;
