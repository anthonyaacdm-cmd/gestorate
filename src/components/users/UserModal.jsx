
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, Shield, Activity, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const UserModal = ({ isOpen, onClose, user, onEdit, onDelete }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
             <span>Detalhes do Usuário</span>
             <span className={`text-xs px-2 py-1 rounded-full ${
               user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
             }`}>
                {user.active ? 'Ativo' : 'Inativo'}
             </span>
          </DialogTitle>
          <DialogDescription>
            Informações completas do cadastro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Nome</p>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">E-mail</p>
                    <p className="text-gray-900">{user.email}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="text-gray-900">{user.phone}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <Shield className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Função</p>
                    <p className="text-gray-900 capitalize">
                      {user.role === 'admin' ? 'Administrador' : user.role === 'master' ? 'Master' : 'Usuário'}
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                    <p className="text-sm font-medium text-gray-500">Criado em</p>
                    <p className="text-gray-900">
                        {user.created_at ? format(new Date(user.created_at), "dd 'de' MMM 'de' yyyy", { locale: ptBR }) : 'N/A'}
                    </p>
                </div>
            </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => onEdit(user)} className="w-full sm:w-auto">
                <Edit2 className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button variant="destructive" onClick={() => onDelete(user)} className="w-full sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 border-none">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </Button>
            <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
                Fechar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
