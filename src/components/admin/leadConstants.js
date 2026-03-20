/**
 * Shared lead status constants.
 * Kept in a separate file so that LeadDetailSheet.jsx only exports components,
 * which is required for Vite Fast Refresh to work correctly.
 */

/** Tailwind classes used on the status Select trigger inside LeadDetailSheet */
export const STATUS_CONFIG = {
    Pending:   'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20',
    Contacted: 'bg-blue-500/10   text-blue-600   hover:bg-blue-500/20',
    Converted: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
    DNP:       'bg-slate-500/10  text-slate-600  hover:bg-slate-500/20',
};

/** Tailwind classes used for status badge pills */
export const STATUS_BADGE = {
    Pending:   'bg-orange-500/10  text-orange-600  border-orange-500/20',
    Contacted: 'bg-blue-500/10    text-blue-600    border-blue-500/20',
    Converted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    DNP:       'bg-slate-500/10   text-slate-600   border-slate-500/20',
};
