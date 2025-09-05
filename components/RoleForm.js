// app/admin/components/RoleForm.js
'use client';

import { useState } from 'react';
import styles from '../app/admin/styles.module.css';

const API_BASE = '';

export default function RoleForm({ showAlert, showLoading, showResponseDetails }) {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'role-specific',
    roles: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    const role = e.target.value;
    setFormData((prev) => ({
      ...prev,
      roles: e.target.checked
        ? [...prev.roles, role]
        : prev.roles.filter((r) => r !== role),
    }));
  };

  const handleCheckboxClick = (e) => {
    if (e.target.type !== 'checkbox') {
      const checkbox = e.currentTarget.querySelector('input[type="checkbox"]');
      checkbox.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.roles.length === 0) {
      showAlert('Please select at least one role', 'error');
      return;
    }
    try {
      showLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/broadcast-by-role`, {
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
        setFormData({ title: '', body: '', type: 'role-specific', roles: [] });
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

  const roles = [
    { id: 'client', label: 'Clients' },
    { id: 'worker', label: 'Workers' },
    { id: 'thekadar', label: 'Thekadars' },
    { id: 'contractor', label: 'Contractors' },
    { id: 'consultant', label: 'Consultants' },
  ];
  return (
    <div className="bg-gray-100 rounded-2xl p-8 mb-8 border-2 border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
        👥 Broadcast by User Role
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="roleTitle" className="block mb-2 font-semibold text-gray-600">
            Notification Title
          </label>
          <input
            type="text"
            id="roleTitle"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter notification title"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/10 transition-all text-gray-900"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="roleBody" className="block mb-2 font-semibold text-gray-600">
            Notification Message
          </label>
          <textarea
            id="roleBody"
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Enter your message here"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/10 transition-all min-h-[100px] resize-y text-gray-900"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-600">Target Roles</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center gap-2 p-3 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#667eea] hover:bg-blue-50 transition-all text-gray-900"
                onClick={handleCheckboxClick}
              >
                <input
                  type="checkbox"
                  id={role.id}
                  value={role.id}
                  checked={formData.roles.includes(role.id)}
                  onChange={handleCheckboxChange}
                  className="cursor-pointer"
                />
                <label htmlFor={role.id} className="cursor-pointer">
                  {role.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="roleType" className="block mb-2 font-semibold text-gray-900">
            Notification Type
          </label>
          <select
            id="roleType"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/10 transition-all text-gray-900"
          >
            <option value="role-specific">Role Specific</option>
            <option value="announcement">Announcement</option>
            <option value="promotion">Promotion</option>
            <option value="update">Update</option>
          </select>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button
            type="submit"
            className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-xl font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg text-gray-900"
          >
            Send to Selected Roles
          </button>
        </div>
      </form>
    </div>
  );
}