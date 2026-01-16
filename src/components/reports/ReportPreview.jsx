
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusBadgeColor } from '@/utils/reportFormatters';
import { FileSearch } from 'lucide-react';

const ReportPreview = ({ data, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
        <FileSearch size={48} className="mb-4 text-gray-300" />
        <p>Nenhum dado encontrado para os filtros selecionados.</p>
      </div>
    );
  }

  // Render different tables based on report type
  if (type === 'appointments') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{formatDate(row.date)}</TableCell>
                  <TableCell>{row.time?.slice(0, 5)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{row.client_name}</span>
                      <span className="text-xs text-gray-500">{row.client_phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>{row.admin_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeColor(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 bg-gray-50 text-xs text-gray-500 border-t">
          Mostrando {data.length} registros
        </div>
      </div>
    );
  }

  if (type === 'clients') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-center">Total Agend.</TableHead>
                <TableHead className="text-center">Confirmados</TableHead>
                <TableHead>Última Visita</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.client_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span>{row.client_email}</span>
                      <span>{row.client_phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{row.total_appointments}</TableCell>
                  <TableCell className="text-center">{row.confirmed_appointments}</TableCell>
                  <TableCell>{formatDate(row.last_appointment)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 bg-gray-50 text-xs text-gray-500 border-t">
          Mostrando {data.length} clientes
        </div>
      </div>
    );
  }
  
  if (type === 'revenue') {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead>Profissional</TableHead>
                        <TableHead className="text-right">Total Agendamentos</TableHead>
                        <TableHead className="text-right">Confirmados</TableHead>
                        <TableHead className="text-right">Cancelados</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{row.admin_name}</TableCell>
                            <TableCell className="text-right">{row.total}</TableCell>
                            <TableCell className="text-right text-green-600">{row.confirmed}</TableCell>
                            <TableCell className="text-right text-red-600">{row.canceled}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      );
  }

  return <div>Visualização não disponível para este tipo de relatório.</div>;
};

export default ReportPreview;
