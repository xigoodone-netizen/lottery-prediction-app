import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Shield, 
  Globe, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Copy,
  Terminal
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkerConfig {
  id: string;
  name: string;
  url: string;
  mode: 'vless' | 'http';
  status: 'healthy' | 'unhealthy' | 'deploying';
  createdAt: string;
}

export const ProxyManager: React.FC = () => {
  const [apiToken, setApiToken] = useState(localStorage.getItem('cf_api_token') || '');
  const [accountId, setAccountId] = useState(localStorage.getItem('cf_account_id') || '');
  const [workers, setWorkers] = useState<WorkerConfig[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployMode, setDeployMode] = useState<'vless' | 'http'>('vless');

  useEffect(() => {
    localStorage.setItem('cf_api_token', apiToken);
    localStorage.setItem('cf_account_id', accountId);
  }, [apiToken, accountId]);

  const deployWorker = async () => {
    if (!apiToken || !accountId) {
      toast.error('请先配置 API Token 和 Account ID');
      return;
    }

    setIsDeploying(true);
    toast.info('正在部署 Workers...');

    try {
      // 模拟部署逻辑，实际应调用 Cloudflare API 或后端代理
      // 由于前端直接调用 Cloudflare API 存在跨域问题，
      // 建议通过后端或 Manus 提供的环境进行操作。
      // 这里我们先展示 UI 逻辑。
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newWorker: WorkerConfig = {
        id: Math.random().toString(36).substr(2, 9),
        name: `cfspider-${Math.random().toString(36).substr(2, 5)}`,
        url: `https://cfspider-${Math.random().toString(36).substr(2, 5)}.workers.dev`,
        mode: deployMode,
        status: 'healthy',
        createdAt: new Date().toISOString()
      };

      setWorkers(prev => [...prev, newWorker]);
      toast.success('Workers 部署成功');
    } catch (error) {
      toast.error('部署失败');
    } finally {
      setIsDeploying(false);
    }
  };

  const deleteWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
    toast.success('Workers 已移除');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="neo-card border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500" /> Cloudflare 配置
            </CardTitle>
            <CardDescription>配置您的 Cloudflare API 凭据以管理 Workers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-token">API Token</Label>
              <Input 
                id="api-token" 
                type="password" 
                value={apiToken} 
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="在此输入您的 API Token"
                className="rounded-xl"
              />
              <p className="text-xs text-slate-500">需要 "Edit Cloudflare Workers" 权限</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-id">Account ID</Label>
              <Input 
                id="account-id" 
                value={accountId} 
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="在此输入您的 Account ID"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="neo-card border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" /> 快速部署
            </CardTitle>
            <CardDescription>一键创建新的代理 Workers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>部署模式</Label>
              <Select value={deployMode} onValueChange={(v: any) => setDeployMode(v)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="选择模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vless">VLESS 模式 (推荐 - 隐藏特征)</SelectItem>
                  <SelectItem value="http">HTTP 模式 (轻量 - 适合爬虫)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200"
              onClick={deployWorker}
              disabled={isDeploying}
            >
              {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              立即部署新的 Workers
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="neo-card border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" /> 已部署的代理池
            </div>
            <Badge variant="outline" className="rounded-full px-3">{workers.length} 个节点</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 font-bold">名称</th>
                  <th className="px-6 py-4 font-bold">模式</th>
                  <th className="px-6 py-4 font-bold">状态</th>
                  <th className="px-6 py-4 font-bold">URL</th>
                  <th className="px-6 py-4 font-bold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 opacity-20" />
                        <p>暂无部署的代理节点</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  workers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{worker.name}</td>
                      <td className="px-6 py-4">
                        <Badge variant={worker.mode === 'vless' ? 'default' : 'secondary'} className="rounded-md">
                          {worker.mode.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-green-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> 健康
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded truncate">{worker.url}</code>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => {
                            navigator.clipboard.writeText(worker.url);
                            toast.success('URL 已复制');
                          }}>
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-indigo-600" asChild>
                          <a href={worker.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-slate-400 hover:text-red-600"
                          onClick={() => deleteWorker(worker.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-indigo-50 border-indigo-100 text-indigo-800 rounded-2xl">
        <Shield className="w-4 h-4" />
        <AlertTitle className="font-bold">安全提示</AlertTitle>
        <AlertDescription className="text-xs opacity-80">
          建议使用 Cloudflare 专用小号部署代理 Workers，以降低主账号受影响的风险。
          您的 API Token 将仅保存在本地浏览器缓存中。
        </AlertDescription>
      </Alert>
    </div>
  );
};
