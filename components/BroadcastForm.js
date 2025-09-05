// app/admin/components/BroadcastForm.js
'use client';

import { useState } from 'react';
import styles from '../app/admin/styles.module.css';

const API_BASE = '/api/admin';

export default function BroadcastForm({ showAlert, showLoading, showResponseDetails, loadStats }) {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'general',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/broadcast-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      showResponseDetails(result);
      if (result.success) {
        showAlert(`✅ ${result.message}`, 'success');
        if (result.stats) {
          showAlert(`📊 Sent to ${result.stats.successCount}/${result.stats.totalUsers} users`, 'success');
        }
        setFormData({ title: '', body: '', type: 'general' });
        loadStats();
      } else {
        showAlert(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Broadcast error:', error);
      showAlert('❌ Failed to send notification. Please try again.', 'error');
    } finally {
      showLoading(false);
    }
  };


  return (
    <div className="bg-gray-100 rounded-2xl p-8 mb-8 border-2 border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
        📢 Broadcast to All Users
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="broadcastTitle" className="block mb-2 font-semibold text-gray-600">
            Notification Title
          </label>
          <input
            type="text"
            id="broadcastTitle"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter notification title"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/10 transition-all"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="broadcastBody" className="block mb-2 font-semibold text-gray-600">
            Notification Message
          </label>
          <textarea
            id="broadcastBody"
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Enter your message here"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/10 transition-all min-h-[100px] resize-y"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="broadcastType" className="block mb-2 font-semibold text-gray-600">
            Notification Type
          </label>
          <select
            id="broadcastType"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/10 transition-all"
          >
            <option value="general">General</option>
            <option value="announcement">Announcement</option>
            <option value="promotion">Promotion</option>
            <option value="update">Update</option>
          </select>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button
            type="submit"
            className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-xl font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Send to All Users
          </button>
          <button
            type="button"
            className="bg-gradient-to-br from-[#ffecd2] to-[#fcb69f] text-gray-800 px-8 py-3 rounded-xl font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg"
            onClick={loadStats}
          >
            Refresh Stats
          </button>
        </div>
      </form>
    </div>
  );
}