"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import {
  Users,
  UserPlus,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit3,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type UserRole = "admin" | "ops" | "qa" | "customer" | "partner";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  lastActive: string;
}

interface AuditAction {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

const roleBadgeStyles: Record<UserRole, { bg: string; text: string }> = {
  admin: { bg: "bg-ruby/15", text: "text-ruby" },
  ops: { bg: "bg-sapphire/15", text: "text-sapphire" },
  qa: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  customer: { bg: "bg-emerald/15", text: "text-emerald" },
  partner: { bg: "bg-amethyst/15", text: "text-amethyst" },
};

const mockUsers: AppUser[] = [
  { id: "USR-001", name: "Catherine Reynolds", email: "c.reynolds@estateliquidity.com", role: "admin", status: "active", lastActive: "2026-04-17 09:42 AM" },
  { id: "USR-002", name: "David Chen", email: "d.chen@estateliquidity.com", role: "ops", status: "active", lastActive: "2026-04-17 10:15 AM" },
  { id: "USR-003", name: "Sarah Mitchell", email: "s.mitchell@estateliquidity.com", role: "qa", status: "active", lastActive: "2026-04-17 08:30 AM" },
  { id: "USR-004", name: "James Kimball", email: "j.kimball@estateliquidity.com", role: "qa", status: "active", lastActive: "2026-04-16 05:45 PM" },
  { id: "USR-005", name: "Margaret Thornton", email: "m.thornton@example.com", role: "customer", status: "active", lastActive: "2026-04-15 02:20 PM" },
  { id: "USR-006", name: "Robert Hargreaves", email: "r.hargreaves@realtypartners.com", role: "partner", status: "active", lastActive: "2026-04-14 11:00 AM" },
  { id: "USR-007", name: "Laura Prescott", email: "l.prescott@estateliquidity.com", role: "ops", status: "inactive", lastActive: "2026-03-28 03:15 PM" },
  { id: "USR-008", name: "Thomas Whitfield", email: "t.whitfield@example.com", role: "customer", status: "suspended", lastActive: "2026-04-10 09:00 AM" },
];

const recentAuditActions: AuditAction[] = [
  { id: "AUD-001", actor: "Catherine Reynolds", action: "Changed role", target: "Laura Prescott (ops -> inactive)", timestamp: "2026-04-16 04:30 PM" },
  { id: "AUD-002", actor: "Catherine Reynolds", action: "Suspended user", target: "Thomas Whitfield", timestamp: "2026-04-15 11:20 AM" },
  { id: "AUD-003", actor: "Catherine Reynolds", action: "Invited user", target: "James Kimball (qa)", timestamp: "2026-04-12 09:15 AM" },
  { id: "AUD-004", actor: "David Chen", action: "Updated permissions", target: "Sarah Mitchell — added prohibited-item-override", timestamp: "2026-04-10 02:40 PM" },
  { id: "AUD-005", actor: "Catherine Reynolds", action: "Reset password", target: "Robert Hargreaves", timestamp: "2026-04-08 10:00 AM" },
];

const permissions = [
  { key: "manage_users", label: "Manage Users", admin: true, ops: false, qa: false, customer: false, partner: false },
  { key: "manage_policies", label: "Manage Policies", admin: true, ops: false, qa: false, customer: false, partner: false },
  { key: "view_analytics", label: "View Analytics", admin: true, ops: true, qa: false, customer: false, partner: false },
  { key: "manage_channels", label: "Manage Channels", admin: true, ops: true, qa: false, customer: false, partner: false },
  { key: "qa_review", label: "QA Review", admin: true, ops: false, qa: true, customer: false, partner: false },
  { key: "approve_pricing", label: "Approve Pricing", admin: true, ops: false, qa: true, customer: false, partner: false },
  { key: "flag_prohibited", label: "Flag Prohibited", admin: true, ops: true, qa: true, customer: false, partner: false },
  { key: "submit_referrals", label: "Submit Referrals", admin: false, ops: false, qa: false, customer: false, partner: true },
  { key: "view_portal", label: "View Portal", admin: true, ops: true, qa: true, customer: true, partner: true },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function UserManagementPage() {
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar userName="Catherine Reynolds" role="admin" />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Heading */}
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl md:text-3xl text-onyx"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              User Management
            </h1>
            <button className="inline-flex items-center gap-2 rounded-lg bg-sapphire px-4 py-2.5 text-sm font-semibold text-white hover:bg-sapphire-light transition-colors">
              <UserPlus className="h-4 w-4" />
              Invite User
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ivory">
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Name</th>
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Email</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Role</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Status</th>
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Last Active</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockUsers.map((user) => {
                    const roleStyle = roleBadgeStyles[user.role];
                    const isEditing = editingRole === user.id;
                    return (
                      <tr key={user.id} className="hover:bg-ivory/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sapphire flex items-center justify-center text-white text-xs font-semibold shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-charcoal">{user.name}</div>
                              <div className="text-xs text-pewter">{user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-pewter">{user.email}</td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <select
                              defaultValue={user.role}
                              onBlur={() => setEditingRole(null)}
                              className="rounded-md border border-border/60 bg-cream px-2 py-1 text-xs text-charcoal focus:border-sapphire focus:outline-none"
                            >
                              <option value="admin">Admin</option>
                              <option value="ops">Ops</option>
                              <option value="qa">QA</option>
                              <option value="customer">Customer</option>
                              <option value="partner">Partner</option>
                            </select>
                          ) : (
                            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", roleStyle.bg, roleStyle.text)}>
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                              user.status === "active"
                                ? "bg-emerald/15 text-emerald"
                                : user.status === "inactive"
                                ? "bg-silver/15 text-pewter"
                                : "bg-ruby/15 text-ruby"
                            )}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3 text-pewter text-sm">{user.lastActive}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setEditingRole(isEditing ? null : user.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-sapphire hover:text-sapphire-light transition-colors"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit Role
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <button
              onClick={() => setShowPermissions(!showPermissions)}
              className="w-full flex items-center justify-between p-4 text-sm font-medium text-charcoal hover:bg-ivory/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-sapphire" />
                <span>Permission Matrix</span>
              </div>
              {showPermissions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showPermissions && (
              <div className="border-t border-border/60 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ivory">
                      <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Permission</th>
                      {(["admin", "ops", "qa", "customer", "partner"] as UserRole[]).map((role) => {
                        const s = roleBadgeStyles[role];
                        return (
                          <th key={role} className="text-center p-3">
                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", s.bg, s.text)}>
                              {role}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {permissions.map((perm) => (
                      <tr key={perm.key} className="hover:bg-ivory/50">
                        <td className="p-3 text-charcoal font-medium">{perm.label}</td>
                        {(["admin", "ops", "qa", "customer", "partner"] as UserRole[]).map((role) => (
                          <td key={role} className="p-3 text-center">
                            {perm[role] ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald/15">
                                <span className="w-2 h-2 rounded-full bg-emerald" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-platinum/30">
                                <span className="w-2 h-2 rounded-full bg-platinum" />
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sensitive Action Audit Trail */}
          <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-sapphire" />
              <h2 className="text-lg text-onyx" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Recent Sensitive Actions
              </h2>
            </div>
            <div className="space-y-3">
              {recentAuditActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start gap-3 border-l-2 border-sapphire/20 pl-4 py-1"
                >
                  <div className="flex-1">
                    <p className="text-sm text-charcoal">
                      <span className="font-medium">{action.actor}</span>{" "}
                      <span className="text-pewter">{action.action}:</span>{" "}
                      {action.target}
                    </p>
                    <p className="text-xs text-silver mt-0.5">{action.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
