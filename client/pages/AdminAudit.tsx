import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Search, 
  Filter, 
  RefreshCw,
  Calendar,
  Activity,
  User,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye
} from 'lucide-react';
import { useActionLoggerContext } from '@/components/ActionLoggerProvider';

interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_id: string | null;
  correlation_id: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  metadata: any;
}

interface AuditResponse {
  actions: AdminAction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AdminAudit() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logClick } = useActionLoggerContext();
  
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<AdminAction | null>(null);

  // Filter state
  const [adminFilter, setAdminFilter] = useState(searchParams.get('admin_id') || '');
  const [actionTypeFilter, setActionTypeFilter] = useState(searchParams.get('action_type') || '');
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');

  // Mock admin user
  const currentUser = {
    id: 'admin_1',
    email: 'admin@example.com',
    role: 'admin' as const
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [searchParams]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => params.append(key, value));

    try {
      const response = await fetch(`/api/audit/actions?${params.toString()}`, {
        headers: {
          'x-user-id': currentUser.id,
          'x-user-email': currentUser.email,
          'x-user-role': currentUser.role
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch audit logs');
      }

      const data: AuditResponse = await response.json();
      setActions(data.actions);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    params.set('page', '1'); // Reset to first page
    setSearchParams(params);

    logClick(`admin_filter_audit_${type}`, { filter_type: type, filter_value: value });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    
    logClick('admin_paginate_audit', { page, total_pages: pagination?.totalPages });
  };

  const getActionTypeColor = (actionType: string) => {
    if (actionType.includes('ban')) return 'bg-red-100 text-red-800';
    if (actionType.includes('unban') || actionType.includes('approve')) return 'bg-green-100 text-green-800';
    if (actionType.includes('promote') || actionType.includes('role')) return 'bg-blue-100 text-blue-800';
    if (actionType.includes('create') || actionType.includes('update')) return 'bg-purple-100 text-purple-800';
    if (actionType.includes('delete')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const actionTypes = [
    'user_ban',
    'user_unban', 
    'user_approve',
    'user_promote',
    'user_demote',
    'subscription_change',
    'content_create',
    'content_update',
    'content_delete',
    'bulk_approve_all',
    'church_create',
    'notification_send'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
                <p className="text-gray-600">
                  {pagination ? `${pagination.total} total actions` : 'Loading...'}
                </p>
              </div>
            </div>
            <button
              onClick={fetchAuditLogs}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Admin Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin User
                </label>
                <input
                  type="text"
                  placeholder="Admin ID or email..."
                  value={adminFilter}
                  onChange={(e) => setAdminFilter(e.target.value)}
                  onBlur={() => handleFilterChange('admin_id', adminFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Action Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <select
                  value={actionTypeFilter}
                  onChange={(e) => {
                    setActionTypeFilter(e.target.value);
                    handleFilterChange('action_type', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Actions</option>
                  {actionTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    handleFilterChange('start_date', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    handleFilterChange('end_date', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Audit Log Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading audit logs...</span>
              </div>
            </div>
          ) : actions.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No audit logs found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {actions.map((action) => (
                      <tr key={action.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(action.timestamp).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(action.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{action.admin_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(action.action_type)}`}>
                            {action.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {action.target_id || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {action.ip_address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedAction(action)}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.totalPages} 
                    ({pagination.total} total actions)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 border border-gray-300 rounded-lg bg-blue-50 text-blue-700">
                      {pagination.page}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action Details Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Action Details</h2>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Action ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedAction.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Correlation ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedAction.correlation_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Agent</label>
                  <p className="text-sm text-gray-900 break-all">{selectedAction.user_agent}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Metadata</label>
                  <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedAction.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
