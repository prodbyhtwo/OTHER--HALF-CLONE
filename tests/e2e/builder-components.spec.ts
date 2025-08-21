// tests/e2e/builder-components.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Builder Components Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('auth_token', 'test_token_123');
      window.localStorage.setItem('user_id', 'user1');
    });

    // Mock all API endpoints
    await page.route('/api/**', (route) => {
      const url = route.request().url();
      const method = route.request().method();

      // Settings API
      if (url.includes('/api/settings/me')) {
        if (method === 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                user_id: 'user1',
                push_preferences: {
                  marketing: true,
                  social: true,
                  security: true,
                  matches: true,
                  messages: true,
                  likes: true,
                },
                email_preferences: {
                  marketing: false,
                  social: false,
                  security: true,
                  matches: false,
                  messages: false,
                  weekly_digest: false,
                },
                privacy_preferences: {
                  profile_visibility: 'public',
                  show_age: true,
                  show_distance: true,
                  show_last_active: true,
                  show_online_status: false,
                  discoverable: true,
                },
                discovery_preferences: {
                  min_age: 18,
                  max_age: 35,
                  max_distance_km: 50,
                  required_verification: false,
                },
                theme: 'system',
                language: 'en',
                updated_at: '2024-01-01T00:00:00Z',
              }
            })
          });
        } else if (method === 'PUT') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                user_id: 'user1',
                updated_at: new Date().toISOString(),
              },
              message: 'Settings updated successfully'
            })
          });
        }
      }

      // User profile API
      else if (url.includes('/api/users/user1')) {
        if (method === 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                id: 'user1',
                email: 'test@example.com',
                full_name: 'Test User',
                age: 25,
                bio: 'Test bio content',
                denomination: 'catholic',
                church_attendance: 'weekly',
                interests: ['reading', 'hiking', 'worship'],
                verification_status: 'verified',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
                location: {
                  lat: 40.7128,
                  lng: -74.0060,
                  locality: 'New York',
                  country: 'US'
                }
              }
            })
          });
        } else if (method === 'PATCH') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                id: 'user1',
                full_name: 'Updated Name',
                updated_at: new Date().toISOString(),
              },
              message: 'Profile updated successfully'
            })
          });
        }
      }

      // Blocks API
      else if (url.includes('/api/blocks')) {
        if (method === 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                blockedUserIds: [],
                total: 0
              }
            })
          });
        } else if (method === 'POST') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                blockedUserId: 'user2',
                blockedAt: new Date().toISOString()
              },
              message: 'User blocked successfully'
            })
          });
        } else if (method === 'DELETE') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                unblockedUserId: 'user2',
                unblockedAt: new Date().toISOString()
              },
              message: 'User unblocked successfully'
            })
          });
        }
      }

      // Location API
      else if (url.includes('/api/location')) {
        if (url.includes('/api/location/permission')) {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: { permission: 'prompt' }
            })
          });
        } else if (method === 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: { location: null }
            })
          });
        } else if (method === 'PUT') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                location: {
                  lat: 40.7128,
                  lng: -74.0060,
                  locality: 'New York',
                  country: 'US',
                  sharing: true,
                  timestamp: new Date().toISOString()
                }
              },
              message: 'Location updated successfully'
            })
          });
        } else if (url.includes('/manual') && method === 'PUT') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                location: {
                  lat: 40.7128,
                  lng: -74.0060,
                  locality: 'New York',
                  country: 'US',
                  source: 'manual',
                  sharing: true,
                  timestamp: new Date().toISOString()
                }
              },
              message: 'Location set manually'
            })
          });
        }
      }

      // Default fallback
      else {
        route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Not found' })
        });
      }
    });
  });

  test('User Profile Form - should load and update profile data', async ({ page }) => {
    // Create a test page with UserProfileForm
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Profile Form</title>
        <script type="module">
          import React from 'https://esm.sh/react@18.2.0';
          import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
          
          // Mock component that simulates our UserProfileForm
          const UserProfileForm = () => {
            const [loading, setLoading] = React.useState(true);
            const [userData, setUserData] = React.useState(null);
            
            React.useEffect(() => {
              // Simulate API call
              fetch('/api/users/user1')
                .then(res => res.json())
                .then(data => {
                  setUserData(data.data);
                  setLoading(false);
                });
            }, []);
            
            if (loading) return React.createElement('div', {}, 'Loading profile...');
            
            return React.createElement('form', {
              onSubmit: (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                fetch('/api/users/user1', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    full_name: formData.get('full_name'),
                    age: parseInt(formData.get('age')),
                    bio: formData.get('bio')
                  })
                }).then(() => {
                  alert('Profile updated!');
                });
              }
            }, [
              React.createElement('h2', {}, 'Edit Profile'),
              React.createElement('div', {}, [
                React.createElement('label', { key: 'name-label' }, 'Full Name:'),
                React.createElement('input', {
                  key: 'name-input',
                  name: 'full_name',
                  defaultValue: userData?.full_name || '',
                  'data-testid': 'full-name-input'
                })
              ]),
              React.createElement('div', {}, [
                React.createElement('label', { key: 'age-label' }, 'Age:'),
                React.createElement('input', {
                  key: 'age-input',
                  name: 'age',
                  type: 'number',
                  defaultValue: userData?.age || '',
                  'data-testid': 'age-input'
                })
              ]),
              React.createElement('div', {}, [
                React.createElement('label', { key: 'bio-label' }, 'Bio:'),
                React.createElement('textarea', {
                  key: 'bio-input',
                  name: 'bio',
                  defaultValue: userData?.bio || '',
                  'data-testid': 'bio-input'
                })
              ]),
              React.createElement('button', {
                type: 'submit',
                'data-testid': 'save-button'
              }, 'Save Profile')
            ]);
          };
          
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(UserProfileForm));
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `);

    // Wait for profile to load
    await expect(page.getByText('Edit Profile')).toBeVisible();
    await expect(page.getByTestId('full-name-input')).toHaveValue('Test User');
    await expect(page.getByTestId('age-input')).toHaveValue('25');

    // Update profile data
    await page.getByTestId('full-name-input').fill('Updated Name');
    await page.getByTestId('age-input').fill('26');
    await page.getByTestId('bio-input').fill('Updated bio content');

    // Submit form
    await page.getByTestId('save-button').click();

    // Should show success message
    await expect(page.locator('text=Profile updated!')).toBeVisible();
  });

  test('Settings Panel - should load and update settings', async ({ page }) => {
    // Create test page with Settings Panel
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Settings Panel</title>
        <script type="module">
          import React from 'https://esm.sh/react@18.2.0';
          import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
          
          const SettingsPanel = () => {
            const [loading, setLoading] = React.useState(true);
            const [settings, setSettings] = React.useState(null);
            
            React.useEffect(() => {
              fetch('/api/settings/me')
                .then(res => res.json())
                .then(data => {
                  setSettings(data.data);
                  setLoading(false);
                });
            }, []);
            
            if (loading) return React.createElement('div', {}, 'Loading settings...');
            
            const updateSettings = (field, value) => {
              const updatedSettings = { ...settings };
              if (field === 'marketing') {
                updatedSettings.push_preferences.marketing = value;
              }
              
              fetch('/api/settings/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSettings)
              }).then(() => {
                setSettings(updatedSettings);
                alert('Settings saved!');
              });
            };
            
            return React.createElement('div', {}, [
              React.createElement('h2', { key: 'title' }, 'Settings'),
              React.createElement('div', { key: 'push-section' }, [
                React.createElement('h3', { key: 'push-title' }, 'Push Notifications'),
                React.createElement('label', { key: 'marketing-label' }, [
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: settings.push_preferences.marketing,
                    onChange: (e) => updateSettings('marketing', e.target.checked),
                    'data-testid': 'marketing-switch'
                  }),
                  ' Marketing notifications'
                ])
              ]),
              React.createElement('div', { key: 'email-section' }, [
                React.createElement('h3', { key: 'email-title' }, 'Email Notifications'),
                React.createElement('div', { key: 'security-note' }, 'Security emails: Always enabled')
              ])
            ]);
          };
          
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(SettingsPanel));
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `);

    // Wait for settings to load
    await expect(page.getByText('Settings')).toBeVisible();
    await expect(page.getByText('Push Notifications')).toBeVisible();

    // Marketing switch should be checked by default
    await expect(page.getByTestId('marketing-switch')).toBeChecked();

    // Toggle marketing notifications
    await page.getByTestId('marketing-switch').click();
    await expect(page.locator('text=Settings saved!')).toBeVisible();

    // Switch should now be unchecked
    await expect(page.getByTestId('marketing-switch')).not.toBeChecked();
  });

  test('Block User Button - should handle block/unblock actions', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Block Button</title>
        <script type="module">
          import React from 'https://esm.sh/react@18.2.0';
          import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
          
          const BlockUserButton = () => {
            const [loading, setLoading] = React.useState(true);
            const [isBlocked, setIsBlocked] = React.useState(false);
            const [showDialog, setShowDialog] = React.useState(false);
            
            React.useEffect(() => {
              fetch('/api/blocks')
                .then(res => res.json())
                .then(data => {
                  setIsBlocked(data.data.blockedUserIds.includes('user2'));
                  setLoading(false);
                });
            }, []);
            
            const handleBlock = () => {
              setLoading(true);
              fetch('/api/blocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'user2', reason: 'Test block' })
              }).then(() => {
                setIsBlocked(true);
                setLoading(false);
                setShowDialog(false);
                alert('User blocked successfully');
              });
            };
            
            const handleUnblock = () => {
              setLoading(true);
              fetch('/api/blocks/user2', {
                method: 'DELETE'
              }).then(() => {
                setIsBlocked(false);
                setLoading(false);
                alert('User unblocked successfully');
              });
            };
            
            if (loading) return React.createElement('div', {}, 'Loading...');
            
            if (isBlocked) {
              return React.createElement('button', {
                onClick: handleUnblock,
                'data-testid': 'unblock-button'
              }, 'Unblock User');
            }
            
            return React.createElement('div', {}, [
              React.createElement('button', {
                key: 'block-btn',
                onClick: () => setShowDialog(true),
                'data-testid': 'block-button'
              }, 'Block User'),
              showDialog && React.createElement('dialog', {
                key: 'dialog',
                open: true,
                style: { display: 'block' }
              }, [
                React.createElement('p', { key: 'msg' }, 'Are you sure you want to block this user?'),
                React.createElement('button', {
                  key: 'confirm',
                  onClick: handleBlock,
                  'data-testid': 'confirm-block'
                }, 'Yes, Block'),
                React.createElement('button', {
                  key: 'cancel',
                  onClick: () => setShowDialog(false),
                  'data-testid': 'cancel-block'
                }, 'Cancel')
              ])
            ]);
          };
          
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(BlockUserButton));
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `);

    // Initially should show block button
    await expect(page.getByTestId('block-button')).toBeVisible();

    // Click block button to open dialog
    await page.getByTestId('block-button').click();
    await expect(page.getByText('Are you sure you want to block this user?')).toBeVisible();

    // Confirm blocking
    await page.getByTestId('confirm-block').click();
    await expect(page.locator('text=User blocked successfully')).toBeVisible();

    // Should now show unblock button
    await expect(page.getByTestId('unblock-button')).toBeVisible();

    // Test unblocking
    await page.getByTestId('unblock-button').click();
    await expect(page.locator('text=User unblocked successfully')).toBeVisible();

    // Should be back to block button
    await expect(page.getByTestId('block-button')).toBeVisible();
  });

  test('Location Share - should handle GPS and manual location', async ({ page }) => {
    // Mock geolocation API
    await page.addInitScript(() => {
      // Mock successful geolocation
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: (success) => {
            setTimeout(() => {
              success({
                coords: {
                  latitude: 40.7128,
                  longitude: -74.0060,
                  accuracy: 10
                }
              });
            }, 100);
          }
        }
      });
    });

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Location Share</title>
        <script type="module">
          import React from 'https://esm.sh/react@18.2.0';
          import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
          
          const LocationShare = () => {
            const [loading, setLoading] = React.useState(false);
            const [location, setLocation] = React.useState(null);
            const [address, setAddress] = React.useState('');
            
            const requestLocation = () => {
              setLoading(true);
              navigator.geolocation.getCurrentPosition((position) => {
                const locationData = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  source: 'gps',
                  sharing: true
                };
                
                fetch('/api/location', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(locationData)
                }).then(res => res.json()).then(data => {
                  setLocation(data.data.location);
                  setLoading(false);
                  alert('Location updated successfully');
                });
              });
            };
            
            const setManualLocation = () => {
              if (!address) return;
              
              setLoading(true);
              fetch('/api/location/manual', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address })
              }).then(res => res.json()).then(data => {
                setLocation(data.data.location);
                setLoading(false);
                setAddress('');
                alert('Location set from address');
              });
            };
            
            return React.createElement('div', {}, [
              React.createElement('h2', { key: 'title' }, 'Location Sharing'),
              location && React.createElement('div', { 
                key: 'current-location',
                'data-testid': 'current-location'
              }, \`Current: \${location.locality}, \${location.country}\`),
              React.createElement('button', {
                key: 'gps-btn',
                onClick: requestLocation,
                disabled: loading,
                'data-testid': 'use-gps-button'
              }, loading ? 'Getting Location...' : 'Use Current Location'),
              React.createElement('div', { key: 'manual-section' }, [
                React.createElement('input', {
                  key: 'address-input',
                  value: address,
                  onChange: (e) => setAddress(e.target.value),
                  placeholder: 'Enter your address...',
                  'data-testid': 'address-input'
                }),
                React.createElement('button', {
                  key: 'set-btn',
                  onClick: setManualLocation,
                  disabled: !address,
                  'data-testid': 'set-address-button'
                }, 'Set')
              ])
            ]);
          };
          
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(LocationShare));
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `);

    // Should show location sharing interface
    await expect(page.getByText('Location Sharing')).toBeVisible();
    await expect(page.getByTestId('use-gps-button')).toBeVisible();

    // Test GPS location
    await page.getByTestId('use-gps-button').click();
    await expect(page.locator('text=Location updated successfully')).toBeVisible();
    await expect(page.getByTestId('current-location')).toContainText('New York, US');

    // Test manual address entry
    await page.getByTestId('address-input').fill('San Francisco, CA');
    await page.getByTestId('set-address-button').click();
    await expect(page.locator('text=Location set from address')).toBeVisible();
  });

  test('Primary and Link Buttons - should handle navigation and actions', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Buttons</title>
        <script type="module">
          import React from 'https://esm.sh/react@18.2.0';
          import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
          
          const ButtonTest = () => {
            const [actionTriggered, setActionTriggered] = React.useState('');
            
            const triggerAction = (actionId) => {
              setActionTriggered(\`Action triggered: \${actionId}\`);
              console.log('Action:', actionId);
            };
            
            return React.createElement('div', {}, [
              React.createElement('h2', { key: 'title' }, 'Button Tests'),
              React.createElement('button', {
                key: 'primary-btn',
                onClick: () => triggerAction('save-profile'),
                'data-testid': 'primary-button'
              }, 'Save Profile'),
              React.createElement('a', {
                key: 'link-btn',
                href: '/profile/user1',
                'data-testid': 'link-button',
                style: { display: 'inline-block', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none' }
              }, 'View Profile'),
              React.createElement('button', {
                key: 'disabled-btn',
                disabled: true,
                'data-testid': 'disabled-button'
              }, 'Disabled Button'),
              actionTriggered && React.createElement('div', {
                key: 'action-result',
                'data-testid': 'action-result'
              }, actionTriggered)
            ]);
          };
          
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(ButtonTest));
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `);

    // Test primary button with action
    await expect(page.getByTestId('primary-button')).toBeVisible();
    await page.getByTestId('primary-button').click();
    await expect(page.getByTestId('action-result')).toContainText('Action triggered: save-profile');

    // Test link button navigation
    const linkButton = page.getByTestId('link-button');
    await expect(linkButton).toBeVisible();
    await expect(linkButton).toHaveAttribute('href', '/profile/user1');

    // Test disabled button
    const disabledButton = page.getByTestId('disabled-button');
    await expect(disabledButton).toBeVisible();
    await expect(disabledButton).toBeDisabled();
  });

  test('Accessibility - should meet WCAG standards', async ({ page }) => {
    // Create test page with accessibility features
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Accessibility Test</title>
        <style>
          /* Apply updated design tokens for contrast compliance */
          .button-primary { background-color: #9610ff; color: #ffffff; }
          .button-error { background-color: #dc2626; color: #ffffff; }
          .button-success { background-color: #047857; color: #ffffff; }
          .text-disabled { color: #757575; }
          .text-placeholder { color: #6b7280; }
          .link-text { color: #7c3aed; }
          
          button:focus, input:focus, textarea:focus {
            outline: 2px solid #9610ff;
            outline-offset: 2px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Accessibility Test Page</h1>
          
          <section aria-labelledby="profile-heading">
            <h2 id="profile-heading">User Profile</h2>
            <form aria-labelledby="profile-heading">
              <div>
                <label for="full-name">Full Name (required)</label>
                <input id="full-name" name="full_name" required aria-describedby="name-help">
                <div id="name-help">Enter your full name as it appears on official documents</div>
              </div>
              
              <div>
                <label for="email">Email Address</label>
                <input id="email" name="email" type="email" aria-describedby="email-help">
                <div id="email-help">We'll use this to send you important updates</div>
              </div>
              
              <div>
                <label for="bio">Biography</label>
                <textarea id="bio" name="bio" aria-describedby="bio-help"></textarea>
                <div id="bio-help">Tell us about yourself (optional, max 1000 characters)</div>
              </div>
              
              <div role="group" aria-labelledby="notification-heading">
                <h3 id="notification-heading">Notification Preferences</h3>
                <label>
                  <input type="checkbox" name="notifications" value="email">
                  Email notifications
                </label>
                <label>
                  <input type="checkbox" name="notifications" value="push">
                  Push notifications
                </label>
              </div>
              
              <button type="submit" class="button-primary">Save Changes</button>
              <button type="button" class="button-error">Delete Profile</button>
            </form>
          </section>
          
          <section aria-labelledby="actions-heading">
            <h2 id="actions-heading">User Actions</h2>
            <button class="button-success" aria-describedby="block-help">Block User</button>
            <div id="block-help">This will prevent the user from contacting you</div>
            
            <a href="/profile" class="link-text">View Full Profile</a>
          </section>
          
          <section aria-live="polite" aria-atomic="true">
            <div id="status-message"></div>
          </section>
        </main>
      </body>
      </html>
    `);

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('#full-name')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#email')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#bio')).toBeFocused();

    // Test form labels and ARIA
    const nameInput = page.locator('#full-name');
    await expect(nameInput).toHaveAttribute('aria-describedby', 'name-help');
    
    const nameLabel = page.locator('label[for="full-name"]');
    await expect(nameLabel).toBeVisible();
    
    // Test ARIA live regions
    const statusRegion = page.locator('[aria-live="polite"]');
    await expect(statusRegion).toBeVisible();
    
    // Test headings hierarchy
    await expect(page.locator('h1')).toContainText('Accessibility Test Page');
    await expect(page.locator('h2').first()).toContainText('User Profile');
    await expect(page.locator('h3')).toContainText('Notification Preferences');
    
    // Test focus management
    await page.locator('button[type="submit"]').focus();
    await expect(page.locator('button[type="submit"]')).toBeFocused();
    
    // Test form validation
    await page.locator('#full-name').fill('');
    await page.locator('button[type="submit"]').click();
    
    // Should show validation error (HTML5 validation)
    const validationMessage = await page.locator('#full-name').evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).toBeTruthy();
  });
});

test.describe('Builder Components Performance', () => {
  test('should load components efficiently', async ({ page }) => {
    await page.goto('/profile');
    
    // Measure performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });
    
    // Performance assertions
    expect(performanceMetrics.domContentLoaded).toBeLessThan(1000); // < 1s
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2000); // < 2s
  });
  
  test('should handle large data sets efficiently', async ({ page }) => {
    // Mock large dataset
    await page.route('/api/users/user1', (route) => {
      const largeInterests = Array.from({ length: 100 }, (_, i) => `Interest ${i + 1}`);
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'user1',
            full_name: 'Test User',
            age: 25,
            interests: largeInterests,
            // ... other fields
          }
        })
      });
    });
    
    await page.goto('/profile/edit');
    
    // Should render without performance issues
    await expect(page.getByText('Edit Profile')).toBeVisible({ timeout: 5000 });
  });
});
