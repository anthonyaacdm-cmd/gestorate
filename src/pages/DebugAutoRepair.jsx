
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Database, 
  Wifi, 
  KeyRound,
  Wrench
} from 'lucide-react';

const DebugAutoRepair = () => {
  const [loading, setLoading] = useState(true);
  const [repairing, setRepairing] = useState(false);
  
  // Status States
  const [connectionStatus, setConnectionStatus] = useState({ status: 'pending', message: 'Waiting...' });
  const [userStatus, setUserStatus] = useState({ status: 'pending', data: [] });
  const [authStatus, setAuthStatus] = useState({ status: 'pending', results: [] });
  const [logs, setLogs] = useState([]);

  // Helper to add logs
  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  useEffect(() => {
    runAllChecks();
  }, []);

  const runAllChecks = async () => {
    setLoading(true);
    setLogs([]);
    addLog('Starting diagnostic sequence...');
    
    try {
      // 1. Check Connection
      addLog('Checking Supabase connection...');
      const connResult = await checkConnection();
      setConnectionStatus(connResult);
      
      // 2. Verify Users in DB
      addLog('Verifying public user records...');
      const userResult = await verifyUsers();
      setUserStatus(userResult);

      // 3. Test Authentication
      addLog('Testing authentication flows (this might take a moment)...');
      const authResult = await testAuthentication();
      setAuthStatus(authResult);

      addLog('Diagnostics complete.');
    } catch (error) {
      addLog(`Critical Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
      if (error) throw error;
      return { status: 'success', message: 'Connected to Supabase successfully' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  };

  const verifyUsers = async () => {
    const targetEmails = ['master@example.com', 'anthony.aacdm@gmail.com'];
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .in('email', targetEmails);
        
      if (error) throw error;

      return { status: 'success', data: users };
    } catch (error) {
      return { status: 'error', data: [], message: error.message };
    }
  };

  const testAuthentication = async () => {
    const results = [];
    const credentials = [
      { email: 'master@example.com', pass: 'Master@123456', role: 'master' },
      { email: 'Anthony.aacdm@gmail.com', pass: '070117Ar!', role: 'admin' }
    ];

    // Ensure we start clean
    await supabase.auth.signOut();

    for (const cred of credentials) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cred.email,
          password: cred.pass
        });

        if (error) {
          results.push({ email: cred.email, success: false, error: error.message });
        } else {
          results.push({ email: cred.email, success: true, role: cred.role });
          // Sign out immediately to prepare for next test
          await supabase.auth.signOut();
        }
      } catch (err) {
        results.push({ email: cred.email, success: false, error: err.message });
      }
    }
    
    return { status: 'complete', results };
  };

  const runRepair = async () => {
    setRepairing(true);
    addLog('🚀 Initiating Auto-Repair Sequence...');
    
    try {
      const { data, error } = await supabase.functions.invoke('init-users');
      
      if (error) throw error;

      if (data.logs) {
        data.logs.forEach(log => addLog(`REMOTE: ${log}`));
      }

      addLog('✅ Repair sequence finished. Re-running diagnostics...');
      await runAllChecks();
      
    } catch (error) {
      addLog(`❌ Repair Failed: ${error.message}`);
    } finally {
      setRepairing(false);
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === 'success' || status === 'complete') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'error') return <XCircle className="w-5 h-5 text-red-500" />;
    return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Diagnostic & Repair</h1>
            <p className="text-gray-500">Automated troubleshooting for Authentication and User Roles</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" onClick={runAllChecks} disabled={loading || repairing}>
               Refresh Status
             </Button>
             <Button 
              onClick={runRepair} 
              disabled={loading || repairing}
              className="bg-blue-600 hover:bg-blue-700"
             >
               {repairing ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Wrench className="w-4 h-4 mr-2"/>}
               Run Auto-Repair
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Connection Status */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Database Connection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-white border rounded-md">
                <StatusIcon status={connectionStatus.status} />
                <span className={`font-medium ${connectionStatus.status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
                  {connectionStatus.message}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 2. User Verification */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-lg">Public User Records</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userStatus.status === 'pending' ? (
                   <div className="text-gray-500 italic flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Checking records...</div>
                ) : userStatus.data.length === 0 ? (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md flex gap-2 items-center">
                    <XCircle className="w-4 h-4" /> No target users found in database.
                  </div>
                ) : (
                  userStatus.data.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-2 bg-white border rounded text-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.email}</span>
                        <span className="text-xs text-gray-500">ID: {user.id}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        user.role === 'master' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* 3. Authentication Test */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Authentication Login Test</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {authStatus.results.length === 0 && loading ? (
                    <div className="col-span-2 text-gray-500 italic p-4 text-center">Testing login credentials...</div>
                 ) : (
                   authStatus.results.map((res, idx) => (
                     <div key={idx} className={`p-4 rounded-lg border flex items-start gap-3 ${res.success ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                        {res.success ? <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                        <div>
                          <p className="font-bold text-sm text-gray-900">{res.email}</p>
                          {res.success ? (
                            <p className="text-xs text-green-700 mt-1">
                              ✅ Login Successful | Role verified: {res.role}
                            </p>
                          ) : (
                            <p className="text-xs text-red-700 mt-1">
                              ❌ Login Failed: {res.error}
                            </p>
                          )}
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </CardContent>
          </Card>

          {/* 4. Live Logs */}
          <Card className="md:col-span-2 bg-gray-900 border-gray-800 text-gray-100">
            <CardHeader className="pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <CardTitle className="text-lg text-gray-100">Live Operation Logs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="font-mono text-xs h-48 overflow-y-auto space-y-1">
                {logs.length === 0 ? (
                  <span className="text-gray-500">Ready for operations...</span>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="border-b border-gray-800 pb-0.5 last:border-0">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default DebugAutoRepair;
