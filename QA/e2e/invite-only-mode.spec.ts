import { test, expect } from "@playwright/test";

test.describe("Invite-Only Mode", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto("/");
  });

  test("should redirect to invite signup when invite-only mode is enabled", async ({
    page,
  }) => {
    // Mock API response for invite-only mode enabled
    await page.route("/api/settings/invite-only-mode", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: true,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    // Navigate to sign in
    await page.goto("/signin");

    // Should redirect to invite signup
    await expect(page).toHaveURL("/invite-signup");

    // Should show invite-only interface
    await expect(page.locator("h1")).toContainText("Invite-only access");
  });

  test("should allow regular sign in when invite-only mode is disabled", async ({
    page,
  }) => {
    // Mock API response for invite-only mode disabled
    await page.route("/api/settings/invite-only-mode", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: false,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    // Navigate to sign in
    await page.goto("/signin");

    // Should stay on regular sign in page
    await expect(page).toHaveURL("/signin");

    // Should show regular sign in interface
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("should handle invite code validation and email OTP flow", async ({
    page,
  }) => {
    // Mock invite-only mode enabled
    await page.route("/api/settings/invite-only-mode", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: true,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    // Mock successful invite validation and OTP request
    await page.route("/api/auth/email/request-code", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Verification code sent to your email",
          expires_in: 600,
        }),
      });
    });

    await page.goto("/invite-signup");

    // Fill in invite code and email
    await page.fill('[data-action="input_invite_code"]', "TESTINVITE123");
    await page.fill('[data-action="input_email"]', "test@church.org");

    // Submit form
    await page.click('[data-action="submit_request_code"]');

    // Should proceed to code entry step
    await expect(
      page.locator('input[data-action="input_verification_code"]'),
    ).toBeVisible();
    await expect(page.locator("h1")).toContainText("Enter verification code");
  });

  test("should handle OTP verification and user creation", async ({ page }) => {
    // Mock invite-only mode enabled
    await page.route("/api/settings/invite-only-mode", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: true,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    // Mock successful OTP verification
    await page.route("/api/auth/email/verify-code", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          user: {
            id: "user_123",
            email: "test@church.org",
            verification_status: "pending",
            onboarding_complete: false,
          },
          session: {
            token: "session_token_123",
            expires_at: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        }),
      });
    });

    await page.goto("/invite-signup");

    // Fast-forward to code entry (simulate successful invite/email submission)
    await page.evaluate(() => {
      window.history.pushState({}, "", "/invite-signup");
    });

    // Manually set the step to code entry for testing
    await page.addInitScript(() => {
      window.localStorage.setItem("test_step", "code");
    });

    // Reload to apply the step change
    await page.reload();

    // Fill in verification code
    await page.fill('[data-action="input_verification_code"]', "123456");

    // Submit verification
    await page.click('[data-action="submit_verify_code"]');

    // Should redirect to onboarding
    await expect(page).toHaveURL("/onboarding/nickname");
  });

  test("should show appropriate error messages for invalid invites", async ({
    page,
  }) => {
    // Mock invite-only mode enabled
    await page.route("/api/settings/invite-only-mode", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: true,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    // Mock invalid invite error
    await page.route("/api/auth/email/request-code", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Invalid or expired invite code",
        }),
      });
    });

    await page.goto("/invite-signup");

    // Fill in invalid invite code and email
    await page.fill('[data-action="input_invite_code"]', "INVALID123");
    await page.fill('[data-action="input_email"]', "test@example.com");

    // Submit form
    await page.click('[data-action="submit_request_code"]');

    // Should show error message
    await expect(page.locator('[role="alert"]')).toContainText(
      "Invalid or expired invite code",
    );
  });

  test("should handle resend code functionality", async ({ page }) => {
    // Mock invite-only mode and successful flows
    await page.route("/api/settings/invite-only-mode", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: true,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    await page.route("/api/auth/email/request-code", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Verification code sent to your email",
          expires_in: 600,
        }),
      });
    });

    await page.goto("/invite-signup");

    // Fill form and submit to get to code step
    await page.fill('[data-action="input_invite_code"]', "TESTINVITE123");
    await page.fill('[data-action="input_email"]', "test@church.org");
    await page.click('[data-action="submit_request_code"]');

    // Should be on code entry step
    await expect(
      page.locator('input[data-action="input_verification_code"]'),
    ).toBeVisible();

    // Wait for resend button to be enabled (after 1 minute throttle)
    await page.waitForTimeout(1100); // Wait slightly more than 1 second for test

    // Click resend code
    await page.click('[data-action="click_resend_code"]');

    // Should show success message
    await expect(page.locator('[role="alert"]')).toContainText(
      "Verification code sent",
    );
  });
});

