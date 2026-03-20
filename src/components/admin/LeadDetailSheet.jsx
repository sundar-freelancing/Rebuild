
import {
    Phone,
    Trash2,
    Mail,
    Smartphone,
    MapPin,
    Clock,
    Link2,
    Tag,
    User,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { STATUS_CONFIG, STATUS_BADGE } from './leadConstants';

/* ─── Single detail row ─── */
const DetailRow = ({ icon, label, value }) => {
    const Icon = icon;
    return value ? (
        <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
            <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 wrap-break-word">{value}</p>
            </div>
        </div>
    ) : null;
};

/* ══════════════════════════════════════════════ */
const LeadDetailSheet = ({ lead, open, onOpenChange, onUpdateStatus, onDeleteRequest, isReadOnly }) => {
    if (!lead) return null;

    const badgeCls = STATUS_BADGE[lead.status] || STATUS_BADGE.Pending;
    const triggerCls = STATUS_CONFIG[lead.status] || STATUS_CONFIG.Pending;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">

                {/* ── Gradient header ── */}
                <div className="bg-linear-to-br from-primary/10 to-primary/5 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-white/10">
                    <SheetHeader>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-lg font-black select-none">
                                {lead.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <SheetTitle className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                    {lead.name}
                                </SheetTitle>
                                <SheetDescription className="text-xs text-slate-500 font-mono">
                                    ID: {lead.id}
                                </SheetDescription>
                            </div>
                        </div>
                        <span className={`self-start px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeCls}`}>
                            {lead.status || 'Pending'}
                        </span>
                    </SheetHeader>
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-5 space-y-5">

                    {/* Update Status */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Status</p>
                        <Select
                            value={lead.status || 'Pending'}
                            onValueChange={(val) => onUpdateStatus(lead.id, val)}
                            disabled={isReadOnly}
                        >
                            <SelectTrigger className={`w-full h-10 text-xs font-bold uppercase tracking-wide border border-transparent transition-all ${triggerCls} ${isReadOnly ? 'opacity-90 cursor-default' : ''}`}>
                                <SelectValue />
                            </SelectTrigger>
                            {!isReadOnly && (
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Pending" className="text-xs font-semibold">PENDING</SelectItem>
                                    <SelectItem value="Contacted" className="text-xs font-semibold">CONTACTED</SelectItem>
                                    <SelectItem value="Converted" className="text-xs font-semibold text-emerald-600">CONVERTED</SelectItem>
                                    <SelectItem value="DNP" className="text-xs font-semibold text-slate-500">DNP</SelectItem>
                                </SelectContent>
                            )}
                        </Select>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Contact Info</p>
                        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl px-4">
                            <DetailRow icon={User} label="Full Name" value={lead.name} />
                            <DetailRow icon={Mail} label="Email" value={lead.email} />
                            <DetailRow icon={Smartphone} label="Mobile" value={lead.mobile} />
                        </div>
                    </div>

                    {/* Lead Details */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Lead Details</p>
                        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl px-4">
                            <DetailRow icon={Tag} label="Source" value={lead.source} />
                            <DetailRow icon={MapPin} label="Goal" value={lead.goal} />
                            <DetailRow icon={Clock} label="Submitted" value={lead.createdAt?.toDate().toLocaleString()} />
                            <DetailRow icon={Link2} label="Captured From" value={lead.metadata?.url} />
                        </div>
                    </div>

                    {/* Message */}
                    {lead.message && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Message</p>
                            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4">
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{lead.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-1">
                        <a
                            href={`tel:${lead.mobile}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 font-bold text-sm rounded-xl transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Call Now
                        </a>
                        {!isReadOnly && (
                            <button
                                onClick={() => onDeleteRequest(lead)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-sm rounded-xl transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Lead
                            </button>
                        )}
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    );
};

export default LeadDetailSheet;
