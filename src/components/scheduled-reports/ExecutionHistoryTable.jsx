
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileDown, AlertCircle, CheckCircle2 } from 'lucide-react';

const ExecutionHistoryTable = ({ history }) => {
  if (!history || history.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhum histórico de execução encontrado.</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data de Execução</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Destinatários</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {format(new Date(entry.executed_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={entry.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                  {entry.status === 'success' ? <CheckCircle2 size={12} className="mr-1"/> : <AlertCircle size={12} className="mr-1"/>}
                  {entry.status === 'success' ? 'Sucesso' : 'Erro'}
                </Badge>
                {entry.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={entry.error_message}>
                    {entry.error_message}
                  </p>
                )}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-xs text-gray-500">
                {entry.recipients_sent?.join(', ') || '-'}
              </TableCell>
              <TableCell className="text-right">
                {entry.file_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={entry.file_url} target="_blank" rel="noopener noreferrer">
                      <FileDown size={14} className="mr-1" /> Baixar
                    </a>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExecutionHistoryTable;
