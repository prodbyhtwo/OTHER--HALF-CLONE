import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Copy,
  Trash2,
  Ban,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Mail,
  Globe,
} from "lucide-react";
import { useLoggedHandlers } from "@/components/ActionLoggerProvider";

interface SystemSettings {
  invite_only_mode: boolean;
  invite_requirements: {
    email_domain_whitelist: string[];
    must_supply_invite_key: boolean;
  };
}

interface Invite {
  id: string;
  code: string;
  email?: string | null;
  domain?: string | null;
  max_uses: number;
  uses: number;
  expires_at?: string | null;
  status: "active" | "revoked" | "expired";
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function AdminInvites() {
  const { createClickHandler, createSubmitHandler } = useLoggedHandlers();

  // State
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create invite dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    domain: "",
    max_uses: 1,
    expires_at: "",
    notes: "",
  });
  const [creating, setCreating] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load settings and invites in parallel
      const [settingsRes, invitesRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/invites"),
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }

      if (invitesRes.ok) {
        const invitesData = await invitesRes.json();
        setInvites(invitesData);
      }
    } catch (error) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onAdminToggleInviteOnly = createSubmitHandler(
    "toggle_invite_only",
    async (enabled: boolean) => {
      try {
        const response = await fetch("/api/settings/invite-only-mode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled }),
        });

        if (response.ok) {
          setSettings((prev) =>
            prev ? { ...prev, invite_only_mode: enabled } : null,
          );
          setSuccess(`Invite-only mode ${enabled ? "enabled" : "disabled"}`);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to update settings");
        }
      } catch (error) {
        setError("Network error");
      }
    },
  );

  const onAdminCreateInvite = createSubmitHandler(
    "create_invite",
    async (formData: typeof createForm) => {
      setCreating(true);
      setError("");

      try {
        const payload: any = {
          max_uses: formData.max_uses,
          notes: formData.notes,
        };

        if (formData.email) payload.email = formData.email;
        if (formData.domain) payload.domain = formData.domain;
        if (formData.expires_at)
          payload.expires_at = new Date(formData.expires_at).toISOString();

        const response = await fetch("/api/invites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const newInvite = await response.json();
          setInvites((prev) => [newInvite, ...prev]);
          setShowCreateDialog(false);
          setCreateForm({
            email: "",
            domain: "",
            max_uses: 1,
            expires_at: "",
            notes: "",
          });
          setSuccess(`Invite ${newInvite.code} created successfully`);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to create invite");
        }
      } catch (error) {
        setError("Network error");
      } finally {
        setCreating(false);
      }
    },
  );

  const onAdminCopyInviteLink = createClickHandler(
    "copy_invite_link",
    "button",
    async (inviteId: string) => {
      try {
        const response = await fetch(`/api/invites/${inviteId}/link`);
        if (response.ok) {
          const data = await response.json();
          await navigator.clipboard.writeText(data.invite_link);
          setSuccess("Invite link copied to clipboard");
        }
      } catch (error) {
        setError("Failed to copy invite link");
      }
    },
  );

  const onAdminRevokeInvite = createClickHandler(
    "revoke_invite",
    "button",
    async (inviteId: string) => {
      try {
        const response = await fetch(`/api/invites/${inviteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "revoked" }),
        });

        if (response.ok) {
          setInvites((prev) =>
            prev.map((inv) =>
              inv.id === inviteId
                ? { ...inv, status: "revoked" as const }
                : inv,
            ),
          );
          setSuccess("Invite revoked successfully");
        }
      } catch (error) {
        setError("Failed to revoke invite");
      }
    },
  );

  const deleteInvite = createClickHandler(
    "delete_invite",
    "button",
    async (inviteId: string) => {
      if (
        !confirm(
          "Are you sure you want to delete this invite? This action cannot be undone.",
        )
      ) {
        return;
      }

      try {
        const response = await fetch(`/api/invites/${inviteId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
          setSuccess("Invite deleted successfully");
        }
      } catch (error) {
        setError("Failed to delete invite");
      }
    },
  );

  const getStatusBadge = (invite: Invite) => {
    if (invite.status === "revoked") {
      return (
        <Badge variant="destructive">
          <Ban className="w-3 h-3 mr-1" />
          Revoked
        </Badge>
      );
    }
    if (invite.status === "expired") {
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    }
    if (invite.uses >= invite.max_uses) {
      return (
        <Badge variant="secondary">
          <CheckCircle className="w-3 h-3 mr-1" />
          Used Up
        </Badge>
      );
    }
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="default">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9610FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Invite Management
            </h1>
            <p className="text-gray-600">
              Manage invite-only access and invitations
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#9610FF] hover:bg-[#8A0FE6]"
                data-action="click_create_invite"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Invite</DialogTitle>
                <DialogDescription>
                  Create a new invitation with optional restrictions and limits.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAdminCreateInvite(createForm);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@church.org"
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      data-action="input_invite_email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain (optional)</Label>
                    <Input
                      id="domain"
                      placeholder="church.org"
                      value={createForm.domain}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          domain: e.target.value,
                        }))
                      }
                      data-action="input_invite_domain"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_uses">Max Uses</Label>
                    <Select
                      value={createForm.max_uses.toString()}
                      onValueChange={(value) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          max_uses: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger data-action="select_max_uses">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Single use</SelectItem>
                        <SelectItem value="5">5 uses</SelectItem>
                        <SelectItem value="10">10 uses</SelectItem>
                        <SelectItem value="25">25 uses</SelectItem>
                        <SelectItem value="100">100 uses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires_at">Expires (optional)</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={createForm.expires_at}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          expires_at: e.target.value,
                        }))
                      }
                      data-action="input_invite_expiry"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about this invite..."
                    value={createForm.notes}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={3}
                    data-action="input_invite_notes"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={creating}
                    data-action="submit_create_invite"
                  >
                    {creating ? "Creating..." : "Create Invite"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure invite-only mode and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Invite-Only Mode</Label>
                <p className="text-sm text-gray-600">
                  When enabled, only users with valid invites can sign up
                </p>
              </div>
              <Switch
                checked={settings?.invite_only_mode || false}
                onCheckedChange={onAdminToggleInviteOnly}
                data-action="toggle_invite_only_mode"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invites Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Invitations ({invites.length})
            </CardTitle>
            <CardDescription>
              Manage all invitation codes and their usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Restrictions</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No invites created yet. Create your first invite to get
                        started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="font-mono font-medium">
                          {invite.code}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {invite.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-3 h-3 mr-1" />
                                {invite.email}
                              </div>
                            )}
                            {invite.domain && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Globe className="w-3 h-3 mr-1" />@
                                {invite.domain}
                              </div>
                            )}
                            {invite.expires_at && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-3 h-3 mr-1" />
                                Expires {formatDate(invite.expires_at)}
                              </div>
                            )}
                            {!invite.email &&
                              !invite.domain &&
                              !invite.expires_at && (
                                <span className="text-sm text-gray-500">
                                  No restrictions
                                </span>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {invite.uses} / {invite.max_uses}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(invite)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(invite.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onAdminCopyInviteLink(invite.id)}
                              data-action="click_copy_invite_link"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            {invite.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAdminRevokeInvite(invite.id)}
                                data-action="click_revoke_invite"
                              >
                                <Ban className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteInvite(invite.id)}
                              data-action="click_delete_invite"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
