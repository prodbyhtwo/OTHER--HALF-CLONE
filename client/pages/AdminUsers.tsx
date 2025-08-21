import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Search, 
  Filter, 
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { useActionLoggerContext } from '@/components/ActionLoggerProvider';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'support' | 'editor' | 'admin';
  is_banned: boolean;
  is_verified: boolean;
  subscription_tier: string;
  created_at: string;
  last_active: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logClick } = useActionLoggerContext();
  
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Derive filter state directly from URL params to avoid desync
  const searchTerm = searchParams.get('search') || '';
  const roleFilter = searchParams.get('role') || '';
  const statusFilter = searchParams.get('status') || '';
  const subscriptionFilter = searchParams.get('subscription') || '';

  // Local search input state for controlled input
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Mock admin user
  const currentUser = {
    id: 'admin_1',
    email: 'admin@example.com',
    role: 'admin' as const
  };

  useEffect(() => {
    fetchUsers();
  }, [searchParams]);

  // Sync search input with URL params when they change
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => params.append(key, value));

    try {
      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'x-user-id': currentUser.id,
          'x-user-email': currentUser.email,
          'x-user-role': currentUser.role
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page
    setSearchParams(params);

    logClick('admin_search_users', {
      search_term: searchInput.trim(),
      filters: { role: roleFilter, status: statusFilter, subscription: subscriptionFilter }
    });
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

    logClick(`admin_filter_users_${type}`, { filter_type: type, filter_value: value });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    
    logClick('admin_paginate_users', { page, total_pages: pagination?.totalPages });
  };

  const handleUserAction = async (userId: string, action: 'ban' | 'unban' | 'promote', data?: any) => {
    setActionLoading(userId);
    
    try {
      const endpoint = `/api/admin/users/${userId}/${action}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-email': currentUser.email,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify(data || {})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} user`);
      }

      logClick(`admin_user_${action}`, { 
        target_user_id: userId,
        action_data: data
      });

      // Refresh the user list
      await fetchUsers();
      setShowActionMenu(null);
    } catch (err) {
      console.error(`Error ${action} user:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-purple-100 text-purple-800';
      case 'support': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (user: User) => {
    if (user.is_banned) {
      return <UserX className="w-4 h-4 text-red-600" />;
    }
    if (!user.is_verified) {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

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
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">
                  {pagination ? `${pagination.total} total users` : 'Loading...'}
                </p>
              </div>
            </div>
            <button
              onClick={fetchUsers}
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
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by email, name, or ID..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <select
                  value={roleFilter}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="support">Support</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                  <option value="unverified">Unverified</option>
                </select>

                <select
                  value={subscriptionFilter}
                  onChange={(e) => handleFilterChange('subscription', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Subscriptions</option>
                  <option value="free">Free</option>
                  <option value="plus">Plus</option>
                  <option value="pro">Pro</option>
                  <option value="premium">Premium</option>
                </select>

                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
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

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading users...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(user)}
                            <span className="text-sm text-gray-900">
                              {user.is_banned ? 'Banned' : user.is_verified ? 'Active' : 'Unverified'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {user.subscription_tier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.last_active).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                              disabled={actionLoading === user.id}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded disabled:opacity-50"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <MoreVertical className="w-4 h-4" />
                              )}
                            </button>

                            {showActionMenu === user.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                <div className="py-1">
                                  <button
                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  
                                  {user.is_banned ? (
                                    <button
                                      onClick={() => handleUserAction(user.id, 'unban', { reason: 'Admin action' })}
                                      className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <UserCheck className="w-4 h-4" />
                                      Unban User
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUserAction(user.id, 'ban', { reason: 'Admin action' })}
                                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <UserX className="w-4 h-4" />
                                      Ban User
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => navigate(`/admin/users/${user.id}/edit-role`)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Shield className="w-4 h-4" />
                                    Change Role
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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
                    ({pagination.total} total users)
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
    </div>
  );
}
