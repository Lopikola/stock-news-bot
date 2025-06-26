'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Zap, Brain, Target, Clock, Star, Filter, BarChart3, Activity, Sparkles, ChevronRight, Eye, Bell, Download } from 'lucide-react';

// Enhanced mock data with AI confidence scores and market impact
const mockArticles = [
  {
    id: 1,
    title: "NVIDIA's AI Dominance Accelerates: Q4 Beats by 40%",
    summary: "NVIDIA's data center revenue exploded 409% YoY, crushing estimates as enterprise AI adoption reaches inflection point. Our neural sentiment model detected unprecedented bullish momentum across 847 analyst reports.",
    signal: 'buy',
    confidence: 96,
    sentiment: 'positive',
    tickers: ['NVDA', 'AMD', 'INTC'],
    url: '#',
    timestamp: '12 minutes ago',
    aiScore: 9.4,
    marketImpact: 'high',
    volumeSpike: 340,
    priceTarget: '$850-920',
    catalysts: ['Earnings Beat', 'AI Guidance Raise', 'Data Center Growth'],
    riskFactors: ['Valuation Concerns', 'China Export Restrictions'],
    momentum: 87,
    newsCount: 23,
    socialBuzz: 94,
  },
  {
    id: 2,
    title: "Tesla's Robotaxi Delay Triggers Algorithm Sell Signal",
    summary: "Tesla shares plummet 8% in pre-market as robotaxi unveiling pushed to October. Our deep learning model identifies pattern matching 2018 production hell scenarios with 89% accuracy.",
    signal: 'sell',
    confidence: 89,
    sentiment: 'negative',
    tickers: ['TSLA', 'UBER', 'LYFT'],
    url: '#',
    timestamp: '28 minutes ago',
    aiScore: 8.9,
    marketImpact: 'high',
    volumeSpike: 267,
    priceTarget: '$195-210',
    catalysts: ['Robotaxi Delay', 'FSD Concerns', 'Competition Rising'],
    riskFactors: ['Execution Risk', 'Regulatory Hurdles'],
    momentum: -73,
    newsCount: 31,
    socialBuzz: 88,
  },
  {
    id: 3,
    title: "Apple's Services Moat Deepens: Vision Pro Ecosystem Play",
    summary: "Apple Services revenue hits $24.2B (+14% YoY) as Vision Pro app ecosystem gains traction. Our proprietary algorithm detected unusual options flow suggesting institutional accumulation.",
    signal: 'buy',
    confidence: 84,
    sentiment: 'positive',
    tickers: ['AAPL', 'MSFT', 'GOOGL'],
    url: '#',
    timestamp: '1 hour ago',
    aiScore: 8.4,
    marketImpact: 'medium',
    volumeSpike: 145,
    priceTarget: '$200-215',
    catalysts: ['Services Growth', 'Vision Pro Adoption', 'AI Integration'],
    riskFactors: ['iPhone Sales Weakness', 'China Headwinds'],
    momentum: 56,
    newsCount: 18,
    socialBuzz: 72,
  },
  {
    id: 4,
    title: 'Microsoft Azure Steals Market Share: OpenAI Partnership Pays Off',
    summary: 'Azure revenue acceleration to 31% growth signals enterprise AI migration in full swing. GPT-4 integration driving unprecedented enterprise customer acquisition rates.',
    signal: 'buy',
    confidence: 91,
    sentiment: 'positive',
    tickers: ['MSFT', 'GOOGL', 'AMZN'],
    url: '#',
    timestamp: '2 hours ago',
    aiScore: 9.1,
    marketImpact: 'high',
    volumeSpike: 198,
    priceTarget: '$450-480',
    catalysts: ['Azure Growth', 'AI Leadership', 'Enterprise Adoption'],
    riskFactors: ['Competition', 'Margin Pressure'],
    momentum: 78,
    newsCount: 19,
    socialBuzz: 81,
  },
  {
    id: 5,
    title: "META's Reality Labs Bleeding Slows: Metaverse Pivot Strategy",
    summary: 'Reality Labs losses narrow to $3.8B as Quest 3 gains traction. Our sentiment analysis of 15K+ social posts shows shifting perception on metaverse viability.',
    signal: 'hold',
    confidence: 72,
    sentiment: 'neutral',
    tickers: ['META', 'AAPL', 'SNAP'],
    url: '#',
    timestamp: '3 hours ago',
    aiScore: 7.2,
    marketImpact: 'medium',
    volumeSpike: 123,
    priceTarget: '$480-520',
    catalysts: ['VR Adoption', 'Cost Reduction', 'AI Integration'],
    riskFactors: ['Metaverse Skepticism', 'High R&D Costs'],
    momentum: 23,
    newsCount: 12,
    socialBuzz: 65,
  },
  {
    id: 6,
    title: "Amazon's AWS Growth Decelerates: Cloud Wars Intensify",
    summary: 'AWS growth slows to 17% as enterprise customers optimize spending. Machine learning models detect concerning pattern in customer acquisition metrics across hyperscalers.',
    signal: 'sell',
    confidence: 78,
    sentiment: 'negative',
    tickers: ['AMZN', 'MSFT', 'GOOGL'],
    url: '#',
    timestamp: '4 hours ago',
    aiScore: 7.8,
    marketImpact: 'medium',
    volumeSpike: 156,
    priceTarget: '$140-155',
    catalysts: ['AWS Slowdown', 'Competition', 'Optimization Trend'],
    riskFactors: ['Cloud Saturation', 'Margin Compression'],
    momentum: -45,
    newsCount: 15,
    socialBuzz: 58,
  },
];

