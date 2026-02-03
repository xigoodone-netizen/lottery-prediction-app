import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import { 
  Sparkles, 
  Settings,
  Clock,
  CheckCircle2,
  Database,
  Activity,
  RefreshCw,
  ChevronDown,
  Zap,
  ShieldCheck,
  BarChart3,
  Layers
} from 'lucide-react';

import { useLotteryData } from '@/hooks/useLotteryData';
import { BasicFeatures } from '@/components/features/BasicFeatures';
import { PositionFeatures } from '@/components/features/PositionFeatures';
import { CompositeFeatures } from '@/components/features/CompositeFeatures';
import { FeatureMatrix } from '@/components/features/FeatureMatrix';
// Removed unused Card imports

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [, setPulse] = useState(false);
  
  const {
    draws,
    validations,
    windowSize,
    currentPrediction,
    setWindowSize,
    clearData,
    getStatistics,
    generateSampleData,
    isSyncing,
    syncRemoteData
  } = useLotteryData();

  const stats = getStatistics();

  useEffect(() => {
    if (draws.length > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [draws.length]);

  const formatPeriod = (p: string) => {
    if (p.length === 14) {
      return `${p.slice(8, 10)}:${p.slice(10, 12)}:${p.slice(12, 14)}`;
    }
    return p;
  };

  return (
    <div className="min-h-screen bg-[#6366f1] bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-slate-900 font-sans selection:bg-indigo-500/30 overflow-x-hidden p-4 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * { 
          font-family: 'Inter', sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }

        .neo-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .stat-box {
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          transition: transform 0.2s;
        }

        .stat-box:hover {
          transform: translateY(-2px);
        }

        .blue-box { background: #3498db; }
        .red-box { background: #e74c3c; }
        .orange-box { background: #f39c12; }
        .green-box { background: #2ecc71; }

        .dark-panel {
          background: #2c3e50;
          border-radius: 12px;
          color: white;
          padding: 12px 20px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .big-number {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .small-label {
          font-size: 12px;
          opacity: 0.8;
          font-weight: 500;
        }

        .action-button {
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.2s;
        }

        .custom-tabs-list {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border-radius: 16px;
          padding: 4px;
        }

        .custom-tabs-trigger {
          border-radius: 12px;
          font-weight: 600;
          color: white;
        }

        .custom-tabs-trigger[data-state='active'] {
          background: white;
          color: #4f46e5;
        }
      `}</style>

      <Toaster position="top-right" richColors />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="neo-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">彩票智能分析系统</h1>
              <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> AI Pro Engine V3.5
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(!showSettings)}
              className="action-button border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Settings className="w-4 h-4 mr-2" /> 配置中心
            </Button>
            <Button 
              onClick={syncRemoteData} 
              disabled={isSyncing}
              className="action-button bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
              {isSyncing ? '同步中' : '加载强化配置'}
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="neo-card p-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">分析引擎参数</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-600">分析窗口大小</span>
                  <span className="font-black text-indigo-600">{windowSize} 期</span>
                </div>
                <Slider value={[windowSize]} onValueChange={(v) => setWindowSize(v[0])} min={10} max={200} step={10} />
              </div>
              <div className="flex items-end gap-4">
                <Button variant="outline" onClick={generateSampleData} className="flex-1 action-button">生成模拟数据</Button>
                <Button variant="destructive" onClick={clearData} className="flex-1 action-button bg-red-500">重置默认权重</Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Analysis Results */}
        <div className="neo-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">强化分析结果概览</h2>
            </div>
            {currentPrediction && (
              <div className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-bold border border-indigo-100">
                预测期号: {currentPrediction.period.slice(-6)}
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="stat-box blue-box shadow-lg shadow-blue-500/30">
                <span className="big-number">{draws.length}</span>
                <span className="small-label">原始组合总数</span>
              </div>
              <div className="stat-box red-box shadow-lg shadow-red-500/30">
                <span className="big-number">{stats.currentStreak}</span>
                <span className="small-label">强化缩水层级</span>
              </div>
              <div className="stat-box orange-box shadow-lg shadow-orange-500/30">
                <span className="big-number">{stats.overallAccuracy}%</span>
                <span className="small-label">当前命中率</span>
              </div>
              <div className="stat-box green-box shadow-lg shadow-green-500/30">
                <span className="big-number">强化</span>
                <span className="small-label">核心预测算法</span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 mb-8">
              <div className="mt-1">
                <ShieldCheck className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-xs leading-relaxed text-red-800 font-medium">
                <span className="font-bold">强化说明：</span>本系统专门强化了多维度模式匹配算法，每层都确保了足够的覆盖。当出现历史相似模式时，各层的中奖概率将显著提升。建议重点关注前5层的强化配置。
              </p>
            </div>

            {/* Prediction Details */}
            {currentPrediction ? (
              <div className="space-y-3">
                {['百位强化 L1', '十位强化 L2', '个位强化 L3'].map((label, idx) => {
                  const data = idx === 0 ? currentPrediction.hundred : idx === 1 ? currentPrediction.ten : currentPrediction.one;
                  return (
                    <div key={label} className="dark-panel group cursor-pointer hover:bg-[#34495e] transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold tracking-tight">{label} - 强化精选矩阵</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex gap-2">
                          {data.slice(0, 3).map((item, i) => (
                            <span key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                              {item.digit}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                          <span>命中率: {data[0].probability}%</span>
                          <span className="w-px h-3 bg-slate-600"></span>
                          <span>权重覆盖: 70%</span>
                          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-400">等待数据同步，准备强化分析...</p>
              </div>
            )}
          </div>
        </div>

        {/* Validation & Data Streams */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="neo-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-bold text-slate-800">实时命中验证流水</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="pb-4">期号</th>
                      <th className="pb-4">实际开奖</th>
                      <th className="pb-4">系统预测</th>
                      <th className="pb-4">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {validations.slice(-8).reverse().map((v) => (
                      <tr key={v.id} className="group">
                        <td className="py-4 text-sm font-bold text-slate-500">#{v.period.slice(-4)}</td>
                        <td className="py-4">
                          <div className="flex gap-1">
                            {[v.actualHundred, v.actualTen, v.actualOne].map((n, i) => (
                              <span key={i} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">{n}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 text-xs font-medium text-slate-500">
                          {v.prediction.hundredRanking.slice(0, 3).join('')} | {v.prediction.tenRanking.slice(0, 3).join('')} | {v.prediction.oneRanking.slice(0, 3).join('')}
                        </td>
                        <td className="py-4">
                          {v.hundredHit || v.tenHit || v.oneHit ? (
                            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">已命中</span>
                          ) : (
                            <span className="text-xs font-bold text-slate-300">未中</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="neo-card p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <Database className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-800">实时采集流</h2>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {draws.slice(-15).reverse().map((draw) => (
                <div key={draw.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">#{draw.period.slice(-4)}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{formatPeriod(draw.period).split(' ')[1]}</p>
                  </div>
                  <div className="flex gap-1">
                    {[draw.hundred, draw.ten, draw.one].map((n, i) => (
                      <span key={i} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm">{n}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Tabs */}
        <div className="pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="custom-tabs-list">
                <TabsTrigger value="dashboard" className="custom-tabs-trigger px-8">分析矩阵</TabsTrigger>
                <TabsTrigger value="features" className="custom-tabs-trigger px-8">特征分布</TabsTrigger>
                <TabsTrigger value="matrix" className="custom-tabs-trigger px-8">走势矩阵</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-0 space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="neo-card p-6"><CompositeFeatures draws={draws} windowSize={windowSize} /></div>
                  <div className="neo-card p-6"><BasicFeatures draws={draws} windowSize={windowSize} /></div>
               </div>
            </TabsContent>
            <TabsContent value="features" className="mt-0">
               <div className="neo-card p-6"><PositionFeatures draws={draws} windowSize={windowSize} /></div>
            </TabsContent>
            <TabsContent value="matrix" className="mt-0">
              <div className="neo-card p-6"><FeatureMatrix draws={draws} windowSize={windowSize} /></div>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="py-12 text-center">
          <p className="text-xs font-bold text-white/60 uppercase tracking-[0.4em]">AI Prediction Engine v3.5 Stable • Optimized Design</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
