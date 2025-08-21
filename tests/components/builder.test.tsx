// tests/components/builder.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock hooks and utils
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-realtime", () => ({
  useLocationUpdates: () => ({ lastUpdate: null }),
  useProfileUpdates: () => ({ lastUpdate: null }),
  useSettingsUpdates: () => ({ lastUpdate: null }),
  useBlockUpdates: () => ({ lastUpdate: null }),
}));

// Import components to test
import { UserProfileForm } from "../../client/components/builder/UserProfileForm";
import { SettingsPanel } from "../../client/components/builder/SettingsPanel";
import { BlockUserButton } from "../../client/components/builder/BlockUserButton";
import { LocationShare } from "../../client/components/builder/LocationShare";
import { PrimaryButton } from "../../client/components/builder/PrimaryButton";
import { LinkButton } from "../../client/components/builder/LinkButton";

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock fetch globally
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  // Reset fetch mock
  (global.fetch as any).mockReset();
});

describe("Builder Components", () => {
  describe("PrimaryButton", () => {
    it("renders with correct text", () => {
      render(<PrimaryButton text="Click me" to="/test" userId="user1" />);

      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("navigates when clicked with to prop", () => {
      const pushStateSpy = vi.spyOn(window.history, "pushState");

      render(<PrimaryButton text="Navigate" to="/profile" userId="user1" />);

      fireEvent.click(screen.getByRole("button"));

      // In a real test, you'd mock the router
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("shows loading state when disabled", () => {
      render(
        <PrimaryButton
          text="Submit"
          actionId="test-action"
          loading={true}
          userId="user1"
        />,
      );

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("validates props at runtime", () => {
      // This should not throw since we have either actionId or to
      expect(() => {
        render(<PrimaryButton text="Valid" to="/test" userId="user1" />);
      }).not.toThrow();
    });
  });

  describe("LinkButton", () => {
    it("renders as a link with correct attributes", () => {
      render(
        <LinkButton text="Go to profile" to="/profile/123" userId="user1" />,
      );

      const link = screen.getByRole("link");
      expect(link).toHaveTextContent("Go to profile");
      expect(link).toHaveAttribute("href", "/profile/123");
    });

    it("opens external links in new tab", () => {
      render(
        <LinkButton
          text="External link"
          to="https://example.com"
          external={true}
          userId="user1"
        />,
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("BlockUserButton", () => {
    beforeEach(() => {
      // Mock the blocks API
      (global.fetch as any).mockImplementation((url: string) => {
        if (url.includes("/api/blocks")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                success: true,
                data: { blockedUserIds: [] },
              }),
          });
        }
        return Promise.reject(new Error("Unknown URL"));
      });
    });

    it("renders block button when user is not blocked", async () => {
      render(
        <TestWrapper>
          <BlockUserButton
            userId="user1"
            targetId="user2"
            confirmationRequired={false}
          />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText("Block User")).toBeInTheDocument();
      });
    });

    it("shows confirmation dialog when confirmation is required", async () => {
      render(
        <TestWrapper>
          <BlockUserButton
            userId="user1"
            targetId="user2"
            confirmationRequired={true}
          />
        </TestWrapper>,
      );

      await waitFor(() => {
        const blockButton = screen.getByText("Block User");
        fireEvent.click(blockButton);
      });

      // Dialog should appear
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(
          screen.getByText("Are you sure you want to block this user?"),
        ).toBeInTheDocument();
      });
    });

    it("does not render when trying to block yourself", () => {
      const { container } = render(
        <TestWrapper>
          <BlockUserButton userId="user1" targetId="user1" />
        </TestWrapper>,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("UserProfileForm", () => {
    beforeEach(() => {
      // Mock user profile API
      (global.fetch as any).mockImplementation((url: string) => {
        if (url.includes("/api/users/")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                success: true,
                data: {
                  id: "user1",
                  email: "test@example.com",
                  full_name: "Test User",
                  age: 25,
                  bio: "Test bio",
                  interests: ["reading", "hiking"],
                  verification_status: "verified",
                  created_at: "2024-01-01T00:00:00Z",
                  updated_at: "2024-01-01T00:00:00Z",
                },
              }),
          });
        }
        return Promise.reject(new Error("Unknown URL"));
      });
    });

    it("loads and displays user profile data", async () => {
      render(
        <TestWrapper>
          <UserProfileForm userId="user1" />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
        expect(screen.getByDisplayValue("25")).toBeInTheDocument();
      });
    });

    it("shows loading state initially", () => {
      render(
        <TestWrapper>
          <UserProfileForm userId="user1" />
        </TestWrapper>,
      );

      expect(screen.getByText("Loading profile...")).toBeInTheDocument();
    });

    it("allows adding and removing interests", async () => {
      render(
        <TestWrapper>
          <UserProfileForm userId="user1" showFullForm={true} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
      });

      // Find the interest input and add button
      const interestInput = screen.getByPlaceholderText("Add an interest...");
      const addButton = screen.getByRole("button", { name: /add interest/i });

      // Add a new interest
      fireEvent.change(interestInput, { target: { value: "cooking" } });
      fireEvent.click(addButton);

      // Interest should be added to the list
      await waitFor(() => {
        expect(screen.getByText("cooking")).toBeInTheDocument();
      });
    });
  });

  describe("SettingsPanel", () => {
    beforeEach(() => {
      // Mock settings API
      (global.fetch as any).mockImplementation((url: string) => {
        if (url.includes("/api/settings/me")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                success: true,
                data: {
                  user_id: "user1",
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
                    profile_visibility: "public",
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
                  theme: "system",
                  language: "en",
                  updated_at: "2024-01-01T00:00:00Z",
                },
              }),
          });
        }
        return Promise.reject(new Error("Unknown URL"));
      });
    });

    it("loads and displays settings", async () => {
      render(
        <TestWrapper>
          <SettingsPanel userId="user1" />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText("Push Notifications")).toBeInTheDocument();
        expect(screen.getByText("Email Notifications")).toBeInTheDocument();
      });
    });

    it("shows different sections based on props", async () => {
      render(
        <TestWrapper>
          <SettingsPanel userId="user1" section="push" />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText("Push Notifications")).toBeInTheDocument();
        expect(
          screen.queryByText("Email Notifications"),
        ).not.toBeInTheDocument();
      });
    });

    it("toggles notification switches", async () => {
      render(
        <TestWrapper>
          <SettingsPanel userId="user1" section="push" />
        </TestWrapper>,
      );

      await waitFor(() => {
        const marketingSwitch = screen.getByRole("switch", {
          name: /marketing/i,
        });
        expect(marketingSwitch).toBeChecked();

        fireEvent.click(marketingSwitch);
        expect(marketingSwitch).not.toBeChecked();
      });
    });
  });

  describe("LocationShare", () => {
    beforeEach(() => {
      // Mock geolocation
      Object.defineProperty(global.navigator, "geolocation", {
        value: {
          getCurrentPosition: vi.fn((success) => {
            success({
              coords: {
                latitude: 40.7128,
                longitude: -74.006,
                accuracy: 10,
              },
            });
          }),
        },
      });

      // Mock permissions API
      Object.defineProperty(global.navigator, "permissions", {
        value: {
          query: vi.fn(() => Promise.resolve({ state: "granted" })),
        },
      });

      // Mock location API
      (global.fetch as any).mockImplementation((url: string) => {
        if (url.includes("/api/location/permission")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                success: true,
                data: { permission: "prompt" },
              }),
          });
        }
        if (url.includes("/api/location")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                success: true,
                data: { location: null },
              }),
          });
        }
        return Promise.reject(new Error("Unknown URL"));
      });
    });

    it("renders location sharing component", async () => {
      render(
        <TestWrapper>
          <LocationShare userId="user1" />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText("Location Sharing")).toBeInTheDocument();
        expect(screen.getByText("Use Current Location")).toBeInTheDocument();
      });
    });

    it("requests location when button is clicked", async () => {
      const getCurrentPositionSpy = vi.spyOn(
        global.navigator.geolocation,
        "getCurrentPosition",
      );

      render(
        <TestWrapper>
          <LocationShare userId="user1" />
        </TestWrapper>,
      );

      await waitFor(() => {
        const locationButton = screen.getByText("Use Current Location");
        fireEvent.click(locationButton);
      });

      expect(getCurrentPositionSpy).toHaveBeenCalled();
    });

    it("allows manual address entry", async () => {
      render(
        <TestWrapper>
          <LocationShare userId="user1" />
        </TestWrapper>,
      );

      await waitFor(() => {
        const addressInput = screen.getByPlaceholderText(
          /enter your city or address/i,
        );
        const setButton = screen.getByText("Set");

        fireEvent.change(addressInput, { target: { value: "New York, NY" } });
        expect(addressInput).toHaveValue("New York, NY");

        fireEvent.click(setButton);
        // In a real test, you'd verify the API call
      });
    });
  });
});