const PulsingDot = ({ color = 'bg-green-400' }) => (
  <div className="relative">
    <div className={`w-2 h-2 ${color} rounded-full animate-pulse`}></div>
    <div className={`absolute inset-0 w-2 h-2 ${color} rounded-full animate-ping opacity-75`}></div>
  </div>
);

const FloatingParticle = ({ delay = 0 }) => (
  <div
    className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-bounce"
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }}
  />
);

const AnimatedNumber = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const end = value;
    const startTime = Date.now();

    const updateValue = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      ctx.strokeStyle = 'rgba(59,130,246,0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = 'rgba(59,130,246,0.3)';
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const AIConfidenceRing = ({ confidence, size = 60 }: { confidence: number; size?: number }) => {
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={confidence > 80 ? 'text-green-500' : confidence > 60 ? 'text-yellow-500' : 'text-red-500'}
          style={{ transition: 'stroke-dashoffset 2s ease-in-out', filter: 'drop-shadow(0 0 6px currentColor)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">{confidence}</span>
      </div>
    </div>
  );
};

const SignalBadge = ({ type, animated = true }: { type: 'buy' | 'sell' | 'hold'; animated?: boolean }) => {
  const config = {
    buy: {
      bg: 'bg-gradient-to-r from-green-400 to-emerald-500',
      text: 'text-white',
      label: 'STRONG BUY',
      icon: TrendingUp,
      glow: 'shadow-green-500/50',
    },
    sell: {
      bg: 'bg-gradient-to-r from-red-400 to-rose-500',
      text: 'text-white',
      label: 'STRONG SELL',
      icon: TrendingDown,
      glow: 'shadow-red-500/50',
    },
    hold: {
      bg: 'bg-gradient-to-r from-gray-400 to-slate-500',
      text: 'text-white',
      label: 'NEUTRAL',
      icon: Minus,
      glow: 'shadow-gray-500/50',
    },
  } as const;

  const { bg, text, label, icon: Icon, glow } = config[type];

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${bg} ${text} shadow-lg ${glow} ${animated ? 'animate-pulse' : ''} backdrop-blur-sm`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {label}
      <Sparkles className="w-3 h-3 ml-1.5 opacity-80" />
    </div>
  );
};

const MomentumMeter = ({ value }: { value: number }) => {
  const isPositive = value > 0;
  const intensity = Math.abs(value);

  return (
    <div className="flex items-center space-x-2">
      <Activity className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out ${isPositive ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
          style={{ width: `${intensity}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{value > 0 ? '+' : ''}{value}</span>
    </div>
  );
};

