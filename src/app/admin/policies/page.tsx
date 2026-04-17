"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Save,
  RotateCcw,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface ProhibitedItem {
  id: string;
  name: string;
  reason: string;
}

interface DisclosureTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
}

interface CategoryFloor {
  id: string;
  category: string;
  floorPrice: string;
  lastUpdated: string;
  updatedBy: string;
}

const initialProhibitedItems: ProhibitedItem[] = [
  { id: "PI-001", name: "Ivory products", reason: "Federal/state wildlife protection laws" },
  { id: "PI-002", name: "Firearms & ammunition", reason: "Federal firearms regulations — FFL required" },
  { id: "PI-003", name: "Hazardous chemicals & materials", reason: "EPA/OSHA hazardous materials regulations" },
  { id: "PI-004", name: "Controlled pharmaceutical substances", reason: "DEA controlled substance scheduling" },
  { id: "PI-005", name: "Recalled consumer products", reason: "CPSC mandatory recall compliance" },
  { id: "PI-006", name: "Counterfeit goods", reason: "Federal trademark infringement laws" },
  { id: "PI-007", name: "Human remains & cultural artifacts", reason: "NAGPRA and international heritage laws" },
  { id: "PI-008", name: "Asbestos-containing materials", reason: "EPA asbestos regulations" },
];

const disclosureTemplates: DisclosureTemplate[] = [
  {
    id: "DT-001",
    name: "Standard Condition Disclosure",
    description: "Default disclosure for items in typical condition with minor wear",
    preview: "This item has been inspected and shows wear consistent with its age. Condition notes: [NOTES]. All sales are final. See our condition guide for grading details.",
  },
  {
    id: "DT-002",
    name: "As-Is / Damage Disclosure",
    description: "For items with significant damage or functional issues",
    preview: "This item is sold AS-IS with known condition issues: [DAMAGE_NOTES]. Please review all photos carefully. No returns accepted for disclosed conditions.",
  },
  {
    id: "DT-003",
    name: "Authentication Pending Disclosure",
    description: "For items awaiting or without authentication",
    preview: "Authentication status: [AUTH_STATUS]. This item has not been independently verified. Price reflects unverified attribution. Buyer assumes responsibility for further authentication.",
  },
];

