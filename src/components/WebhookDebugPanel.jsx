
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, Trash2, Terminal, XCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getWebhookLogs, clearWebhookLogs, logWebhookAttempt } from '@/utils/webhookLogger';
import { triggerN8nWebhook } from '@/services/appointmentService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WebhookDebugPanel = () => {
  // Only show in development or if specifically enabled
  const isDev = import.meta.env.MODE === 'development';
  
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);

  const refreshLogs = () => {
    setLogs(getWebhookLogs());
  };

  useEffect(() => {
    refreshLogs();
    // Auto-refresh every 5 seconds if open
    let interval;
    if (isOpen) {
      interval = setInterval(refreshLogs, 5000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClearLogs = () => {
    clearWebhookLogs();
    refreshLogs();
  };

  const handleTestTrigger = async () => {
    setTesting(true);
    try {
      // Mock appointment data for testing
      const mockData = {
        id: `test-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: '10:00:00',
        exam_type: 'Teste de Webhook',
        service: 'Teste Debug',
        status: 'pending',
        notes: 'This is a test trigger from debug panel',
        guest_name: 'Debug User',
        guest_email: 'debug@test.com',
        is_guest: true
      };
      
      await triggerN8nWebhook(mockData);
      refreshLogs();
    } catch (e) {
      console.error(e);
    } finally {
      setTesting(false);
    }
  };

  if (!isDev) return null;

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white shadow-lg border-gray-700 hover:bg-gray-800"
        onClick={() => setIsOpen(true)}
      >
        <Terminal size={16} className="mr-2" /> Webhook Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] shadow-2xl border-gray-800 bg-gray-950 text-gray-100 flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-gray-800 flex flex-row items-center justify-between bg-gray-900 rounded-t-lg">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Terminal size={14} className="text-green-500" />
          n8n Webhook Logs
        </CardTitle>
        <div className="flex items-center gap-1">
           <Button variant="ghost" size="icon" onClick={refreshLogs} className="h-6 w-6 text-gray-400 hover:text-white">
             <RefreshCw size={12} />
           </Button>
           <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-gray-400 hover:text-white">
             <XCircle size={14} />
           </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col bg-gray-950">
        <div className="p-2 border-b border-gray-800 flex gap-2">
          <Button 
            size="sm" 
            variant="default" 
            className="flex-1 bg-green-700 hover:bg-green-800 text-xs"
            onClick={handleTestTrigger}
            disabled={testing}
          >
            {testing ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Send className="mr-2 h-3 w-3" />}
            Test Trigger
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            className="w-auto px-3 text-xs"
            onClick={handleClearLogs}
          >
            <Trash2 size={12} />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-xs">
              No logs found.
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="text-xs font-mono border-l-2 pl-3 py-1 space-y-1" 
                  style={{ 
                    borderColor: log.status === 'success' ? '#22c55e' : log.status === 'error' ? '#ef4444' : '#eab308' 
                  }}
                >
                  <div className="flex justify-between items-center text-gray-400">
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <Badge variant="outline" className={`text-[10px] px-1 py-0 h-4 border-0 
                      ${log.status === 'success' ? 'bg-green-900/30 text-green-400' : 
                        log.status === 'error' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {log.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-gray-300 truncate font-semibold">
                    ID: {log.appointmentId?.substring(0, 8)}...
                  </div>
                  {log.error && (
                    <div className="text-red-400 break-words mt-1 bg-red-950/30 p-1 rounded">
                      Error: {log.error}
                    </div>
                  )}
                  {log.message && (
                    <div className="text-yellow-400 break-words mt-1">
                      {log.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 bg-gray-900 border-t border-gray-800 text-[10px] text-gray-500 text-center">
            {import.meta.env.VITE_N8N_WEBHOOK_BASE_URL ? 'Webhook URL Configured' : 'Missing Webhook URL'}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookDebugPanel;
