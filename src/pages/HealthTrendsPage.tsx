import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { 
  ChevronLeft, 
  Heart, 
  Activity, 
  Wind, 
  ChevronDown,
  ChevronUp,
  Clock,
  Moon,
  Zap
} from 'lucide-react';

// Time period selector component
const TimePeriodSelector: React.FC<{
  selectedPeriod: string;
  onChange: (period: string) => void;
}> = ({ selectedPeriod, onChange }) => {
  const periods = ['7 Days', '30 Days', '90 Days', '1 Year'];
  
  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
      {periods.map((period) => (
        <button
          key={period}
          className={`px-3 py-1.5 text-sm rounded-full transition-all flex-shrink-0 ${
            selectedPeriod === period
              ? 'bg-primary-cyan-500 text-white shadow-lg shadow-cyan-primary/20'
              : 'bg-glass-background text-alpine-mist hover:bg-glass-highlight'
          }`}
          onClick={() => onChange(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

// Interactive line chart component
const LineChart: React.FC<{
  data: number[];
  labels: string[];
  color: string;
  height?: number;
  showDots?: boolean;
  animated?: boolean;
  fillGradient?: boolean;
}> = ({ 
  data, 
  labels, 
  color, 
  height = 120, 
  showDots = true, 
  animated = true,
  fillGradient = false
}) => {
  // Chart configuration
  
  // Find min and max values for scaling
  const minValue = Math.min(...data) * 0.9;
  const maxValue = Math.max(...data) * 1.1;
  const valueRange = maxValue - minValue;
  
  // Calculate points for the path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - minValue) / valueRange) * 100;
    return `${x},${y}`;
  });
  
  // Create the SVG path
  const linePath = `M ${points.join(' L ')}`;
  
  // Create the filled area path if needed
  const areaPath = fillGradient ? `${linePath} L ${(data.length - 1) / (data.length - 1) * 100},100 L 0,100 Z` : '';
  
  return (
    <div className="w-full relative overflow-hidden" style={{ height: `${height}px` }}>
      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
        {[...Array(5)].map((_, i) => (
          <div key={`v-${i}`} className="border-r border-white/5 h-full" />
        ))}
        {[...Array(3)].map((_, i) => (
          <div key={`h-${i}`} className="border-b border-white/5 w-full" />
        ))}
      </div>
      
      {/* Chart */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Gradient definition */}
        {fillGradient && (
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
        )}
        
        {/* Area fill */}
        {fillGradient && (
          <motion.path
            d={areaPath}
            fill={`url(#gradient-${color.replace('#', '')})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
        
        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0 } : { pathLength: 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        {showDots && data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - minValue) / valueRange) * 100;
          
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              stroke="#1a1a2e"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: animated ? 1.5 + Math.min(index * 0.1, 2) : 0, duration: 0.3 }}
            />
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-alpine-mist/60">
        {labels.filter((_, i) => i === 0 || i === Math.floor(labels.length / 2) || i === labels.length - 1).map((label, i) => (
          <div key={i}>{label}</div>
        ))}
      </div>
    </div>
  );
};

// Circular gauge component
const CircularGauge: React.FC<{
  value: number;
  maxValue: number;
  color: string;
  size?: number;
  label?: string;
  unit?: string;
}> = ({ value, maxValue, color, size = 120, label, unit }) => {
  // Calculate percentage
  const percentage = (value / maxValue) * 100;
  
  // Calculate circle properties
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} className="absolute">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
        />
      </svg>
      
      {/* Progress circle */}
      <svg width={size} height={size} className="absolute transform -rotate-90">
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-xl font-bold" style={{ color }}>
          {value}
          <span className="text-xs ml-1">{unit}</span>
        </div>
        {label && <div className="text-xs text-alpine-mist mt-1">{label}</div>}
      </div>
    </div>
  );
};

// Comparison card component
const ComparisonCard: React.FC<{
  title: string;
  currentValue: number;
  previousValue: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, currentValue, previousValue, unit, icon, color }) => {
  const difference = currentValue - previousValue;
  const percentChange = ((difference / previousValue) * 100).toFixed(1);
  const isPositive = difference > 0;
  const isNeutral = difference === 0;
  
  return (
    <GlassCard size="md" className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center overflow-hidden">
          <div className="p-2 rounded-full bg-glass-highlight mr-2 flex-shrink-0">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-alpine-mist truncate">{title}</h3>
        </div>
        <div className="text-lg font-bold flex-shrink-0" style={{ color }}>
          {currentValue}
          <span className="text-xs ml-1">{unit}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-glass-background bg-opacity-30 p-2 rounded-lg">
        <span className="text-xs text-alpine-mist">Previous period</span>
        <div className="flex items-center">
          <span className="text-sm text-alpine-mist mr-2">{previousValue}{unit}</span>
          <div 
            className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isNeutral
                ? 'bg-gray-500/20 text-gray-400'
                : isPositive
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
            }`}
          >
            {isNeutral ? (
              '0%'
            ) : (
              <>
                {isPositive ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {Math.abs(Number(percentChange))}%
              </>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// Expandable insight card component
const InsightCard: React.FC<{
  title: string;
  summary: string;
  details: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, summary, details, icon, color }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <GlassCard size="md" className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center overflow-hidden">
          <div className="p-2 rounded-full flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
            {React.cloneElement(icon as React.ReactElement, { style: { color } })}
          </div>
          <h3 className="text-sm font-medium text-alpine-mist ml-2 truncate">{title}</h3>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-full bg-glass-highlight hover:bg-glass-border transition-colors flex-shrink-0"
        >
          {expanded ? <ChevronUp size={16} className="text-alpine-mist" /> : <ChevronDown size={16} className="text-alpine-mist" />}
        </button>
      </div>
      
      <div className="text-xs text-alpine-mist bg-glass-background bg-opacity-30 p-3 rounded-lg overflow-hidden">
        {summary}
        
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{ 
            height: expanded ? 'auto' : 0, 
            opacity: expanded ? 1 : 0,
            marginTop: expanded ? 8 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="border-t border-white/10 pt-2">
            {details}
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
};

// Main Health Trends Page
const HealthTrendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState('7 Days');
  const [selectedMetric, setSelectedMetric] = useState('HRV');
  
  // Sample health metrics data
  const healthMetrics = {
    'HRV': {
      title: 'Heart Rate Variability',
      color: '#00CCFF',
      icon: <Heart size={16} className="text-primary-cyan-500" />,
      current: 68,
      previous: 63,
      unit: 'ms',
      data: {
        '7 Days': {
          values: [58, 60, 62, 59, 63, 65, 68],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        '30 Days': {
          values: [55, 57, 59, 58, 60, 62, 59, 61, 63, 62, 64, 63, 65, 64, 66, 65, 67, 66, 68, 67, 69, 68, 67, 69, 68, 70, 69, 68, 67, 68],
          labels: Array.from({length: 30}, (_, i) => (i + 1).toString())
        }
      },
      insights: [
        {
          title: 'Improved Recovery',
          summary: 'Your HRV has increased by 8% in the last week, indicating improved recovery capacity.',
          details: 'Higher HRV is associated with better cardiovascular fitness and autonomic nervous system balance. Your consistent sleep schedule and reduced stress levels are likely contributing to this improvement.',
          icon: <Zap size={16} />,
          color: '#00CCFF'
        },
        {
          title: 'Optimal Training Windows',
          summary: 'Based on your HRV patterns, your optimal training windows are in the morning between 7-9 AM.',
          details: 'Your HRV tends to be highest in the morning hours, suggesting this is when your body is most ready for high-intensity training. Consider scheduling your more demanding workouts during this window for optimal performance and adaptation.',
          icon: <Clock size={16} />,
          color: '#4ADE80'
        }
      ]
    },
    'RHR': {
      title: 'Resting Heart Rate',
      color: '#4ADE80',
      icon: <Activity size={16} className="text-primary-teal-500" />,
      current: 52,
      previous: 54,
      unit: 'bpm',
      data: {
        '7 Days': {
          values: [54, 55, 53, 54, 53, 52, 52],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        '30 Days': {
          values: [56, 55, 56, 55, 54, 55, 54, 53, 54, 53, 54, 53, 52, 53, 52, 53, 52, 51, 52, 51, 52, 51, 52, 53, 52, 51, 52, 51, 52, 52],
          labels: Array.from({length: 30}, (_, i) => (i + 1).toString())
        }
      },
      insights: [
        {
          title: 'Improved Cardiovascular Fitness',
          summary: 'Your resting heart rate has decreased by 3.7% over the last month.',
          details: 'A lower resting heart rate is typically associated with improved cardiovascular fitness. Your consistent endurance training is likely contributing to this positive adaptation.',
          icon: <Heart size={16} />,
          color: '#4ADE80'
        }
      ]
    },
    'Sleep': {
      title: 'Sleep Quality',
      color: '#A78BFA',
      icon: <Moon size={16} className="text-purple-400" />,
      current: 85,
      previous: 78,
      unit: '%',
      data: {
        '7 Days': {
          values: [75, 78, 80, 82, 79, 83, 85],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        '30 Days': {
          values: Array.from({length: 30}, () => 70 + Math.floor(Math.random() * 20)),
          labels: Array.from({length: 30}, (_, i) => (i + 1).toString())
        }
      },
      insights: [
        {
          title: 'Improved Deep Sleep',
          summary: 'Your deep sleep has increased by 12% since implementing the new evening routine.',
          details: 'The increase in deep sleep is contributing to better recovery and cognitive function. Your consistent sleep schedule and reduced screen time before bed appear to be having a positive impact.',
          icon: <Moon size={16} />,
          color: '#A78BFA'
        }
      ]
    },
    'Respiratory': {
      title: 'Respiratory Rate',
      color: '#60A5FA',
      icon: <Wind size={16} className="text-blue-400" />,
      current: 14.2,
      previous: 14.5,
      unit: 'br/min',
      data: {
        '7 Days': {
          values: [14.5, 14.3, 14.4, 14.2, 14.3, 14.1, 14.2],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        '30 Days': {
          values: Array.from({length: 30}, () => 14 + (Math.random() * 1.5 - 0.5)),
          labels: Array.from({length: 30}, (_, i) => (i + 1).toString())
        }
      },
      insights: [
        {
          title: 'Stable Breathing Patterns',
          summary: 'Your respiratory rate has remained stable, indicating consistent respiratory health.',
          details: 'A stable respiratory rate within the healthy range (12-20 breaths per minute) suggests good respiratory function and absence of respiratory stress.',
          icon: <Wind size={16} />,
          color: '#60A5FA'
        }
      ]
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const currentMetric = healthMetrics[selectedMetric as keyof typeof healthMetrics];
  
  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto px-4 pt-20 pb-24">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate('/health')}
            className="mr-4 p-2 rounded-full bg-glass-background bg-opacity-70 backdrop-blur-sm border border-white/30 shadow-lg text-white hover:bg-glass-background hover:bg-opacity-80 hover:border-white/50"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-alpine-mist bg-glass-background bg-opacity-40 px-3 py-1 rounded-lg">Health Trends</h1>
        </div>
        
        {/* Time period selector */}
        <TimePeriodSelector 
          selectedPeriod={timePeriod} 
          onChange={setTimePeriod} 
        />
        
        {/* Metric selector */}
        <motion.div 
          className="grid grid-cols-2 gap-3 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(healthMetrics).map(([key, metric]) => (
            <motion.button
              key={key}
              className={`p-3 rounded-lg transition-all overflow-hidden ${
                selectedMetric === key
                  ? 'bg-glass-highlight border border-primary-cyan-500/30 shadow-lg shadow-cyan-primary/10'
                  : 'bg-glass-background hover:bg-glass-highlight'
              }`}
              onClick={() => setSelectedMetric(key)}
              variants={itemVariants}
            >
              <div className="flex items-center mb-2 overflow-hidden">
                <div className="p-1.5 rounded-full bg-glass-background mr-2 flex-shrink-0">
                  {metric.icon}
                </div>
                <span className="text-sm font-medium text-alpine-mist truncate">{key}</span>
              </div>
              <div className="text-lg font-bold truncate" style={{ color: metric.color }}>
                {metric.current}
                <span className="text-xs ml-1">{metric.unit}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Main chart card */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <GlassCard size="full" className="mb-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-alpine-mist">{currentMetric.title}</h2>
              <div 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${currentMetric.color}20`,
                  color: currentMetric.color
                }}
              >
                {timePeriod}
              </div>
            </div>
            
            {/* Main chart */}
            <div className="bg-glass-background bg-opacity-30 p-4 rounded-lg mb-4 overflow-hidden">
              <div className="w-full overflow-hidden">
                <LineChart 
                  data={currentMetric.data[timePeriod as keyof typeof currentMetric.data].values}
                  labels={currentMetric.data[timePeriod as keyof typeof currentMetric.data].labels}
                  color={currentMetric.color}
                  height={180}
                  fillGradient={true}
                />
              </div>
            </div>
            
            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg text-center overflow-hidden">
                <div className="text-xs text-alpine-mist mb-1">Average</div>
                <div className="text-lg font-bold truncate" style={{ color: currentMetric.color }}>
                  {Math.round(currentMetric.data[timePeriod as keyof typeof currentMetric.data].values.reduce((a, b) => a + b, 0) / 
                  currentMetric.data[timePeriod as keyof typeof currentMetric.data].values.length)}
                  <span className="text-xs ml-1">{currentMetric.unit}</span>
                </div>
              </div>
              
              <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg text-center overflow-hidden">
                <div className="text-xs text-alpine-mist mb-1">Max</div>
                <div className="text-lg font-bold truncate" style={{ color: currentMetric.color }}>
                  {Math.max(...currentMetric.data[timePeriod as keyof typeof currentMetric.data].values)}
                  <span className="text-xs ml-1">{currentMetric.unit}</span>
                </div>
              </div>
              
              <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg text-center overflow-hidden">
                <div className="text-xs text-alpine-mist mb-1">Min</div>
                <div className="text-lg font-bold truncate" style={{ color: currentMetric.color }}>
                  {Math.min(...currentMetric.data[timePeriod as keyof typeof currentMetric.data].values)}
                  <span className="text-xs ml-1">{currentMetric.unit}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
        
        {/* Comparison cards */}
        <h2 className="text-lg font-medium text-alpine-mist mb-4">Period Comparison</h2>
        <motion.div 
          className="grid gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <ComparisonCard
              title={currentMetric.title}
              currentValue={currentMetric.current}
              previousValue={currentMetric.previous}
              unit={currentMetric.unit}
              icon={currentMetric.icon}
              color={currentMetric.color}
            />
          </motion.div>
        </motion.div>
        
        {/* Insights */}
        <h2 className="text-lg font-medium text-alpine-mist mb-4">Health Insights</h2>
        <motion.div 
          className="grid gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentMetric.insights.map((insight, index) => (
            <motion.div key={index} variants={itemVariants}>
              <InsightCard
                title={insight.title}
                summary={insight.summary}
                details={insight.details}
                icon={insight.icon}
                color={insight.color}
              />
            </motion.div>
          ))}
          
          {/* Overall health score */}
          <motion.div variants={itemVariants}>
            <GlassCard size="full" className="overflow-hidden">
              <h3 className="text-base font-medium text-alpine-mist mb-4">Overall Health Score</h3>
              <div className="flex items-center justify-center mb-4 overflow-hidden">
                <CircularGauge
                  value={82}
                  maxValue={100}
                  color="#4ADE80"
                  size={150}
                  label="Excellent"
                  unit="%"
                />
              </div>
              <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg text-xs text-alpine-mist overflow-hidden">
                Your overall health metrics are trending positively. Your consistent sleep schedule and training regimen are showing measurable benefits across multiple biomarkers.
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default HealthTrendsPage;
