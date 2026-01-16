
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/services/authService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { formatPhone, formatCEP, validatePhone } from '@/utils/validation';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || user?.user_metadata?.full_name || '',
    phone: user?.phone || '',
    bairro: user?.bairro || '',
    cep: user?.cep || '',
    cidade: user?.cidade || '',
    estado: user?.estado || '',
  });
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }
    
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone && !validatePhone(formData.phone)) {
      toast({
        title: 'Telefone inválido',
        description: 'Por favor, insira um telefone válido.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    const { error } = await updateUserProfile(user.id, formData);
    setLoading(false);
    
    if (error) {
      toast({
        title: 'Erro ao atualizar',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Perfil atualizado no Gestorate!',
      description: 'Suas informações foram atualizadas com sucesso.',
    });
    
    setEditing(false);
    refreshUser();
  };

  return (
    <>
      <Helmet>
        <title>Meu Perfil - Gestorate</title>
        <meta name="description" content="Visualize e edite suas informações de perfil no Gestorate." />
      </Helmet>
      
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Informações Pessoais</CardTitle>
                {!editing && (
                  <Button
                    onClick={() => setEditing(true)}
                    className="bg-[#C94B6D] hover:bg-[#A63D5A] text-white"
                  >
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        value={user?.email || ''}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        className="pl-10"
                        maxLength={15}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                    <Input
                      value={user?.cpf || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        disabled={!editing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                    <Input
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      disabled={!editing}
                      maxLength={9}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                    <Input
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <Input
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      disabled={!editing}
                      maxLength={2}
                    />
                  </div>
                </div>
                
                {editing && (
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#C94B6D] hover:bg-[#A63D5A] text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar Alterações'
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user?.name || user?.user_metadata?.full_name || '',
                          phone: user?.phone || '',
                          bairro: user?.bairro || '',
                          cep: user?.cep || '',
                          cidade: user?.cidade || '',
                          estado: user?.estado || '',
                        });
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
