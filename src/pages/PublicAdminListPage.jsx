
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { User, Calendar, Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const PublicAdminListPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'admin')
          .eq('active', true);

        if (error) throw error;
        setAdmins(data || []);
      } catch (err) {
        console.error('Error fetching admins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(admin => 
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Helmet>
        <title>Profissionais - Gestorate</title>
        <meta name="description" content="Escolha um profissional e agende seu horário no Gestorate." />
      </Helmet>
      
      <div className="bg-[#C94B6D] py-16 text-white text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Agende seu Horário com o Gestorate</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Selecione um profissional abaixo e agende sua consulta ou exame de forma rápida e prática, sem precisar de cadastro.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-4 mb-8 border border-gray-100">
          <Search className="text-gray-400 w-5 h-5 ml-2" />
          <Input 
            placeholder="Buscar profissional por nome..." 
            className="border-none shadow-none focus-visible:ring-0 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Nenhum profissional encontrado no Gestorate.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredAdmins.map((admin, index) => (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-none shadow-md h-full flex flex-col">
                   <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200"></div>
                   <CardContent className="pt-0 relative flex-1 flex flex-col items-center text-center -mt-12">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-sm mb-4">
                        <AvatarImage src={admin.avatar_url || ""} />
                        <AvatarFallback className="bg-[#C94B6D] text-white text-xl">
                          {admin.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{admin.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 bg-gray-100 px-3 py-1 rounded-full">
                        Especialista
                      </p>
                      
                      <div className="text-sm text-gray-600 mb-6 px-4">
                        Agende sua consulta ou exame com {admin.name.split(' ')[0]} agora mesmo.
                      </div>
                   </CardContent>
                   <CardFooter className="pb-6 px-6">
                     <Link to={`/book/${admin.id}`} className="w-full">
                       <Button className="w-full bg-[#C94B6D] hover:bg-[#b03d5b] group">
                         Agendar Agora <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </Button>
                     </Link>
                   </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicAdminListPage;