test.describe("Admin Invite Management", () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin authentication
    await page.addInitScript(() => {
      window.localStorage.setItem("auth_token", "admin_token_123");
      window.localStorage.setItem("user_role", "admin");
    });
  });

  test("should allow admin to toggle invite-only mode", async ({ page }) => {
    // Mock admin settings API
    await page.route("/api/settings", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: false,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    await page.route("/api/invites", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Mock toggle endpoint
    await page.route("/api/settings/invite-only-mode", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, invite_only_mode: true }),
      });
    });

    await page.goto("/admin/invites");

    // Find and toggle invite-only mode switch
    const toggleSwitch = page.locator(
      '[data-action="toggle_invite_only_mode"]',
    );
    await expect(toggleSwitch).toBeVisible();

    await toggleSwitch.click();

    // Should show success message
    await expect(page.locator('[role="alert"]')).toContainText(
      "Invite-only mode enabled",
    );
  });

  test("should allow admin to create new invites", async ({ page }) => {
    // Mock admin APIs
    await page.route("/api/settings", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: true,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    await page.route("/api/invites", (route) => {
      if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      } else if (route.request().method() === "POST") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "invite_123",
            code: "NEWCODE123",
            email: "test@church.org",
            max_uses: 1,
            uses: 0,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: "admin_123",
          }),
        });
      }
    });

    await page.goto("/admin/invites");

    // Click create invite button
    await page.click('[data-action="click_create_invite"]');

    // Should open create dialog
    await expect(page.locator("dialog")).toBeVisible();
    await expect(page.locator("dialog h2")).toContainText("Create New Invite");

    // Fill invite form
    await page.fill('[data-action="input_invite_email"]', "test@church.org");
    await page.fill(
      '[data-action="input_invite_notes"]',
      "Test invite for church member",
    );

    // Submit form
    await page.click('[data-action="submit_create_invite"]');

    // Should show success message and close dialog
    await expect(page.locator('[role="alert"]')).toContainText(
      "Invite NEWCODE123 created successfully",
    );
    await expect(page.locator("dialog")).not.toBeVisible();
  });

  test("should display invite usage statistics correctly", async ({ page }) => {
    // Mock invites with various statuses
    await page.route("/api/settings", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          invite_only_mode: true,
          invite_requirements: {
            email_domain_whitelist: [],
            must_supply_invite_key: true,
          },
        }),
      });
    });

    await page.route("/api/invites", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "invite_1",
            code: "ACTIVE123",
            max_uses: 5,
            uses: 2,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: "admin_123",
          },
          {
            id: "invite_2",
            code: "EXPIRED456",
            max_uses: 1,
            uses: 1,
            status: "expired",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: "admin_123",
          },
        ]),
      });
    });

    await page.goto("/admin/invites");

    // Should show correct invite count
    await expect(page.locator("h3")).toContainText("Invitations (2)");

    // Should show invite codes and usage
    await expect(page.locator("table")).toContainText("ACTIVE123");
    await expect(page.locator("table")).toContainText("2 / 5");

    await expect(page.locator("table")).toContainText("EXPIRED456");
    await expect(page.locator("table")).toContainText("1 / 1");

    // Should show correct status badges
    await expect(page.locator('[role="cell"]')).toContainText("Active");
    await expect(page.locator('[role="cell"]')).toContainText("Expired");
  });
});
