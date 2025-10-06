import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { ChevronLeft, Heart, Activity, Wind, Droplet, Thermometer, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

const HealthDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  
  // Sample health metrics data
  const healthMetrics = [
    {
      title: 'HRV',
      value: 68,
      unit: 'ms',
      trend: 'up' as const,
      trendValue: '+5',
      chartData: [58, 60, 62, 59, 63, 65, 68],
      color: '#00CCFF',
      icon: <Heart size={20} />,
      insightText: 'Your HRV has been steadily increasing over the past week, indicating improved recovery and reduced stress.'
    },
    {
      title: 'RHR',
      value: 52,
      unit: 'bpm',
      trend: 'down' as const,
      trendValue: '-2',
      chartData: [54, 55, 53, 54, 53, 52, 52],
      color: '#20B2AA',
      icon: <Activity size={20} />,
      insightText: 'Your resting heart rate has decreased slightly, which is a positive sign for cardiovascular fitness.'
    },
    {
      title: 'Respiratory Rate',
      value: 14.2,
      unit: 'br/min',
      trend: 'stable' as const,
      chartData: [14.5, 14.3, 14.4, 14.2, 14.3, 14.1, 14.2],
      color: '#4F86C6',
      icon: <Wind size={20} />,
      insightText: 'Your respiratory rate has remained stable within the healthy range.'
    },
    {
      title: 'SpO₂',
      value: 98,
      unit: '%',
      trend: 'stable' as const,
      chartData: [97, 98, 98, 98, 98, 98, 98],
      color: '#4ADE80',
      icon: <Droplet size={20} />,
      insightText: 'Excellent oxygen saturation levels, indicating good lung function.'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-400" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-400" size={16} />;
      default:
        return <Minus className="text-gray-400" size={16} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <MainLayout>
      {showContent && (
        <div className="absolute inset-0 z-10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <motion.button
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Health Dashboard</h1>
              <p className="text-white/60 text-sm">Your biometric overview</p>
            </div>
            
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>

          {/* Health Metrics Grid */}
          <div className="flex-1 px-6 pb-6 space-y-4">
            {healthMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                {/* Metric Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      {metric.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{metric.title}</h3>
                      <p className="text-white/60 text-sm">Last 7 days</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                        {metric.trendValue}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs mt-1">vs last week</p>
                  </div>
                </div>

                {/* Current Value */}
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-bold text-white">{metric.value}</span>
                  <span className="text-white/60 text-lg">{metric.unit}</span>
                </div>

                {/* Mini Chart */}
                <div className="flex items-end space-x-1 h-8 mb-4">
                  {metric.chartData.map((value, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-t from-cyan-500 to-teal-500 rounded-sm flex-1"
                      style={{ height: `${(value / Math.max(...metric.chartData)) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / Math.max(...metric.chartData)) * 100}%` }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                    />
                  ))}
                </div>

                {/* Insight */}
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="text-cyan-400 mt-0.5" size={16} />
                    <p className="text-white/80 text-sm">{metric.insightText}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Recovery Score Card */}
            <motion.div
              className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="text-center">
                <h3 className="text-white font-semibold text-lg mb-2">Recovery Score</h3>
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#recoveryGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251 251"
                      strokeDashoffset="50"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="recoveryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00CCFF" />
                        <stop offset="100%" stopColor="#20B2AA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">78</span>
                  </div>
                </div>
                <p className="text-white/80 text-sm">Excellent recovery - you're ready for training!</p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default HealthDashboardPage;