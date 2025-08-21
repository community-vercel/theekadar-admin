'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { fetchAnalytics } from '../../../lib/api';
import toast from 'react-hot-toast';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';

import { FaBriefcase, FaChartBar, FaChartPie, FaMap, FaMapPin, FaObjectGroup, FaUps, FaUser, FaUserAlt, FaUserShield } from 'react-icons/fa';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    usersByRole: [],
    usersByVerification: [],
    registrationTrends: [],
    usersByCity: [],
    usersBySkill: [],
    avgExperienceByRole: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const analyticsData = await fetchAnalytics();
      console.log('Analytics API Response:', analyticsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error(`Error loading data: ${error.message || 'Unknown error'}`, { 
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #FECACA',
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Data refreshed successfully!', {
      position: 'top-right',
      duration: 3000,
      style: {
        background: '#D1FAE5',
        color: '#065F46',
        border: '1px solid #A7F3D0',
      }
    });
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Enhanced color palettes
  const colorPalettes = {
    primary: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'],
    gradient: ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE', '#00F2FE', '#43E97B', '#38F9D7'],
    verification: ['#F59E0B', '#10B981', '#EF4444'],
  };

  // Optimized chart configurations
  const baseChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { 
        position: 'top',
        labels: { 
          font: { size: 12, family: 'Inter, sans-serif', weight: '500' },
          usePointStyle: true,
          padding: 20,
        }
      },
      title: { 
        display: true, 
        font: { size: 16, family: 'Inter, sans-serif', weight: '600' },
        padding: { top: 10, bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleFont: { family: 'Inter, sans-serif', weight: '600' },
        bodyFont: { family: 'Inter, sans-serif' },
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        borderColor: 'rgba(156, 163, 175, 0.2)',
        borderWidth: 1,
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutCubic',
    },
  }), []);

  // Chart data configurations
  const chartConfigs = useMemo(() => {
    const roleChartData = {
      labels: analytics.usersByRole.map((item) => item.role || 'Unknown'),
      datasets: [{
        label: 'Users by Role',
        data: analytics.usersByRole.map((item) => item.count || 0),
        backgroundColor: colorPalettes.primary,
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 25,
        hoverBorderWidth: 4,
      }],
    };

    const verificationChartData = {
      labels: analytics.usersByVerification.map((item) => item.status || 'Unknown'),
      datasets: [{
        label: 'Verification Status',
        data: analytics.usersByVerification.map((item) => item.count || 0),
        backgroundColor: colorPalettes.verification,
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 25,
        cutout: '60%',
      }],
    };

    const registrationChartData = {
      labels: analytics.registrationTrends.map((item) => item.date || ''),
      datasets: [{
        label: 'Daily Registrations',
        data: analytics.registrationTrends.map((item) => item.count || 0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        borderWidth: 3,
      }],
    };

    const cityChartData = {
      labels: analytics.usersByCity.map((item) => item.city || 'Unknown'),
      datasets: [{
        label: 'Users by City',
        data: analytics.usersByCity.map((item) => item.count || 0),
        backgroundColor: colorPalettes.gradient,
        borderColor: colorPalettes.gradient,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      }],
    };

    return { roleChartData, verificationChartData, registrationChartData, cityChartData };
  }, [analytics]);

  // Stats cards data
  const statsCards = useMemo(() => [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: FaUser,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Roles',
      value: analytics.usersByRole.length,
      icon: FaObjectGroup,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Cities',
      value: analytics.usersByCity.length,
      icon: FaMap,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Skills',
      value: analytics.usersBySkill.length,
      icon: FaChartPie,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ], [analytics]);

  const LoadingSpinner = () => (
    <motion.div
      className="flex flex-col items-center justify-center h-64 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading analytics...</p>
    </motion.div>
  );

  const StatCard = ({ stat, index }) => (
    <motion.div
      className={`${stat.bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div className={`p-3 rounded-xl ${stat.iconColor} bg-white/80`}>
          <stat.icon className="w-8 h-8" />
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, children, icon: Icon, fullWidth = false }) => (
    <motion.div
      className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${fullWidth ? 'lg:col-span-3' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gray-100 rounded-lg mr-3">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </motion.div>
  );


  





  
  return (
    <AdminLayout>
      <div className="min-h-screen px-12 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">Comprehensive insights into user data and trends</p>
            </div>
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {refreshing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Refreshing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaUps className="w-5 h-5" />
                  <span>Refresh Data</span>
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <StatCard key={stat.title} stat={stat} index={index} />
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Users by Role */}
                <ChartCard title="Users by Role" icon={FaUserAlt}>
                  {analytics.usersByRole.length > 0 && analytics.usersByRole[0].role !== 'No Data' ? (
                    <div className="h-80">
                      <Pie
                        data={chartConfigs.roleChartData}
                        options={{
                          ...baseChartOptions,
                          plugins: { 
                            ...baseChartOptions.plugins, 
                            title: { display: false }
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-gray-500">No role data available</p>
                    </div>
                  )}
                </ChartCard>

                {/* Verification Status */}
                <ChartCard title="Verification Status" icon={FaUserShield}>
                  {analytics.usersByVerification.length > 0 && analytics.usersByVerification[0].status !== 'No Data' ? (
                    <div className="h-80">
                      <Doughnut
                        data={chartConfigs.verificationChartData}
                        options={{
                          ...baseChartOptions,
                          plugins: { 
                            ...baseChartOptions.plugins, 
                            title: { display: false }
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-gray-500">No verification data available</p>
                    </div>
                  )}
                </ChartCard>

                {/* Quick Stats */}
                <ChartCard title="Quick Insights" icon={FaChartBar}>
                  <div className="h-80 flex flex-col justify-center space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {analytics.registrationTrends.reduce((sum, item) => sum + (item.count || 0), 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Registrations (30 days)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {Math.round(analytics.registrationTrends.reduce((sum, item) => sum + (item.count || 0), 0) / 30 * 100) / 100}
                      </div>
                      <div className="text-sm text-gray-600">Average Daily Registrations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {analytics.avgExperienceByRole.reduce((sum, item) => sum + (parseFloat(item.avgExperience) || 0), 0).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Total Experience Years</div>
                    </div>
                  </div>
                </ChartCard>

                {/* Registration Trends */}
                <ChartCard title="Registration Trends (Last 30 Days)" icon={FaUps} fullWidth={true}>
                  {analytics.registrationTrends.length > 0 && analytics.registrationTrends.some((item) => item.count > 0) ? (
                    <div className="h-96">
                      <Line
                        data={chartConfigs.registrationChartData}
                        options={{
                          ...baseChartOptions,
                          plugins: { 
                            ...baseChartOptions.plugins, 
                            title: { display: false }
                          },
                          scales: {
                            x: { 
                              grid: { display: false },
                              ticks: { 
                                font: { family: 'Inter, sans-serif' },
                                maxRotation: 45
                              }
                            },
                            y: {
                              grid: { color: 'rgba(0, 0, 0, 0.05)' },
                              ticks: { 
                                font: { family: 'Inter, sans-serif' }, 
                                beginAtZero: true 
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center">
                      <p className="text-gray-500">No registration data available</p>
                    </div>
                  )}
                </ChartCard>

                {/* Users by City */}
                <ChartCard title="Users by City (Top 10)" icon={FaMapPin} fullWidth={true}>
                  {analytics.usersByCity.length > 0 && analytics.usersByCity[0].city !== 'No Data' ? (
                    <div className="h-96">
                      <Bar
                        data={chartConfigs.cityChartData}
                        options={{
                          ...baseChartOptions,
                          plugins: { 
                            ...baseChartOptions.plugins, 
                            title: { display: false }
                          },
                          scales: {
                            x: { 
                              grid: { display: false },
                              ticks: { 
                                font: { family: 'Inter, sans-serif' },
                                maxRotation: 45
                              }
                            },
                            y: {
                              grid: { color: 'rgba(0, 0, 0, 0.05)' },
                              ticks: { 
                                font: { family: 'Inter, sans-serif' }, 
                                beginAtZero: true 
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center">
                      <p className="text-gray-500">No city data available</p>
                    </div>
                  )}
                </ChartCard>

                {/* Top Skills Table */}
                <ChartCard title="Top 10 Skills" icon={FaChartPie} fullWidth={true}>
                  {analytics.usersBySkill.length > 0 && analytics.usersBySkill[0].skill !== 'No Data' ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Skill</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User Count</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analytics.usersBySkill.map((item, index) => (
                            <motion.tr 
                              key={index}
                              className="hover:bg-gray-50 transition-colors duration-150"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.skill}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">{item.count}</td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {((item.count / analytics.totalUsers) * 100).toFixed(1)}%
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500">No skill data available</p>
                    </div>
                  )}
                </ChartCard>

                {/* Average Experience by Role */}
                <ChartCard title="Average Experience by Role" icon={FaBriefcase} fullWidth={true}>
                  {analytics.avgExperienceByRole.length > 0 && analytics.avgExperienceByRole[0].role !== 'No Data' ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Avg Experience</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User Count</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Experience Level</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analytics.avgExperienceByRole.map((item, index) => {
                            const experience = parseFloat(item.avgExperience) || 0;
                            let experienceLevel = 'Entry';
                            let levelColor = 'text-green-600 bg-green-100';
                            
                            if (experience >= 5) {
                              experienceLevel = 'Senior';
                              levelColor = 'text-purple-600 bg-purple-100';
                            } else if (experience >= 2) {
                              experienceLevel = 'Mid-level';
                              levelColor = 'text-blue-600 bg-blue-100';
                            }

                            return (
                              <motion.tr 
                                key={index}
                                className="hover:bg-gray-50 transition-colors duration-150"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                              >
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.role}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{experience.toFixed(1)} years</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.count}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${levelColor}`}>
                                    {experienceLevel}
                                  </span>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500">No experience data available</p>
                    </div>
                  )}
                </ChartCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}