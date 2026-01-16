
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Mail, Phone, Shield, Power } from 'lucide-react';
import { validateEmail, validatePhone, formatPhone } from '@/utils/validation';

const UserForm = ({ user, onSuccess, onCancel, onSubmit }) => {
  const isEditing = !!user;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'user',
    status: user?.active ?? true
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "E-mail inválido",
        description: "Insira um endereço de e-mail válido.",
        variant: "destructive"
      });
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: "Telefone inválido",
        description: "Insira um número de telefone válido.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome do usuário"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(99) 99999-9999"
              maxLength={15}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
                <option value="master">Master</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
             <div className="flex items-center h-10">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.status ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.status ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm text-gray-600">
                  {formData.status ? 'Ativo' : 'Inativo'}
                </span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting} className="bg-[#C94B6D] hover:bg-[#A63D5A] text-white">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
