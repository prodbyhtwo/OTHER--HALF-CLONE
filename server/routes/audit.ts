import { Router } from 'express';
import { z } from 'zod';
import { AdminAction, AdminActionType } from '../../src/types/database';
import { supportMiddleware, AuthenticatedRequest } from '../lib/rbac';

const router = Router();

// Validation schemas
const adminActionSchema = z.object({
  action_type: z.enum([
    'user_ban', 'user_unban', 'user_approve', 'user_promote', 'user_demote',
    'subscription_change', 'content_create', 'content_update', 'content_delete',
    'bulk_approve_all', 'church_create', 'church_update', 'church_delete',
    'notification_send', 'system_maintenance'
  ] as const),
  target_id: z.string().nullable(),
  correlation_id: z.string(),
  metadata: z.record(z.any()).optional(),
  before_state: z.record(z.any()).optional(),
  after_state: z.record(z.any()).optional(),
  reason: z.string().optional(),
  bulk_count: z.number().optional(),
  filters_applied: z.record(z.any()).optional()
});

const auditQuerySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '50')),
  admin_id: z.string().optional(),
  action_type: z.string().optional(),
  target_id: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  correlation_id: z.string().optional(),
  sortBy: z.enum(['timestamp', 'action_type', 'admin_id']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

const analyticsLogSchema = z.object({
  logs: z.array(z.object({
    correlation_id: z.string(),
    session_id: z.string(),
    user_id: z.string().optional(),
    event_type: z.string(),
    timestamp: z.string(),
    level: z.enum(['debug', 'info', 'warn', 'error']),
    message: z.string(),
    data: z.record(z.any()).optional(),
    error: z.object({
      name: z.string(),
      message: z.string(),
      stack: z.string().optional()
    }).optional(),
    performance: z.object({
      duration_ms: z.number(),
      memory_usage: z.number().optional()
    }).optional(),
    context: z.object({
      url: z.string(),
      user_agent: z.string(),
      component: z.string().optional(),
      handler_name: z.string().optional(),
      ip_address: z.string().optional()
    })
  }))
});

// In-memory storage for development (use database in production)
let adminActions: AdminAction[] = [];
let analyticsLogs: any[] = [];

/**
 * POST /api/audit/actions
 * Create a new admin action audit record
 */
router.post('/actions', supportMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const body = adminActionSchema.parse(req.body);
    
    const adminAction: AdminAction = {
      id: `admin_action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      admin_id: req.user.id,
      action_type: body.action_type,
      target_id: body.target_id,
      correlation_id: body.correlation_id,
      timestamp: new Date().toISOString(),
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.headers['user-agent'] || 'unknown',
      metadata: {
        ...body.metadata,
        before_state: body.before_state,
        after_state: body.after_state,
        reason: body.reason,
        bulk_count: body.bulk_count,
        filters_applied: body.filters_applied
      }
    };

    // Store the action (in production, save to database)
    adminActions.push(adminAction);

    // Log to console for development
    console.log('[AUDIT]', adminAction);

    res.status(201).json({
      message: 'Admin action recorded successfully',
      action: adminAction
    });
  } catch (error) {
    console.error('Error recording admin action:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to record admin action' });
  }
});

/**
 * GET /api/audit/actions
 * Get admin action audit records with filtering and pagination
 */
router.get('/actions', supportMiddleware, (req, res) => {
  try {
    const query = auditQuerySchema.parse(req.query);
    let filteredActions = [...adminActions];

    // Apply filters
    if (query.admin_id) {
      filteredActions = filteredActions.filter(action => action.admin_id === query.admin_id);
    }

    if (query.action_type) {
      filteredActions = filteredActions.filter(action => action.action_type === query.action_type);
    }

    if (query.target_id) {
      filteredActions = filteredActions.filter(action => action.target_id === query.target_id);
    }

    if (query.correlation_id) {
      filteredActions = filteredActions.filter(action => action.correlation_id === query.correlation_id);
    }

    if (query.start_date) {
      const startDate = new Date(query.start_date);
      filteredActions = filteredActions.filter(action => new Date(action.timestamp) >= startDate);
    }

    if (query.end_date) {
      const endDate = new Date(query.end_date);
      filteredActions = filteredActions.filter(action => new Date(action.timestamp) <= endDate);
    }

    // Apply sorting
    if (query.sortBy) {
      filteredActions.sort((a, b) => {
        let aVal: any, bVal: any;
        
        switch (query.sortBy) {
          case 'timestamp':
            aVal = new Date(a.timestamp);
            bVal = new Date(b.timestamp);
            break;
          case 'action_type':
            aVal = a.action_type;
            bVal = b.action_type;
            break;
          case 'admin_id':
            aVal = a.admin_id;
            bVal = b.admin_id;
            break;
          default:
            return 0;
        }

        if (query.sortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
    } else {
      // Default sort by timestamp descending
      filteredActions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    // Apply pagination
    const startIndex = (query.page - 1) * query.limit;
    const endIndex = startIndex + query.limit;
    const paginatedActions = filteredActions.slice(startIndex, endIndex);

    res.json({
      actions: paginatedActions,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: filteredActions.length,
        totalPages: Math.ceil(filteredActions.length / query.limit),
        hasNext: endIndex < filteredActions.length,
        hasPrev: query.page > 1
      },
      filters: {
        admin_id: query.admin_id,
        action_type: query.action_type,
        target_id: query.target_id,
        start_date: query.start_date,
        end_date: query.end_date,
        correlation_id: query.correlation_id,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching audit actions:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to fetch audit actions' });
  }
});

/**
 * GET /api/audit/actions/:id
 * Get specific admin action by ID
 */
router.get('/actions/:id', supportMiddleware, (req, res) => {
  try {
    const actionId = req.params.id;
    const action = adminActions.find(a => a.id === actionId);

    if (!action) {
      return res.status(404).json({ error: 'Admin action not found' });
    }

    res.json({ action });
  } catch (error) {
    console.error('Error fetching admin action:', error);
    res.status(500).json({ error: 'Failed to fetch admin action' });
  }
});

/**
 * GET /api/audit/stats
 * Get audit statistics
 */
router.get('/stats', supportMiddleware, (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total_actions: adminActions.length,
      today: adminActions.filter(action => new Date(action.timestamp) >= today).length,
      this_week: adminActions.filter(action => new Date(action.timestamp) >= thisWeek).length,
      this_month: adminActions.filter(action => new Date(action.timestamp) >= thisMonth).length,
      by_action_type: adminActions.reduce((acc, action) => {
        acc[action.action_type] = (acc[action.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_admin: adminActions.reduce((acc, action) => {
        acc[action.admin_id] = (acc[action.admin_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent_actions: adminActions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching audit stats:', error);
    res.status(500).json({ error: 'Failed to fetch audit stats' });
  }
});

/**
 * POST /api/analytics/logs
 * Receive analytics logs from client-side action logger
 */
router.post('/logs', (req, res) => {
  try {
    const body = analyticsLogSchema.parse(req.body);
    
    // Store analytics logs (in production, save to analytics database)
    analyticsLogs.push(...body.logs.map(log => ({
      ...log,
      received_at: new Date().toISOString(),
      ip_address: req.ip || req.connection.remoteAddress || 'unknown'
    })));

    // Log admin actions to audit trail
    const adminActionLogs = body.logs.filter(log => log.event_type === 'admin.action');
    for (const log of adminActionLogs) {
      if (log.data?.action && log.data?.target) {
        const adminAction: AdminAction = {
          id: `auto_${log.correlation_id}`,
          admin_id: log.user_id || 'unknown',
          action_type: log.data.action as AdminActionType,
          target_id: log.data.target,
          correlation_id: log.correlation_id,
          timestamp: log.timestamp,
          ip_address: req.ip || req.connection.remoteAddress || 'unknown',
          user_agent: log.context.user_agent,
          metadata: log.data
        };

        adminActions.push(adminAction);
      }
    }

    // Log to console for development
    console.log('[ANALYTICS]', `Received ${body.logs.length} analytics logs`);
    
    // Log admin actions specifically
    if (adminActionLogs.length > 0) {
      console.log('[ANALYTICS] Admin actions:', adminActionLogs.length);
    }

    res.json({
      message: 'Analytics logs received successfully',
      processed: body.logs.length,
      admin_actions: adminActionLogs.length
    });
  } catch (error) {
    console.error('Error processing analytics logs:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid log data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to process analytics logs' });
  }
});

/**
 * GET /api/analytics/logs
 * Get analytics logs (for debugging)
 */
router.get('/logs', supportMiddleware, (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const logs = analyticsLogs
      .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())
      .slice(offset, offset + limit);

    res.json({
      logs,
      total: analyticsLogs.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching analytics logs:', error);
    res.status(500).json({ error: 'Failed to fetch analytics logs' });
  }
});

export default router;
