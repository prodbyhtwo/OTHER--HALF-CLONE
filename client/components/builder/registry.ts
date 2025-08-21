// client/components/builder/registry.ts
import { Builder } from '@builder.io/react';
import { z } from 'zod';

// Import components to register
import { UserProfileForm } from './UserProfileForm';
import { SettingsPanel } from './SettingsPanel';
import { BlockUserButton } from './BlockUserButton';
import { LocationShare } from './LocationShare';
import { FeedComponent } from './FeedComponent';
import { PrimaryButton } from './PrimaryButton';
import { LinkButton } from './LinkButton';
import { AppShell } from '../AppShell';

// Type definitions for Builder.io component inputs
export interface BuilderComponentInput {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'list' | 'text' | 'color' | 'file' | 'url';
  required?: boolean;
  defaultValue?: any;
  enum?: string[];
  helperText?: string;
  advanced?: boolean;
}

export interface BuilderComponentConfig {
  name: string;
  inputs: BuilderComponentInput[];
  image?: string;
  description?: string;
  docsLink?: string;
  defaultStyles?: Record<string, any>;
  noWrap?: boolean;
  canHaveChildren?: boolean;
  childRequirements?: {
    message: string;
    query: string;
  };
}

// Validation schemas for component props
export const userProfileFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  showFullForm: z.boolean().default(true),
  onSaveSuccess: z.string().optional(),
  redirectAfterSave: z.string().optional(),
});

export const settingsPanelSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  section: z.enum(['push', 'email', 'privacy', 'discovery', 'all']).default('all'),
  showSaveButton: z.boolean().default(true),
  autoSave: z.boolean().default(false),
  autoSaveDelay: z.number().min(100).max(5000).default(600),
});

export const blockUserButtonSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  targetId: z.string().min(1, "Target user ID is required"),
  variant: z.enum(['default', 'destructive', 'outline']).default('destructive'),
  size: z.enum(['sm', 'default', 'lg']).default('default'),
  confirmationRequired: z.boolean().default(true),
});

export const locationShareSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  autoRequest: z.boolean().default(false),
  showAccuracy: z.boolean().default(false),
  onLocationUpdate: z.string().optional(),
});

export const primaryButtonSchema = z.object({
  text: z.string().min(1, "Button text is required"),
  actionId: z.string().optional(),
  to: z.string().optional(),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).default('default'),
  size: z.enum(['sm', 'default', 'lg']).default('default'),
  disabled: z.boolean().default(false),
  loading: z.boolean().default(false),
  fullWidth: z.boolean().default(false),
}).refine(data => data.actionId || data.to, {
  message: "Either actionId or to prop is required",
});

export const linkButtonSchema = z.object({
  text: z.string().min(1, "Link text is required"),
  to: z.string().min(1, "Destination URL is required"),
  external: z.boolean().default(false),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).default('link'),
  size: z.enum(['sm', 'default', 'lg']).default('default'),
});

export const feedComponentSchema = z.object({
  dataSource: z.enum(['live', 'mock']).default('live'),
  feedType: z.enum(['matches', 'discovery', 'recent']).default('discovery'),
  limit: z.number().min(1).max(50).default(10),
  showFilters: z.boolean().default(true),
  showSkeleton: z.boolean().default(true),
  showEmptyState: z.boolean().default(true),
});