const PremiumArticleCard = ({ article, index }: { article: typeof mockArticles[number]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {isHovered && (
        <>
          <FloatingParticle delay={0} />
          <FloatingParticle delay={0.5} />
          <FloatingParticle delay={1} />
        </>
      )}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="w-6 h-6 text-blue-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">AI Neural Score</div>
              <div className="text-lg font-bold text-gray-900">
                <AnimatedNumber value={article.aiScore * 10} duration={1500} />
                <span className="text-gray-400">/100</span>
              </div>
            </div>
          </div>
          <AIConfidenceRing confidence={article.confidence} />
        </div>
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">{article.title}</h3>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${article.marketImpact === 'high' ? 'bg-red-100 text-red-800' : article.marketImpact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{article.marketImpact.toUpperCase()} IMPACT</div>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4 text-sm">{article.summary}</p>
        <div className="flex items-center justify-between mb-4">
          <SignalBadge type={article.signal as 'buy' | 'sell' | 'hold'} />
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{article.newsCount} articles</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>+{article.volumeSpike}% vol</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{article.priceTarget}</span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">Market Momentum</div>
          <MomentumMeter value={article.momentum} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-green-600 font-medium mb-1">🚀 Key Catalysts</div>
            <div className="space-y-1">
              {article.catalysts.slice(0, 2).map((catalyst) => (
                <div key={catalyst} className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded">
                  {catalyst}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-red-600 font-medium mb-1">⚠️ Risk Factors</div>
            <div className="space-y-1">
              {article.riskFactors.slice(0, 2).map((risk) => (
                <div key={risk} className="text-xs text-gray-600 bg-red-50 px-2 py-1 rounded">
                  {risk}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500">
              <span className="font-medium">Tickers:</span>
              {article.tickers.map((ticker) => (
                <span key={ticker} className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {ticker}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{article.timestamp}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <a href={article.url} className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group">
              <span>Deep Dive</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedStockDashboard = () => {
  const [tickerSearch, setTickerSearch] = useState('');
  const [activeSignals, setActiveSignals] = useState<string[]>(['buy', 'sell', 'hold']);
  const [confidenceRange, setConfidenceRange] = useState<[number, number]>([70, 100]);
  const [sortBy, setSortBy] = useState<'confidence' | 'aiScore' | 'momentum'>('confidence');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSignal = (signal: string) => {
    setActiveSignals((prev) => (prev.includes(signal) ? prev.filter((s) => s !== signal) : [...prev, signal]));
  };

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = mockArticles.filter((article) => {
      const matchesTicker =
        tickerSearch === '' || article.tickers.some((ticker) => ticker.toLowerCase().includes(tickerSearch.toLowerCase()));
      const matchesSignal = activeSignals.includes(article.signal);
      const matchesConfidence = article.confidence >= confidenceRange[0] && article.confidence <= confidenceRange[1];
      return matchesTicker && matchesSignal && matchesConfidence;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'aiScore':
          return b.aiScore - a.aiScore;
        case 'momentum':
          return Math.abs(b.momentum) - Math.abs(a.momentum);
        default:
          return 0;
      }
    });
  }, [tickerSearch, activeSignals, confidenceRange, sortBy]);

  const analytics = useMemo(() => {
    const totalArticles = mockArticles.length;
    const avgConfidence = mockArticles.reduce((sum, a) => sum + a.confidence, 0) / totalArticles;
    const avgAiScore = mockArticles.reduce((sum, a) => sum + a.aiScore, 0) / totalArticles;
    const strongBuys = mockArticles.filter((a) => a.signal === 'buy' && a.confidence > 85).length;
    return { totalArticles, avgConfidence, avgAiScore, strongBuys };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        <NeuralNetworkBackground />
        <div className="text-center z-10">
          <div className="relative mb-8">
            <Brain className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-400 rounded-full animate-ping mx-auto opacity-20" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Neural Market Intelligence</h1>
          <p className="text-blue-200 text-lg">Analyzing 50M+ data points across global markets...</p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                <AnimatedNumber value={847} />
              </div>
              <div className="text-xs text-blue-200">Sources Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                <AnimatedNumber value={94} />
              </div>
              <div className="text-xs text-blue-200">AI Accuracy %</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                <AnimatedNumber value={12} />
              </div>
              <div className="text-xs text-blue-200">Signals Generated</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <NeuralNetworkBackground />
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <PulsingDot color="bg-green-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">Neural Market Intelligence</h1>
                <p className="text-gray-600">Real-time AI-powered trading signals • Live market analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    <AnimatedNumber value={analytics.strongBuys} />
                  </div>
                  <div className="text-xs text-gray-500">Strong Buys</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedNumber value={Math.round(analytics.avgConfidence)} />
                  </div>
                  <div className="text-xs text-gray-500">Avg Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    <AnimatedNumber value={Math.round(analytics.avgAiScore * 10)} />
                  </div>
                  <div className="text-xs text-gray-500">AI Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="px-8 py-6 relative z-10 space-y-8">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickers"
              className="pl-8 pr-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm"
              value={tickerSearch}
              onChange={(e) => setTickerSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            {(['buy', 'sell', 'hold'] as const).map((sig) => (
              <label key={sig} className="inline-flex items-center text-sm space-x-1">
                <input
                  type="checkbox"
                  checked={activeSignals.includes(sig)}
                  onChange={() => toggleSignal(sig)}
                  className="rounded"
                />
                <span className="capitalize">{sig}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Confidence:</span>
            <input
              type="range"
              min={0}
              max={100}
              value={confidenceRange[0]}
              onChange={(e) => setConfidenceRange([Number(e.target.value), confidenceRange[1]])}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={confidenceRange[1]}
              onChange={(e) => setConfidenceRange([confidenceRange[0], Number(e.target.value)])}
            />
            <span className="text-sm">{confidenceRange[0]}-{confidenceRange[1]}</span>
          </div>
          <div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="py-2 px-3 rounded border border-gray-300 bg-white text-sm">
              <option value="confidence">Sort by Confidence</option>
              <option value="aiScore">Sort by AI Score</option>
              <option value="momentum">Sort by Momentum</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedArticles.map((article, idx) => (
            <PremiumArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default EnhancedStockDashboard;