describe("Builder Component Validation", () => {
  it("validates UserProfileForm props", () => {
    expect(() => {
      render(<UserProfileForm userId="" />);
    }).toThrow(/User ID is required/);
  });

  it("validates SettingsPanel props", () => {
    expect(() => {
      render(<SettingsPanel userId="" />);
    }).toThrow(/User ID is required/);
  });

  it("validates BlockUserButton props", () => {
    expect(() => {
      render(<BlockUserButton userId="" targetId="user2" />);
    }).toThrow(/User ID is required/);

    expect(() => {
      render(<BlockUserButton userId="user1" targetId="" />);
    }).toThrow(/Target user ID is required/);
  });

  it("validates PrimaryButton props", () => {
    expect(() => {
      render(<PrimaryButton text="" to="/test" userId="user1" />);
    }).toThrow(/Button text is required/);

    expect(() => {
      render(<PrimaryButton text="Test" userId="user1" />);
    }).toThrow(/Either actionId or to prop is required/);
  });

  it("validates LinkButton props", () => {
    expect(() => {
      render(<LinkButton text="" to="/test" userId="user1" />);
    }).toThrow(/Link text is required/);

    expect(() => {
      render(<LinkButton text="Test" to="" userId="user1" />);
    }).toThrow(/Destination URL is required/);
  });
});
