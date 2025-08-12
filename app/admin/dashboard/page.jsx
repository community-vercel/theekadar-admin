'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { fetchAnalytics } from '../../../lib/api';
import toast from 'react-hot-toast';
import { Pie, Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

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

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const analyticsData = await fetchAnalytics();
      console.log('Analytics API Response:', analyticsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error(`Error loading data: ${error.message || 'Unknown error'}`, { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12, family: 'Inter, sans-serif' } } },
      title: { display: true, font: { size: 16, family: 'Inter, sans-serif' } },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'Inter, sans-serif' },
        bodyFont: { family: 'Inter, sans-serif' },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  const roleChartData = {
    labels: analytics.usersByRole.map((item) => item.role || 'Unknown'),
    datasets: [
      {
        label: 'Users by Role',
        data: analytics.usersByRole.map((item) => item.count || 0),
        backgroundColor: ['#10B981', '#3B82F6', '#FBBF24', '#EF4444', '#8B5CF6', '#06B6D4'],
        hoverOffset: 20,
      },
    ],
  };

  const verificationChartData = {
    labels: analytics.usersByVerification.map((item) => item.status || 'Unknown'),
    datasets: [
      {
        label: 'Users by Verification Status',
        data: analytics.usersByVerification.map((item) => item.count || 0),
        backgroundColor: ['#F59E0B', '#10B981', '#EF4444'],
        hoverOffset: 20,
      },
    ],
  };

  const registrationChartData = {
    labels: analytics.registrationTrends.map((item) => item.date || ''),
    datasets: [
      {
        label: 'Registrations per Day',
        data: analytics.registrationTrends.map((item) => item.count || 0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const cityChartData = {
    labels: analytics.usersByCity.map((item) => item.city || 'Unknown'),
    datasets: [
      {
        label: 'Users by City',
        data: analytics.usersByCity.map((item) => item.count || 0),
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 1,
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
            User Analytics Dashboard
          </h1>
        </motion.div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Total Users Card */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Users</h2>
                <p className="text-5xl font-bold text-indigo-600">{analytics.totalUsers}</p>
              </motion.div>

              {/* Users by Role */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Users by Role</h2>
                {analytics.usersByRole.length > 0 && analytics.usersByRole[0].role !== 'No Data' ? (
                  <div className="h-80">
                    <Pie
                      data={roleChartData}
                      options={{
                        ...baseChartOptions,
                        plugins: { ...baseChartOptions.plugins, title: { display: true, text: 'User Roles Distribution' } },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No role data available</p>
                )}
              </motion.div>

              {/* Verification Status */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Status</h2>
                {analytics.usersByVerification.length > 0 && analytics.usersByVerification[0].status !== 'No Data' ? (
                  <div className="h-80">
                    <Pie
                      data={verificationChartData}
                      options={{
                        ...baseChartOptions,
                        plugins: { ...baseChartOptions.plugins, title: { display: true, text: 'Verification Status' } },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No verification data available</p>
                )}
              </motion.div>

              {/* Users by City */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-3"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Users by City (Top 10)</h2>
                {analytics.usersByCity.length > 0 && analytics.usersByCity[0].city !== 'No Data' ? (
                  <div className="h-96">
                    <Bar
                      data={cityChartData}
                      options={{
                        ...baseChartOptions,
                        plugins: { ...baseChartOptions.plugins, title: { display: true, text: 'Users by City' } },
                        scales: {
                          x: { grid: { display: false }, ticks: { font: { family: 'Inter, sans-serif' } } },
                          y: {
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { font: { family: 'Inter, sans-serif' }, beginAtZero: true },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No city data available</p>
                )}
              </motion.div>

              {/* Registration Trends */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-3"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration Trends (Last 30 Days)</h2>
                {analytics.registrationTrends.length > 0 && analytics.registrationTrends.some((item) => item.count > 0) ? (
                  <div className="h-96">
                    <Line
                      data={registrationChartData}
                      options={{
                        ...baseChartOptions,
                        plugins: { ...baseChartOptions.plugins, title: { display: true, text: 'Registration Trends' } },
                        scales: {
                          x: { grid: { display: false }, ticks: { font: { family: 'Inter, sans-serif' } } },
                          y: {
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { font: { family: 'Inter, sans-serif' }, beginAtZero: true },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No registration data available</p>
                )}
              </motion.div>

              {/* Users by Skill */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-3"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 10 Skills</h2>
                {analytics.usersBySkill.length > 0 && analytics.usersBySkill[0].skill !== 'No Data' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left text-gray-700">Skill</th>
                          <th className="p-3 text-left text-gray-700">User Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.usersBySkill.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{item.skill}</td>
                            <td className="p-3">{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No skill data available</p>
                )}
              </motion.div>

              {/* Average Experience by Role */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-3"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Experience by Role</h2>
                {analytics.avgExperienceByRole.length > 0 && analytics.avgExperienceByRole[0].role !== 'No Data' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left text-gray-700">Role</th>
                          <th className="p-3 text-left text-gray-700">Average Experience (Years)</th>
                          <th className="p-3 text-left text-gray-700">User Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.avgExperienceByRole.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{item.role}</td>
                            <td className="p-3">{item.avgExperience}</td>
                            <td className="p-3">{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No experience data available</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </AdminLayout>
  );
}