import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import { 
  Sparkles, 
  Settings,
  CheckCircle2,
  Database,
  Activity,
  RefreshCw,
  ShieldCheck,
  BarChart3,
  Target,
  Info,
  TrendingUp,
  Terminal,
  Globe
} from 'lucide-react';

import { useLotteryData } from '@/hooks/useLotteryData';
import { ProxyManager } from '@/components/proxy/ProxyManager';

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

  const getFeatureReason = (idx: number) => {
    const reasons = [
      '马尔可夫链转移概率最优节点',
      '多期遗漏值动态回补概率峰值',
      '历史周期性回归规律稳定识别',
      '多维跟随关系加权关联Top1',
      '冷热号分布动态平衡算法修正'
    ];
    return reasons[idx % reasons.length];
  };

  return (
    <div className="min-h-screen bg-[#6366f1] bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#7c3aed] text-slate-900 font-sans selection:bg-indigo-500/30 overflow-x-hidden p-4 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');
        * { font-family: 'Inter', sans-serif !important; -webkit-font-smoothing: antialiased; }
        .mono { font-family: 'JetBrains Mono', monospace !important; }
        .gradient-text { background: linear-gradient(135deg, #1e293b 0%, #4f46e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .neo-card { background: rgba(255, 255, 255, 0.98); border-radius: 32px; box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.15); border: 1px solid rgba(255, 255, 255, 0.4); backdrop-filter: blur(16px); }
        .dark-panel { background: #0f172a; border-radius: 20px; color: white; padding: 20px 28px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }
        .prediction-digit-all { color: #ff3333; font-size: 38px; font-weight: 900; text-shadow: 0 0 20px rgba(255, 51, 51, 0.4); transition: transform 0.2s; }
        .prediction-digit-all:hover { transform: scale(1.1); }
        .row-layered { border: 1px solid transparent; border-radius: 12px; transition: all 0.2s ease; }
        .row-layered:hover { transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: #e2e8f0; background: white !important; }
        .row-even { background: #f8fafc; }
        .row-odd { background: white; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 10px; }
        .hit-badge { background: #10b981; color: white; padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: 900; }
        .miss-badge { background: #ef4444; color: white; padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: 900; }
        .total-status-hit { background: #10b981; color: white; padding: 4px 12px; border-radius: 8px; font-size: 14px; font-weight: 900; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
        .total-status-miss { background: #ef4444; color: white; padding: 4px 12px; border-radius: 8px; font-size: 14px; font-weight: 900; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
        .label-large { font-size: 14px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>

      <Toaster position="top-right" richColors />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="neo-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter gradient-text">智能分析</h1>
              <p className="text-sm font-extrabold text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                <TrendingUp className="w-4 h-4" /> AI Core Engine v4.0
              </p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger value="dashboard" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">仪表盘</TabsTrigger>
              <TabsTrigger value="proxy" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">代理池</TabsTrigger>
              <TabsTrigger value="browser" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">AI 浏览器</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(!showSettings)}
              className="rounded-2xl h-12 px-8 border-slate-200 text-slate-700 font-black hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <Settings className="w-4 h-4 mr-2" /> 配置中心
            </Button>
            <Button 
              onClick={syncRemoteData} 
              disabled={isSyncing}
              className="rounded-2xl h-12 px-8 bg-[#f59e0b] hover:bg-[#d97706] text-white font-black shadow-xl shadow-orange-500/30 border-none transition-all"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
              {isSyncing ? '正在计算' : '加载强化配置'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsContent value="dashboard" className="space-y-8 mt-0">
            {/* Settings Panel */}
            {showSettings && (
              <div className="neo-card p-10 animate-in fade-in slide-in-from-top-6 duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-indigo-50 rounded-lg"><BarChart3 className="w-6 h-6 text-indigo-600" /></div>
                  <h2 className="text-xl font-black text-slate-800">分析引擎深度参数</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="font-extrabold text-slate-500 uppercase text-xs tracking-widest">历史数据采样窗口</span>
                      <span className="font-black text-indigo-600 mono text-2xl">{windowSize} <span className="text-sm">期</span></span>
                    </div>
                    <Slider value={[windowSize]} onValueChange={(v) => setWindowSize(v[0])} min={10} max={200} step={10} className="py-4" />
                  </div>
                  <div className="flex items-end gap-6">
                    <Button variant="outline" onClick={generateSampleData} className="flex-1 rounded-2xl font-black h-12 border-2">生成模拟数据</Button>
                    <Button variant="destructive" onClick={clearData} className="flex-1 rounded-2xl font-black h-12 bg-red-500 shadow-lg shadow-red-500/20">重置默认权重</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Prediction Display */}
            {currentPrediction && (
              <div className="neo-card p-8 md:p-10 animate-in zoom-in duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-red-50 rounded-lg"><Target className="w-6 h-6 text-red-600" /></div>
                  <h2 className="text-xl font-black text-slate-800">最新预测结果</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {['百位', '十位', '个位'].map((pos, i) => {
                    const data = i === 0 ? currentPrediction.hundred : i === 1 ? currentPrediction.ten : currentPrediction.one;
                    return (
                      <div key={pos} className="dark-panel flex-col items-start gap-4">
                        <div className="flex justify-between w-full items-center">
                          <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{pos}推荐</span>
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md font-bold">TOP 3</span>
                        </div>
                        <div className="flex items-end gap-6 w-full justify-center py-2">
                          {data.slice(0, 3).map((d, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <span className="prediction-digit-all mono">{d.digit}</span>
                              <span className="text-[10px] text-slate-500 font-bold mt-1">{d.probability}%</span>
                            </div>
                          ))}
                        </div>
                        <div className="w-full pt-3 border-t border-white/5">
                          <p className="text-[10px] text-slate-400 font-bold flex items-center gap-2">
                            <Info className="w-3 h-3 text-indigo-500" />
                            {getFeatureReason(i)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-8">
                <div className="neo-card p-6 h-[800px] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-black text-slate-800">实时采集流</h2>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-black animate-pulse">LIVE</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {draws.slice().reverse().slice(0, 50).map((draw, idx) => (
                      <div key={draw.id} className={`row-layered p-3 flex items-center justify-between ${idx % 2 === 0 ? 'row-even' : 'row-odd'}`}>
                        <span className="mono text-[11px] font-bold text-slate-400">{formatPeriod(draw.period)}</span>
                        <div className="flex gap-1.5">
                          {[draw.hundred, draw.ten, draw.one].map((n, i) => (
                            <span key={i} className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <div className="neo-card p-6 h-[800px] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-black text-slate-800">实时命中验证流水</h2>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">HIT RATE: {stats.overallAccuracy}%</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {validations.slice().reverse().slice(0, 50).map((v, idx) => {
                      const isAnyHit = v.hundredHit || v.tenHit || v.oneHit;
                      return (
                        <div key={v.id} className={`row-layered p-3 flex flex-col gap-2 ${idx % 2 === 0 ? 'row-even' : 'row-odd'}`}>
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <div className="flex items-center gap-4">
                              <span className="mono text-[11px] font-bold text-slate-400">{formatPeriod(v.period)}</span>
                              <span className="label-large text-indigo-500">验证通过</span>
                            </div>
                            <div className={isAnyHit ? "total-status-hit" : "total-status-miss"}>
                              {isAnyHit ? "中" : "挂"}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 items-center">
                            <div className="flex flex-col items-center">
                              <span className="label-large mb-1.5">实际开奖</span>
                              <div className="flex gap-1">
                                {[v.actualHundred, v.actualTen, v.actualOne].map((n, i) => (
                                  <span key={i} className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs">
                                    {n}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {['百位', '十位', '个位'].map((label, i) => {
                              const predicted = i === 0 ? v.prediction.hundredRanking : i === 1 ? v.prediction.tenRanking : v.prediction.oneRanking;
                              const actual = i === 0 ? v.actualHundred : i === 1 ? v.actualTen : v.actualOne;
                              const isHit = predicted.slice(0, 3).includes(actual);
                              return (
                                <div key={label} className="flex flex-col items-center border-l border-slate-100 pl-2">
                                  <span className="label-large mb-1.5">{label}预测</span>
                                  <div className="flex gap-1 items-center">
                                    {predicted.slice(0, 3).map((n, idx) => (
                                      <span key={idx} className={`text-sm font-black ${n === actual ? 'text-red-500 scale-125' : 'text-slate-400'}`}>
                                        {n}
                                      </span>
                                    ))}
                                    <span className={isHit ? "hit-badge ml-1" : "miss-badge ml-1"}>
                                      {isHit ? "HIT" : "MISS"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="proxy" className="mt-0">
            <ProxyManager />
          </TabsContent>

          <TabsContent value="browser" className="mt-0">
            <Card className="neo-card border-none shadow-lg p-12 text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Terminal className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800">AI 智能浏览器</h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                    基于 Electron 的桌面端 AI 浏览器现已整合。您可以通过自然语言控制浏览器自动化操作，模拟真人采集数据。
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button className="rounded-xl h-12 px-8 bg-indigo-600 font-bold shadow-lg shadow-indigo-200">
                    下载桌面版
                  </Button>
                  <Button variant="outline" className="rounded-xl h-12 px-8 font-bold">
                    查看文档
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
