
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  RefreshCw, 
  Map as MapIcon, 
  TrendingUp, 
  Droplets, 
  Wind, 
  Sun, 
  Thermometer, 
  Menu, 
  X,
  Navigation,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { WeatherStation, MeasurementType } from './types';
import { fetchWeatherStations } from './services/weatherService';

const COLORS = {
  nmsuCrimson: '#890022',
  nmsuCrimsonLight: '#a61c38',
  bgGray: '#f8fafc',
};

const App: React.FC = () => {
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<WeatherStation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [measurementType, setMeasurementType] = useState<MeasurementType>(MeasurementType.TEMPERATURE);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchWeatherStations();
    setStations(data);
    if (data.length > 0 && !selectedStation) {
      setSelectedStation(data[0]);
    }
    setLoading(false);
  }, [selectedStation]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Station List */}
      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-200 z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 bg-white sticky top-0 z-10">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Find a station..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-rose-600 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Station List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-800"></div>
                <p className="text-xs text-slate-400">Syncing with network...</p>
              </div>
            ) : (
              filteredStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => {
                    setSelectedStation(station);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-xl transition-all group
                    ${selectedStation?.id === station.id 
                      ? 'bg-rose-50 text-rose-900 border-l-4 border-rose-800' 
                      : 'hover:bg-slate-50 text-slate-600'}
                  `}
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-sm leading-tight truncate w-44">{station.name}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{station.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">{Math.round(station.currentTemp)}°</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${selectedStation?.id === station.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Mexico State University</p>
            <p className="text-[10px] text-slate-300">Climate Center • ZiaMet Network</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#890022] flex items-center justify-between px-4 lg:px-8 text-white shadow-lg z-30 shrink-0">
          <div className="flex items-center space-x-3">
            <button 
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-white text-[#890022] font-black p-1 px-2 rounded-md text-sm">NM</div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight">ZiaMet</span>
                <span className="text-[10px] opacity-70 font-semibold tracking-widest uppercase">NMSU Weather Network</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="hidden md:flex items-center bg-white/10 rounded-lg px-3 py-1.5 space-x-2 text-xs font-medium">
              <TrendingUp className="h-3 w-3 opacity-70" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-white text-[#890022] hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 bg-slate-50">
          {selectedStation && (
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Hero Dashboard Section */}
              <section className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl min-h-[400px] flex flex-col md:flex-row border border-white/5">
                {/* Visual Background - Hand-drawn style reference */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={`https://picsum.photos/seed/${selectedStation.id}/1200/800`} 
                    className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110" 
                    alt="Campus View" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent hidden md:block" />
                </div>

                {/* Left Side: Station Info */}
                <div className="relative z-10 flex-1 p-8 lg:p-12 flex flex-col justify-end">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 backdrop-blur-md border border-emerald-500/30 self-start">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Live Feed • Updated {selectedStation.lastUpdated}</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black text-white leading-none mb-2 tracking-tight">
                    {selectedStation.name}
                  </h1>
                  <div className="flex items-center text-slate-300 space-x-2 font-medium">
                    <Navigation className="h-4 w-4" />
                    <span>{selectedStation.location}</span>
                  </div>
                </div>

                {/* Right Side: Main Stats Glassmorphism Card */}
                <div className="relative z-10 p-4 md:p-8 lg:p-12 flex items-center">
                  <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="text-center lg:text-left">
                      <div className="text-6xl lg:text-8xl font-black tracking-tighter mb-1">
                        {selectedStation.currentTemp.toFixed(1)}°
                      </div>
                      <div className="text-sm font-bold opacity-60 uppercase tracking-widest">Temperature</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      <div className="flex items-center space-x-3 group">
                        <Droplets className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-lg font-bold">{selectedStation.humidity.toFixed(0)}%</div>
                          <div className="text-[10px] uppercase font-bold opacity-40">Humidity</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <Wind className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-lg font-bold">{selectedStation.windSpeed.toFixed(1)} mph {selectedStation.windDirection}</div>
                          <div className="text-[10px] uppercase font-bold opacity-40">Wind</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <TrendingUp className="h-5 w-5 text-rose-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-lg font-bold">{selectedStation.highTemp.toFixed(1)}°</div>
                          <div className="text-[10px] uppercase font-bold opacity-40">Daily High</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <TrendingUp className="h-5 w-5 text-blue-300 rotate-180 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-lg font-bold">{selectedStation.lowTemp.toFixed(1)}°</div>
                          <div className="text-[10px] uppercase font-bold opacity-40">Daily Low</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attribution - as requested in mockup */}
                <div className="absolute bottom-4 right-6 text-[10px] text-white/40 font-medium">
                  ZiaMet Network / Getty Images
                </div>
              </section>

              {/* Secondary Grid: Map and Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Network Map Placeholder Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-rose-50 text-rose-800 rounded-lg">
                        <MapIcon className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-800">Network Map</h2>
                    </div>
                    <button className="text-xs font-bold text-rose-800 hover:text-rose-900 uppercase tracking-widest">
                      Recenter
                    </button>
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-2xl relative overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${selectedStation.latitude},${selectedStation.longitude}&z=13&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                    ></iframe>
                  </div>
                </div>

                {/* Trend Chart Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-rose-50 text-rose-800 rounded-lg">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-800">24h Trend</h2>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      {Object.values(MeasurementType).map((type) => (
                        <button
                          key={type}
                          onClick={() => setMeasurementType(type)}
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                            ${measurementType === type ? 'bg-rose-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}
                          `}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedStation.trends}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#890022" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#890022" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                          dx={-10}
                        />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px'}}
                          itemStyle={{fontWeight: 'bold', fontSize: '12px'}}
                        />
                        <Area 
                          type="monotone" 
                          dataKey={measurementType === MeasurementType.TEMPERATURE ? "temp" : "wind"} 
                          stroke="#890022" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Conditions Section */}
              <section className="space-y-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-slate-800">Detailed Conditions</h2>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Metric Card */}
                  {[
                    { label: 'Dew Point', value: `${selectedStation.dewPoint.toFixed(1)}°F`, sub: 'Relative measure', icon: Droplets, color: 'text-blue-500' },
                    { label: 'Peak Gust', value: `${selectedStation.peakGust.toFixed(1)} mph`, sub: 'Last hour', icon: Wind, color: 'text-amber-500' },
                    { label: 'Solar Rad', value: `${selectedStation.solarRad.toFixed(0)} W/m²`, sub: 'Global index', icon: Sun, color: 'text-yellow-500' },
                    { label: 'Soil Temp', value: `${selectedStation.soilTemp.toFixed(1)}°F`, sub: '4 inch depth', icon: Thermometer, color: 'text-rose-500' },
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded-xl bg-slate-50 ${metric.color}`}>
                          <metric.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{metric.label}</span>
                      </div>
                      <div className="text-3xl font-black text-slate-800 mb-1">{metric.value}</div>
                      <div className="text-xs font-medium text-slate-400">{metric.sub}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer */}
              <footer className="pt-12 pb-8 border-t border-slate-200">
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">
                    © {new Date().getFullYear()} New Mexico State University Board of Regents. All rights reserved.
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Data provided by the NMSU Climate Center • ZiaMet Network
                  </p>
                  <div className="flex justify-center space-x-6 pt-4">
                    <a href="#" className="text-slate-400 hover:text-[#890022] transition-colors"><ExternalLink className="h-4 w-4" /></a>
                  </div>
                </div>
              </footer>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
