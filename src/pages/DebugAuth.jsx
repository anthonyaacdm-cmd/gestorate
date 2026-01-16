
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Terminal, RefreshCw } from 'lucide-react';

const DebugAuth = () => {
  const [envCheck, setEnvCheck] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [publicUsers, setPublicUsers] = useState([]);
  const [fixLoading, setFixLoading] = useState(false);
  const [fixLogs, setFixLogs] = useState([]);
  const [loginTests, setLoginTests] = useState({});

  useEffect(() => {
    checkEnvironment();
    checkConnection();
    fetchPublicUsers();
  }, []);

  const checkEnvironment = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    setEnvCheck({
      url: url ? `Present (${url.substring(0, 15)}...)` : 'MISSING',
      key: key ? `Present (${key.substring(0, 10)}...)` : 'MISSING',
      status: url && key ? 'ok' : 'error'
    });
  };

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      // Simple query to verify connection
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
      if (error) throw error;
      setConnectionStatus('connected');
    } catch (err) {
      console.error('Connection failed:', err);
      setConnectionStatus('error');
    }
  };

  const fetchPublicUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPublicUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleFixUsers = async () => {
    setFixLoading(true);
    setFixLogs(['Initiating user repair sequence...']);
    
    try {
      const { data, error } = await supabase.functions.invoke('init-users');
      
      if (error) throw error;
      
      if (data.logs) {
        setFixLogs(prev => [...prev, ...data.logs]);
      }
      
      if (data.success) {
        setFixLogs(prev => [...prev, '✅ All operations completed successfully.']);
        fetchPublicUsers(); // Refresh table
      } else {
        setFixLogs(prev => [...prev, `❌ Operation failed: ${data.error}`]);
      }
    } catch (err) {
      setFixLogs(prev => [...prev, `❌ Exception: ${err.message}`]);
    } finally {
      setFixLoading(false);
    }
  };

  const testLogin = async (email, password, label) => {
    setLoginTests(prev => ({ ...prev, [label]: { status: 'testing' } }));
    
    try {
      // Sign out first to ensure clean state
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setLoginTests(prev => ({ 
          ...prev, 
          [label]: { status: 'error', message: error.message } 
        }));
      } else {
        setLoginTests(prev => ({ 
          ...prev, 
          [label]: { status: 'success', user: data.user.email, role: data.user.role } 
        }));
        // Sign out immediately after successful test
        await supabase.auth.signOut();
      }
    } catch (err) {
      setLoginTests(prev => ({ 
        ...prev, 
        [label]: { status: 'error', message: err.message } 
      }));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Auth Debugger & Repair</h1>

      {/* 1. Environment & Connection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">URL:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{envCheck.url}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Key:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{envCheck.key}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connection Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            {connectionStatus === 'checking' && <Loader2 className="animate-spin text-blue-500" />}
            {connectionStatus === 'connected' && (
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <CheckCircle /> Connected to Supabase
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 font-bold">
                <XCircle /> Connection Failed
              </div>
            )}
            <Button variant="outline" size="sm" onClick={checkConnection}>
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 2. Repair Actions */}
      <Card className="border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle>User Repair Utility</CardTitle>
          <p className="text-gray-500 text-sm">
            This will force-create or update the Master and Admin users in both Auth and Public tables.
            Passwords will be reset to defaults.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleFixUsers} 
            disabled={fixLoading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {fixLoading ? <Loader2 className="animate-spin mr-2" /> : <Terminal className="mr-2" />}
            Run Repair Sequence
          </Button>

          {fixLogs.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-md font-mono text-xs overflow-y-auto max-h-60">
              {fixLogs.map((log, i) => (
                <div key={i}>{`> ${log}`}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Login Testers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Master Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-1">
              <p>Email: <span className="font-mono">master@example.com</span></p>
              <p>Pass: <span className="font-mono">Master@123456</span></p>
            </div>
            <Button 
              onClick={() => testLogin('master@example.com', 'Master@123456', 'master')}
              variant="secondary"
              className="w-full"
            >
              Attempt Login
            </Button>
            {loginTests.master && (
              <div className={`p-3 rounded text-sm ${loginTests.master.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {loginTests.master.status === 'testing' && 'Testing...'}
                {loginTests.master.status === 'success' && '✅ Login Successful!'}
                {loginTests.master.status === 'error' && `❌ Error: ${loginTests.master.message}`}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-1">
              <p>Email: <span className="font-mono">Anthony.aacdm@gmail.com</span></p>
              <p>Pass: <span className="font-mono">070117Ar!</span></p>
            </div>
            <Button 
              onClick={() => testLogin('Anthony.aacdm@gmail.com', '070117Ar!', 'admin')}
              variant="secondary"
              className="w-full"
            >
              Attempt Login
            </Button>
            {loginTests.admin && (
              <div className={`p-3 rounded text-sm ${loginTests.admin.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {loginTests.admin.status === 'testing' && 'Testing...'}
                {loginTests.admin.status === 'success' && '✅ Login Successful!'}
                {loginTests.admin.status === 'error' && `❌ Error: ${loginTests.admin.message}`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Public Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Public Users Table</span>
            <Button variant="ghost" size="sm" onClick={fetchPublicUsers}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Email</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">ID</th>
                </tr>
              </thead>
              <tbody>
                {publicUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3 font-medium">{user.email}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'master' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-500">{user.id}</td>
                  </tr>
                ))}
                {publicUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No users found in public table</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugAuth;
