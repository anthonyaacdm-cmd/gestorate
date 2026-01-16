
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TopActiveUsersTable = ({ users }) => {
  return (
    <Card className="col-span-1 lg:col-span-2 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">Usuários Mais Ativos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3 font-medium">Usuário</th>
                        <th className="px-6 py-3 font-medium text-center">Qtd. Agendamentos</th>
                        <th className="px-6 py-3 font-medium text-right">Último Agendamento</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((u, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-full">
                                        <User size={16} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                        <div className="text-xs text-gray-500">{u.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {u.count}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                {u.lastAppointment ? format(parseISO(u.lastAppointment), "dd/MM/yyyy") : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopActiveUsersTable;