// Component configurations for Builder.io
export const BUILDER_COMPONENTS: BuilderComponentConfig[] = [
  {
    name: 'AppShell',
    description: 'Main application shell with navigation and header',
    inputs: [
      {
        name: 'showBack',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Show back button in header'
      },
      {
        name: 'showHome', 
        type: 'boolean',
        defaultValue: true,
        helperText: 'Show home button in header'
      },
      {
        name: 'title',
        type: 'string',
        helperText: 'Custom page title (overrides automatic title)'
      },
      {
        name: 'hideNavigation',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Hide navigation completely for special pages'
      }
    ],
    canHaveChildren: true,
    noWrap: true,
  },
  {
    name: 'UserProfileForm',
    description: 'Complete user profile editing form with validation',
    inputs: [
      {
        name: 'userId',
        type: 'string',
        required: true,
        helperText: 'ID of the user to edit'
      },
      {
        name: 'showFullForm',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Show all form fields or just basic ones'
      },
      {
        name: 'onSaveSuccess',
        type: 'string',
        helperText: 'Action ID to trigger on successful save'
      },
      {
        name: 'redirectAfterSave',
        type: 'url',
        helperText: 'URL to redirect to after saving'
      }
    ],
    docsLink: '/docs/components/user-profile-form',
  },
  {
    name: 'SettingsPanel',
    description: 'User settings panel with separate push/email preferences',
    inputs: [
      {
        name: 'userId',
        type: 'string',
        required: true,
        helperText: 'ID of the user whose settings to manage'
      },
      {
        name: 'section',
        type: 'string',
        enum: ['push', 'email', 'privacy', 'discovery', 'all'],
        defaultValue: 'all',
        helperText: 'Which settings section to show'
      },
      {
        name: 'showSaveButton',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Show explicit Save button'
      },
      {
        name: 'autoSave',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Auto-save changes after delay'
      },
      {
        name: 'autoSaveDelay',
        type: 'number',
        defaultValue: 600,
        helperText: 'Auto-save delay in milliseconds'
      }
    ],
    docsLink: '/docs/components/settings-panel',
  },
  {
    name: 'BlockUserButton',
    description: 'Button to block/unblock users with confirmation',
    inputs: [
      {
        name: 'userId',
        type: 'string',
        required: true,
        helperText: 'Current user ID'
      },
      {
        name: 'targetId',
        type: 'string',
        required: true,
        helperText: 'ID of user to block/unblock'
      },
      {
        name: 'variant',
        type: 'string',
        enum: ['default', 'destructive', 'outline'],
        defaultValue: 'destructive',
        helperText: 'Button style variant'
      },
      {
        name: 'size',
        type: 'string',
        enum: ['sm', 'default', 'lg'],
        defaultValue: 'default',
        helperText: 'Button size'
      },
      {
        name: 'confirmationRequired',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Require confirmation before blocking'
      }
    ],
    docsLink: '/docs/components/block-user-button',
  },
  {
    name: 'LocationShare',
    description: 'Component for sharing and updating user location',
    inputs: [
      {
        name: 'userId',
        type: 'string',
        required: true,
        helperText: 'ID of the user'
      },
      {
        name: 'autoRequest',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Automatically request location on mount'
      },
      {
        name: 'showAccuracy',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Show location accuracy information'
      },
      {
        name: 'onLocationUpdate',
        type: 'string',
        helperText: 'Action ID to trigger when location updates'
      }
    ],
    docsLink: '/docs/components/location-share',
  },
  {
    name: 'PrimaryButton',
    description: 'Primary action button with proper routing and actions',
    inputs: [
      {
        name: 'text',
        type: 'string',
        required: true,
        helperText: 'Button text to display'
      },
      {
        name: 'actionId',
        type: 'string',
        helperText: 'Action ID to trigger (alternative to URL navigation)'
      },
      {
        name: 'to',
        type: 'url',
        helperText: 'URL to navigate to (alternative to action)'
      },
      {
        name: 'variant',
        type: 'string',
        enum: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        defaultValue: 'default',
        helperText: 'Button style variant'
      },
      {
        name: 'size',
        type: 'string',
        enum: ['sm', 'default', 'lg'],
        defaultValue: 'default',
        helperText: 'Button size'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Disable the button'
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Show loading state'
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Make button full width'
      }
    ],
    docsLink: '/docs/components/primary-button',
  },
  {
    name: 'LinkButton',
    description: 'Navigation link styled as button',
    inputs: [
      {
        name: 'text',
        type: 'string',
        required: true,
        helperText: 'Link text to display'
      },
      {
        name: 'to',
        type: 'url',
        required: true,
        helperText: 'Destination URL'
      },
      {
        name: 'external',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Open in new tab (for external links)'
      },
      {
        name: 'variant',
        type: 'string',
        enum: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        defaultValue: 'link',
        helperText: 'Link style variant'
      },
      {
        name: 'size',
        type: 'string',
        enum: ['sm', 'default', 'lg'],
        defaultValue: 'default',
        helperText: 'Link size'
      }
    ],
    docsLink: '/docs/components/link-button',
  },
  {
    name: 'FeedComponent',
    description: 'Data feed with skeletons and empty states',
    inputs: [
      {
        name: 'dataSource',
        type: 'string',
        enum: ['live', 'mock'],
        defaultValue: 'live',
        helperText: 'Use live data or mock data'
      },
      {
        name: 'feedType',
        type: 'string',
        enum: ['matches', 'discovery', 'recent'],
        defaultValue: 'discovery',
        helperText: 'Type of content to display'
      },
      {
        name: 'limit',
        type: 'number',
        defaultValue: 10,
        helperText: 'Maximum number of items to show'
      },
      {
        name: 'showFilters',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Show filter controls'
      },
      {
        name: 'showSkeleton',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Show skeleton loading state'
      },
      {
        name: 'showEmptyState',
        type: 'boolean',
        defaultValue: true,
        helperText: 'Show empty state when no data'
      }
    ],
    docsLink: '/docs/components/feed-component',
  }
];

// Function to register all components with Builder.io
export function registerBuilderComponents() {
  // Register components
  Builder.registerComponent(AppShell, {
    name: 'AppShell',
    ...BUILDER_COMPONENTS.find(c => c.name === 'AppShell')!
  });

  Builder.registerComponent(UserProfileForm, {
    name: 'UserProfileForm',
    ...BUILDER_COMPONENTS.find(c => c.name === 'UserProfileForm')!
  });

  Builder.registerComponent(SettingsPanel, {
    name: 'SettingsPanel',
    ...BUILDER_COMPONENTS.find(c => c.name === 'SettingsPanel')!
  });

  Builder.registerComponent(BlockUserButton, {
    name: 'BlockUserButton',
    ...BUILDER_COMPONENTS.find(c => c.name === 'BlockUserButton')!
  });

  Builder.registerComponent(LocationShare, {
    name: 'LocationShare',
    ...BUILDER_COMPONENTS.find(c => c.name === 'LocationShare')!
  });

  Builder.registerComponent(PrimaryButton, {
    name: 'PrimaryButton',
    ...BUILDER_COMPONENTS.find(c => c.name === 'PrimaryButton')!
  });

  Builder.registerComponent(LinkButton, {
    name: 'LinkButton',
    ...BUILDER_COMPONENTS.find(c => c.name === 'LinkButton')!
  });

  Builder.registerComponent(FeedComponent, {
    name: 'FeedComponent',
    ...BUILDER_COMPONENTS.find(c => c.name === 'FeedComponent')!
  });

  console.log('✅ Builder.io components registered successfully');
}

// Validation helpers for runtime prop checking
export function validateComponentProps<T>(
  componentName: string,
  props: unknown,
  schema: z.ZodSchema<T>
): T {
  try {
    return schema.parse(props);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`Invalid props for ${componentName}:`, error.errors);
      throw new Error(`Invalid props for ${componentName}: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

// Export schemas for use in components
export {
  userProfileFormSchema,
  settingsPanelSchema,
  blockUserButtonSchema,
  locationShareSchema,
  primaryButtonSchema,
  linkButtonSchema,
  feedComponentSchema,
};
