
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MoreHorizontal, Edit2, Trash2, Power } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserCard = ({ user, onEdit, onDelete, onToggle }) => {
  return (
    <Card className={`mb-4 overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 ${
        user.role === 'admin' || user.role === 'master' ? 'border-l-red-400' : 'border-l-blue-400'
    }`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
               {user.name}
            </span>
            <span className="text-sm text-gray-500 mt-1">
               {user.email}
            </span>
            <span className="text-sm text-gray-500">
               {user.phone}
            </span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggle(user)}>
                {user.active ? 'Desativar' : 'Ativar'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(user)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600 focus:text-red-600">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 justify-between">
            <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.role === 'admin' || user.role === 'master' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {user.role}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                }`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                </span>
            </div>
            <span className="text-xs text-gray-400">
                {user.created_at && format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
