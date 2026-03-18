import React from "react";
import AdminLayout from "../components/admin/AdminLayout";
import InstagramAdminSettings from "../components/instagram/InstagramAdminSettings";

export default function AdminInstagramSettings() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Instagram Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your Instagram gallery integration</p>
        </div>
        <InstagramAdminSettings />
      </div>
    </AdminLayout>
  );
}