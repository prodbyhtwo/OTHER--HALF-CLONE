import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  UserX, 
  UserCheck,
  TrendingUp,
  Clock,
  Calendar,
  MoreVertical,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useActionLoggerContext } from '@/components/ActionLoggerProvider';

interface AdminStats {
  users: {
    total: number;
    active: number;
    banned: number;
    unverified: number;
  };
  roles: {
    user: number;
    support: number;
    editor: number;
    admin: number;
  };
  subscriptions: {
    free: number;
    plus: number;
    pro: number;
    premium: number;
  };
}

interface AuditStats {
  total_actions: number;
  today: number;
  this_week: number;
  this_month: number;
  by_action_type: Record<string, number>;
  by_admin: Record<string, number>;
  recent_actions: any[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logClick } = useActionLoggerContext();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock admin user - in production, get from auth context
  const currentUser = {
    id: 'admin_1',
    email: 'admin@example.com',
    role: 'admin' as const
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch admin stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'x-user-id': currentUser.id,
          'x-user-email': currentUser.email,
          'x-user-role': currentUser.role
        }
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      const { stats: adminStats } = await statsResponse.json();
      setStats(adminStats);

      // Fetch audit stats
      const auditResponse = await fetch('/api/audit/stats', {
        headers: {
          'x-user-id': currentUser.id,
          'x-user-email': currentUser.email,
          'x-user-role': currentUser.role
        }
      });

      if (auditResponse.ok) {
        const { stats: auditData } = await auditResponse.json();
        setAuditStats(auditData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string, action: string) => {
    logClick(`admin_nav_${action}`, { path, section: 'admin_dashboard' });
    navigate(path);
  };

  const handleRefresh = () => {
    logClick('admin_refresh_dashboard', { timestamp: new Date().toISOString() });
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Error Loading Dashboard</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {currentUser.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.users.total || 0}</p>
                <p className="text-sm text-green-600">
                  {stats?.users.active || 0} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Banned Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Banned Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.users.banned || 0}</p>
                <p className="text-sm text-red-600">
                  Requires attention
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Unverified Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unverified</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.users.unverified || 0}</p>
                <p className="text-sm text-yellow-600">
                  Pending verification
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Admin Actions Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actions Today</p>
                <p className="text-3xl font-bold text-gray-900">{auditStats?.today || 0}</p>
                <p className="text-sm text-blue-600">
                  {auditStats?.this_week || 0} this week
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Management Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                  <button
                    onClick={() => handleNavigation('/admin/users', 'view_all_users')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleNavigation('/admin/users?status=active', 'manage_active_users')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Active Users</p>
                        <p className="text-sm text-gray-600">{stats?.users.active || 0} users</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigation('/admin/users?status=banned', 'manage_banned_users')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <UserX className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">Banned Users</p>
                        <p className="text-sm text-gray-600">{stats?.users.banned || 0} users</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigation('/admin/users?status=unverified', 'manage_unverified_users')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-gray-900">Unverified</p>
                        <p className="text-sm text-gray-600">{stats?.users.unverified || 0} users</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigation('/admin/roles', 'manage_roles')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Role Management</p>
                        <p className="text-sm text-gray-600">Admins: {stats?.roles.admin || 0}</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Admin Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Actions</h2>
                <button
                  onClick={() => handleNavigation('/admin/audit', 'view_audit_log')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              {auditStats?.recent_actions && auditStats.recent_actions.length > 0 ? (
                <div className="space-y-4">
                  {auditStats.recent_actions.slice(0, 5).map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-1 bg-blue-100 rounded">
                        <Activity className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {action.action_type?.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-600">
                          by {action.admin_id} • {new Date(action.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No recent admin actions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Health Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Overview</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Roles Distribution */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">User Roles</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Users</span>
                      <span className="text-sm font-medium">{stats?.roles.user || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Support</span>
                      <span className="text-sm font-medium">{stats?.roles.support || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Editors</span>
                      <span className="text-sm font-medium">{stats?.roles.editor || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Admins</span>
                      <span className="text-sm font-medium">{stats?.roles.admin || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Subscription Distribution */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Subscriptions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Free</span>
                      <span className="text-sm font-medium">{stats?.subscriptions.free || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Plus</span>
                      <span className="text-sm font-medium">{stats?.subscriptions.plus || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pro</span>
                      <span className="text-sm font-medium">{stats?.subscriptions.pro || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Premium</span>
                      <span className="text-sm font-medium">{stats?.subscriptions.premium || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Action Types */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Top Actions</h3>
                  <div className="space-y-2">
                    {auditStats?.by_action_type && Object.entries(auditStats.by_action_type)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 4)
                      .map(([action, count]) => (
                        <div key={action} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 capitalize">
                            {action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