const categoryFloors: CategoryFloor[] = [
  { id: "CF-001", category: "Fine Art", floorPrice: "$250.00", lastUpdated: "2026-04-01", updatedBy: "Catherine R." },
  { id: "CF-002", category: "Furniture", floorPrice: "$75.00", lastUpdated: "2026-03-15", updatedBy: "Catherine R." },
  { id: "CF-003", category: "Watches & Jewelry", floorPrice: "$150.00", lastUpdated: "2026-04-10", updatedBy: "Catherine R." },
  { id: "CF-004", category: "Silver", floorPrice: "$50.00", lastUpdated: "2026-03-01", updatedBy: "David C." },
  { id: "CF-005", category: "Rugs & Textiles", floorPrice: "$100.00", lastUpdated: "2026-02-20", updatedBy: "Catherine R." },
  { id: "CF-006", category: "Ceramics & Glass", floorPrice: "$25.00", lastUpdated: "2026-03-10", updatedBy: "David C." },
  { id: "CF-007", category: "Books & Ephemera", floorPrice: "$15.00", lastUpdated: "2026-01-15", updatedBy: "Catherine R." },
  { id: "CF-008", category: "Musical Instruments", floorPrice: "$100.00", lastUpdated: "2026-03-25", updatedBy: "David C." },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PoliciesPage() {
  const [prohibitedItems, setProhibitedItems] = useState(initialProhibitedItems);
  const [newItemName, setNewItemName] = useState("");
  const [newItemReason, setNewItemReason] = useState("");
  const [editingFloor, setEditingFloor] = useState<string | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState<string | null>(null);

  const versionNumber = "v3.7";

  const addProhibitedItem = () => {
    if (newItemName.trim() && newItemReason.trim()) {
      const newItem: ProhibitedItem = {
        id: `PI-${String(prohibitedItems.length + 1).padStart(3, "0")}`,
        name: newItemName.trim(),
        reason: newItemReason.trim(),
      };
      setProhibitedItems([...prohibitedItems, newItem]);
      setNewItemName("");
      setNewItemReason("");
    }
  };

  const removeProhibitedItem = (id: string) => {
    setProhibitedItems(prohibitedItems.filter((item) => item.id !== id));
  };

  return (
    <AppShell role="admin" userName="Catherine Reynolds" orgName="Administration">
<div className="flex flex-1">
<main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Heading */}
          <h1
            className="text-2xl md:text-3xl text-onyx"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Policies &amp; Configuration
          </h1>

          {/* Prohibited Items List */}
          <section className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg text-onyx" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Prohibited Items List
                </h2>
                <span className="inline-flex items-center rounded-full bg-sapphire/15 px-2 py-0.5 text-xs font-medium text-sapphire">
                  {versionNumber}
                </span>
              </div>
              <span className="text-xs text-pewter">{prohibitedItems.length} items</span>
            </div>
            <div className="space-y-2 mb-4">
              {prohibitedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-cream px-4 py-3"
                >
                  <div>
                    <span className="text-sm font-medium text-charcoal">{item.name}</span>
                    <span className="text-xs text-pewter ml-2">- {item.reason}</span>
                  </div>
                  <button
                    onClick={() => removeProhibitedItem(item.id)}
                    className="p-1.5 rounded-md text-silver hover:text-ruby hover:bg-ruby-muted transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name..."
                className="flex-1 rounded-lg border border-border/60 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              />
              <input
                type="text"
                value={newItemReason}
                onChange={(e) => setNewItemReason(e.target.value)}
                placeholder="Reason..."
                className="flex-1 rounded-lg border border-border/60 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              />
              <button
                onClick={addProhibitedItem}
                className="inline-flex items-center gap-1 rounded-lg bg-sapphire px-3 py-2 text-sm font-medium text-white hover:bg-sapphire-light transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </section>

          {/* Disclosure Templates */}
          <section className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Disclosure Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {disclosureTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-lg border border-border/60 p-4 hover:border-sapphire/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-charcoal">{template.name}</h3>
                    <div className="flex gap-1">
                      <button className="p-1 rounded text-silver hover:text-sapphire transition-colors">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setShowTemplatePreview(showTemplatePreview === template.id ? null : template.id)}
                        className="p-1 rounded text-silver hover:text-sapphire transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-pewter mb-3">{template.description}</p>
                  {showTemplatePreview === template.id && (
                    <div className="rounded-md bg-cream border border-border/40 p-3 text-xs text-pewter leading-relaxed">
                      {template.preview}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Category Price Floors */}
          <section className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="p-6 pb-0">
              <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Category Price Floors
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ivory">
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Category</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Floor Price</th>
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Last Updated</th>
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Updated By</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {categoryFloors.map((floor) => (
                    <tr key={floor.id} className="hover:bg-ivory/50 transition-colors">
                      <td className="p-3 font-medium text-charcoal">{floor.category}</td>
                      <td className="p-3 text-right">
                        {editingFloor === floor.id ? (
                          <input
                            type="text"
                            defaultValue={floor.floorPrice}
                            className="w-24 rounded-md border border-border/60 bg-cream px-2 py-1 text-right text-sm text-charcoal focus:border-sapphire focus:outline-none"
                            onBlur={() => setEditingFloor(null)}
                          />
                        ) : (
                          <span className="tabular-nums font-medium text-charcoal">{floor.floorPrice}</span>
                        )}
                      </td>
                      <td className="p-3 text-pewter">{floor.lastUpdated}</td>
                      <td className="p-3 text-pewter">{floor.updatedBy}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setEditingFloor(editingFloor === floor.id ? null : floor.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-sapphire hover:text-sapphire-light transition-colors"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Save / Revert */}
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-sapphire px-5 py-2.5 text-sm font-semibold text-white hover:bg-sapphire-light transition-colors">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-white px-5 py-2.5 text-sm font-medium text-pewter hover:bg-ivory transition-colors">
              <RotateCcw className="h-4 w-4" />
              Revert
            </button>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
