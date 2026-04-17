"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import {
  Handshake,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Filter,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type PartnerType = "realtor" | "probate_attorney" | "senior_specialist" | "mover" | "storage" | "other";
type PartnerStatus = "active" | "inactive" | "pending";

interface Partner {
  id: string;
  name: string;
  company: string;
  type: PartnerType;
  referrals: number;
  converted: number;
  commissionRate: string;
  status: PartnerStatus;
  email: string;
  phone: string;
  joinedDate: string;
  totalEarned: string;
}

const partnerTypeBadge: Record<PartnerType, { bg: string; text: string; label: string }> = {
  realtor: { bg: "bg-sapphire/15", text: "text-sapphire", label: "Realtor" },
  probate_attorney: { bg: "bg-amethyst/15", text: "text-amethyst", label: "Probate Attorney" },
  senior_specialist: { bg: "bg-emerald/15", text: "text-emerald", label: "Senior Specialist" },
  mover: { bg: "bg-gold-tone/15", text: "text-gold-tone", label: "Mover" },
  storage: { bg: "bg-ruby/15", text: "text-ruby", label: "Storage" },
  other: { bg: "bg-silver/15", text: "text-pewter", label: "Other" },
};

const mockPartners: Partner[] = [
  { id: "PTR-001", name: "Robert Hargreaves", company: "Hargreaves Realty Group", type: "realtor", referrals: 32, converted: 24, commissionRate: "5%", status: "active", email: "r.hargreaves@realtypartners.com", phone: "(555) 234-5678", joinedDate: "2025-08-15", totalEarned: "$8,640" },
  { id: "PTR-002", name: "Elena Vasquez", company: "Vasquez & Associates Law", type: "probate_attorney", referrals: 18, converted: 14, commissionRate: "6%", status: "active", email: "elena@vasquezlaw.com", phone: "(555) 345-6789", joinedDate: "2025-10-01", totalEarned: "$6,120" },
  { id: "PTR-003", name: "Michael Chen", company: "Golden Years Transitions", type: "senior_specialist", referrals: 24, converted: 18, commissionRate: "5%", status: "active", email: "m.chen@goldenyears.com", phone: "(555) 456-7890", joinedDate: "2025-09-12", totalEarned: "$4,320" },
  { id: "PTR-004", name: "Jennifer Knox", company: "Knox Moving & Storage", type: "mover", referrals: 12, converted: 8, commissionRate: "4%", status: "active", email: "jen@knoxmoving.com", phone: "(555) 567-8901", joinedDate: "2025-11-20", totalEarned: "$2,160" },
  { id: "PTR-005", name: "David Okonkwo", company: "SecureStore Facilities", type: "storage", referrals: 8, converted: 5, commissionRate: "4%", status: "active", email: "dokonkwo@securestore.com", phone: "(555) 678-9012", joinedDate: "2026-01-05", totalEarned: "$1,350" },
  { id: "PTR-006", name: "Amanda Sterling", company: "Sterling Estate Solutions", type: "realtor", referrals: 15, converted: 11, commissionRate: "5%", status: "active", email: "amanda@sterlingestates.com", phone: "(555) 789-0123", joinedDate: "2026-02-14", totalEarned: "$3,960" },
  { id: "PTR-007", name: "Thomas Whitfield", company: "Whitfield Legal", type: "probate_attorney", referrals: 6, converted: 3, commissionRate: "6%", status: "pending", email: "t.whitfield@whitfieldlegal.com", phone: "(555) 890-1234", joinedDate: "2026-04-01", totalEarned: "$810" },
  { id: "PTR-008", name: "Linda Park", company: "Park & Associates", type: "other", referrals: 4, converted: 2, commissionRate: "3%", status: "inactive", email: "l.park@parkassoc.com", phone: "(555) 901-2345", joinedDate: "2025-07-20", totalEarned: "$540" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PartnerManagementPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<PartnerType | "all">("all");

  const filteredPartners = filterType === "all"
    ? mockPartners
    : mockPartners.filter((p) => p.type === filterType);

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
              Partner Management
            </h1>
            <button className="inline-flex items-center gap-2 rounded-lg bg-sapphire px-4 py-2.5 text-sm font-semibold text-white hover:bg-sapphire-light transition-colors">
              <UserPlus className="h-4 w-4" />
              Add Partner
            </button>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-pewter" />
            <span className="text-sm text-pewter">Filter by type:</span>
            <div className="flex flex-wrap gap-1">
              {(["all", "realtor", "probate_attorney", "senior_specialist", "mover", "storage", "other"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    filterType === type
                      ? "bg-sapphire text-white"
                      : "bg-white border border-border/60 text-pewter hover:border-sapphire/30"
                  )}
                >
                  {type === "all" ? "All" : partnerTypeBadge[type]?.label ?? type}
                </button>
              ))}
            </div>
          </div>

          {/* Partners Table */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ivory">
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Name</th>
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Company</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Type</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Referrals</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Converted</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Commission</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Status</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPartners.map((partner) => {
                    const typeStyle = partnerTypeBadge[partner.type];
                    const isExpanded = expandedId === partner.id;

                    return (
                      <>
                        <tr key={partner.id} className="hover:bg-ivory/50 transition-colors">
                          <td className="p-3 font-medium text-charcoal">{partner.name}</td>
                          <td className="p-3 text-pewter">{partner.company}</td>
                          <td className="p-3 text-center">
                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", typeStyle.bg, typeStyle.text)}>
                              {typeStyle.label}
                            </span>
                          </td>
                          <td className="p-3 text-right tabular-nums text-charcoal">{partner.referrals}</td>
                          <td className="p-3 text-right tabular-nums text-charcoal">{partner.converted}</td>
                          <td className="p-3 text-right text-charcoal">{partner.commissionRate}</td>
                          <td className="p-3 text-center">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                                partner.status === "active"
                                  ? "bg-emerald/15 text-emerald"
                                  : partner.status === "pending"
                                  ? "bg-gold-tone/15 text-gold-tone"
                                  : "bg-silver/15 text-pewter"
                              )}
                            >
                              {partner.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : partner.id)}
                              className="p-1 rounded text-pewter hover:text-charcoal transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${partner.id}-detail`}>
                            <td colSpan={8} className="bg-cream p-5">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-charcoal">Contact</h4>
                                  <div className="flex items-center gap-2 text-sm text-pewter">
                                    <Mail className="h-3.5 w-3.5" />
                                    {partner.email}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-pewter">
                                    <Phone className="h-3.5 w-3.5" />
                                    {partner.phone}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-pewter">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {partner.company}
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-charcoal">Performance</h4>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <span className="text-xs text-silver">Conversion Rate</span>
                                      <p className="font-medium text-charcoal">
                                        {partner.referrals > 0 ? Math.round((partner.converted / partner.referrals) * 100) : 0}%
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-silver">Total Earned</span>
                                      <p className="font-medium text-charcoal">{partner.totalEarned}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-charcoal">Details</h4>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <span className="text-xs text-silver">Joined</span>
                                      <p className="font-medium text-charcoal">{partner.joinedDate}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-silver">Commission Rate</span>
                                      <p className="font-medium text-charcoal">{partner.commissionRate}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
