import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toaster } from 'sonner';
import { 
  Sparkles, 
  Settings,
  Clock,
  CheckCircle2,
  Database,
  Activity,
  RefreshCw
} from 'lucide-react';

import { useLotteryData } from '@/hooks/useLotteryData';
import { BasicFeatures } from '@/components/features/BasicFeatures';
import { PositionFeatures } from '@/components/features/PositionFeatures';
import { CompositeFeatures } from '@/components/features/CompositeFeatures';
import { FeatureMatrix } from '@/components/features/FeatureMatrix';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [pulse, setPulse] = useState(false);
  
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

  // 辅助：获取该位置的核心特征
  const getFeatureLabel = (idx: number) => {
    const features = ['跟随关系', '冷热模式', '振幅修正'];
    return features[idx % features.length];
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden text-[14px]">
      <style>{`
        * { font-size: 14px !important; }
        .big-number { font-size: 24px !important; }
        .huge-number { font-size: 36px !important; }
        .prediction-main-digit { font-size: 32px !important; }
      `}</style>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Toaster position="top-right" richColors />
      
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">彩票智能分析系统</span>
              <div className="flex items-center gap-1.5 -mt-1">
                <span className="font-bold text-indigo-500/80 tracking-widest uppercase">AI PRO ENGINE</span>
                <div className="w-1 h-1 rounded-full bg-indigo-500/50" />
                <span className="font-medium text-slate-600">V2.8</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/5 transition-all ${pulse ? 'border-indigo-500/50 bg-indigo-500/5' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`} />
              <span className="font-bold text-slate-400 tracking-wider">
                {isSyncing ? '同步中...' : '在线'}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6 relative">
        
        {showSettings && (
          <Card className="bg-white/5 border-white/5 backdrop-blur-md rounded-3xl overflow-hidden mb-6">
            <CardContent className="p-8 flex flex-wrap items-center gap-12">
              <div className="flex-1 min-w-[300px] space-y-4">
                <div className="flex justify-between items-end">
                  <span className="font-black text-slate-500 uppercase tracking-[0.2em]">分析窗口</span>
                  <span className="font-mono font-black text-indigo-400">{windowSize} 期</span>
                </div>
                <Slider value={[windowSize]} onValueChange={(v) => setWindowSize(v[0])} min={10} max={200} step={10} />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={generateSampleData} className="border-white/10 hover:bg-white/5 rounded-2xl h-12 font-bold">生成模拟数据</Button>
                <Button variant="destructive" onClick={clearData} className="bg-red-500/10 text-red-500 border-red-500/20 rounded-2xl h-12 font-bold">清空本地缓存</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-12 lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-b from-white/5 to-transparent border-white/5 p-8 rounded-[2rem]">
              <p className="font-black text-slate-500 uppercase tracking-[0.3em] mb-4">综合准确率</p>
              <p className="huge-number font-black text-white tracking-tighter leading-none">{stats.overallAccuracy}<span className="font-medium text-slate-600 ml-1">%</span></p>
              <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">连中</span>
                  <span className="big-number font-black text-indigo-400">{stats.currentStreak}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">验证</span>
                  <span className="big-number font-black text-slate-300">{validations.length}</span>
                </div>
              </div>
            </Card>

            <Button onClick={syncRemoteData} disabled={isSyncing} className="w-full bg-indigo-600 hover:bg-indigo-500 h-14 rounded-2xl font-black tracking-[0.2em] shadow-xl shadow-indigo-600/20">
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin mr-3" /> : <Activity className="w-4 h-4 mr-3" />}
              {isSyncing ? '同步中...' : '刷新数据'}
            </Button>
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-6">
            <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="px-8 pt-6 pb-2 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-black text-indigo-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> 下期智能预测建议
                  </CardTitle>
                  {currentPrediction && (
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 font-mono font-bold">
                      期号: {currentPrediction.period.slice(-6)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-8 px-10">
                {currentPrediction ? (
                  <div className="grid grid-cols-3 gap-12">
                    {['百位', '十位', '个位'].map((label, idx) => {
                      const data = idx === 0 ? currentPrediction.hundred : idx === 1 ? currentPrediction.ten : currentPrediction.one;
                      return (
                        <div key={label} className="flex flex-col items-center">
                          <p className="font-black text-slate-400 mb-6">{label}</p>
                          <div className="space-y-4 flex flex-col items-center">
                            {data.slice(0, 3).map((item, i) => (
                              <div key={i} className={`flex items-center justify-center ${i === 0 ? 'prediction-main-digit text-white font-black' : 'big-number text-slate-500 font-bold'}`}>
                                {item.digit}
                              </div>
                            ))}
                          </div>
                          <div className="mt-8 px-3 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded-full">
                            <span className="font-bold text-indigo-400/80 tracking-widest uppercase">
                              {getFeatureLabel(idx)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                    <Clock className="w-6 h-6 text-slate-700 mb-2" />
                    <p className="text-slate-600 font-black uppercase tracking-widest">等待数据同步...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0f] border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="px-8 py-4 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> 实时命中验证流水 (近10期)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-600 font-black uppercase tracking-wider bg-black/40 border-b border-white/5">
                        <th className="px-8 py-4">期号/时间</th>
                        <th className="px-8 py-4">实际开奖</th>
                        <th className="px-8 py-4">系统预测 (百/十/个)</th>
                        <th className="px-8 py-4">状态</th>
                        <th className="px-8 py-4">结果</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {validations.length > 0 ? (
                        [...validations].reverse().slice(0, 10).map((v) => (
                          <tr key={v.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-5">
                              <span className="font-black text-slate-300">#{v.period.slice(-4)}</span>
                            </td>
                            <td className="px-8 py-5">
                              <span className="font-black text-white tracking-widest">
                                {v.actualHundred}{v.actualTen}{v.actualOne}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex gap-4">
                                <span className="text-slate-300 font-medium">
                                  {v.prediction.hundredRanking.slice(0, 3).join('')}
                                </span>
                                <span className="text-slate-300 font-medium">
                                  {v.prediction.tenRanking.slice(0, 3).join('')}
                                </span>
                                <span className="text-slate-300 font-medium">
                                  {v.prediction.oneRanking.slice(0, 3).join('')}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex gap-2">
                                <span className={v.hundredHit ? 'text-green-500 font-bold' : 'text-slate-600 font-bold'}>{v.hundredHit ? '中' : '挂'}</span>
                                <span className={v.tenHit ? 'text-green-500 font-bold' : 'text-slate-600 font-bold'}>{v.tenHit ? '中' : '挂'}</span>
                                <span className={v.oneHit ? 'text-green-500 font-bold' : 'text-slate-600 font-bold'}>{v.oneHit ? '中' : '挂'}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              {v.hundredHit || v.tenHit || v.oneHit ? (
                                <span className="font-black text-green-500 uppercase">命中</span>
                              ) : (
                                <span className="font-black text-slate-700 uppercase">未中</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-20 text-center text-slate-700 font-black uppercase tracking-widest">暂无验证记录</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <Card className="bg-[#0a0a0f] border-white/5 h-full flex flex-col overflow-hidden rounded-[2rem]">
              <CardHeader className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-500" /> 实时采集流
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto max-h-[800px] custom-scrollbar">
                <div className="divide-y divide-white/5">
                  {[...draws].reverse().slice(0, 20).map((draw) => (
                    <div key={draw.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                      <div className="space-y-0.5">
                        <p className="font-black text-slate-400">{formatPeriod(draw.period).split(' ')[1]}</p>
                        <p className="font-bold text-slate-600 uppercase tracking-widest">#{draw.period.slice(-4)}</p>
                      </div>
                      <div className="flex gap-1.5">
                        {[draw.hundred, draw.ten, draw.one].map((n, i) => (
                          <div key={i} className="w-9 h-9 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center font-black text-blue-400">
                            {n}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="pt-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl">
                <TabsTrigger value="dashboard" className="rounded-xl px-10 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 font-black uppercase tracking-widest">分析矩阵</TabsTrigger>
                <TabsTrigger value="features" className="rounded-xl px-10 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 font-black uppercase tracking-widest">特征分布</TabsTrigger>
                <TabsTrigger value="matrix" className="rounded-xl px-10 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-500 font-black uppercase tracking-widest">走势矩阵</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-0">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CompositeFeatures draws={draws} windowSize={windowSize} />
                  <BasicFeatures draws={draws} windowSize={windowSize} />
               </div>
            </TabsContent>
            <TabsContent value="features" className="mt-0">
               <PositionFeatures draws={draws} windowSize={windowSize} />
            </TabsContent>
            <TabsContent value="matrix" className="mt-0">
              <FeatureMatrix draws={draws} windowSize={windowSize} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="mt-24 py-12 border-t border-white/5 text-center">
        <p className="font-black text-slate-600 uppercase tracking-[0.5em]">AI PREDICTION ENGINE v2.8 STABLE</p>
      </footer>
    </div>
  );
}

export default App;
