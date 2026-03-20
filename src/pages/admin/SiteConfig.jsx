import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import {
    AlertCircle,
    CheckCircle2,
    Link2,
    Loader2,
    Mail, MapPin, MessageCircle,
    Phone,
    Plus,
    Save,
    Trash2,
    User,
    Edit2,
    X,
    Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';

/* ─── tiny helpers ──────────────────────────────────────────── */
const Toast = ({ type, msg, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
    const isOk = type === 'success';
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 ${isOk ? 'bg-emerald-600' : 'bg-red-500'}`}>
            {isOk ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            {msg}
        </div>
    );
};

const SectionCard = ({ icon, title, children }) => {
    const Icon = icon;
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
            </div>
            <div className="p-6 space-y-4">{children}</div>
        </div>
    )
};

const FieldLabel = ({ label, sublabel }) => (
    <div className="mb-1.5">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
        {sublabel && <p className="text-[11px] text-slate-400 mt-0.5">{sublabel}</p>}
    </div>
);

const inputCls = "w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed";

/* ─── Multi-value row (phones / emails) ─────────────────────── */
const MultiField = ({ values, onChange, placeholder, type = 'text', isEditing }) => {
    const add = () => onChange([...values, '']);
    const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
    const update = (i, v) => onChange(values.map((x, idx) => (idx === i ? v : x)));

    return (
        <div className="space-y-2">
            {values.map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                    {i === 0 && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                            Primary
                        </span>
                    )}
                    <input
                        type={type}
                        value={val}
                        disabled={!isEditing}
                        onChange={(e) => {
                            if (type === 'tel') {
                                let v = e.target.value.replace(/\D/g, '').slice(0, 10);
                                if (v.length > 5) v = `${v.slice(0, 5)} ${v.slice(5)}`;
                                update(i, v);
                            } else {
                                update(i, e.target.value);
                            }
                        }}
                        placeholder={placeholder}
                        className={`${inputCls} flex-1`}
                    />
                    {values.length > 1 && isEditing && (
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                            title="Remove"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
            {isEditing && (
                <button
                    type="button"
                    onClick={add}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mt-1"
                >
                    <Plus className="w-3.5 h-3.5" /> Add another
                </button>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const SiteConfig = () => {
    const { siteConfig, setSiteConfig } = useAdminStore();
    const profile = useAuthStore(s => s.profile);
    const isReadOnly = profile?.role === 'Viewer';

    const getPreparedConfig = (d) => ({
        whatsappNumber: d?.whatsappNumber ?? '',
        officeAddress: d?.officeAddress ?? '',
        officeHours: Array.isArray(d?.officeHours) && d.officeHours.length
            ? d.officeHours
            : d?.officeHour ? [d.officeHour] : [''],
        mapEmbedUrl: d?.mapEmbedUrl ?? '',
        ceoName: d?.ceoName ?? '',
        ceoPictureUrl: d?.ceoPictureUrl ?? '',
        ceoSignUrl: d?.ceoSignUrl ?? '',
        contactEmails: Array.isArray(d?.contactEmails) && d.contactEmails.length
            ? d.contactEmails
            : d?.contactEmail ? [d.contactEmail] : [''],
        contactPhones: Array.isArray(d?.contactPhones) && d.contactPhones.length
            ? d.contactPhones
            : d?.contactPhone ? [d.contactPhone] : [''],
    });

    const [form, setForm] = useState(() => getPreparedConfig(siteConfig));
    const [originalForm, setOriginalForm] = useState(() => getPreparedConfig(siteConfig));
    const [isEditing, setIsEditing] = useState(false);

    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    /* ─ Sync if store config changes from outside ─ */
    useEffect(() => {
        if (!isEditing && siteConfig) {
            const prepared = getPreparedConfig(siteConfig);
            setForm(prepared);
            setOriginalForm(prepared);
        }
    }, [siteConfig, isEditing]);

    const field = (key) => ({
        value: form[key],
        disabled: !isEditing,
        onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
    });

    const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

    const handleSave = async () => {
        if (!hasChanges || isReadOnly) return;

        const emailsToVerify = form.contactEmails.filter(Boolean);
        if (emailsToVerify.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const invalidEmails = emailsToVerify.filter(e => !emailRegex.test(e));
            if (invalidEmails.length > 0) {
                setToast({ type: 'error', msg: 'Please enter valid email addresses.' });
                return;
            }
        }

        setSaving(true);
        try {
            const updatedConfig = {
                ...form,
                contactEmails: form.contactEmails.filter(Boolean),
                contactPhones: form.contactPhones.filter(Boolean),
                officeHours: form.officeHours.filter(Boolean),
                updatedAt: new Date(),
            };
            await setDoc(doc(db, 'siteConfig', 'main'), updatedConfig, { merge: true });
            
            setSiteConfig(updatedConfig);
            setOriginalForm(form);
            setIsEditing(false);
            setToast({ type: 'success', msg: 'Site config saved successfully!' });
        } catch (err) {
            console.error(err);
            setToast({ type: 'error', msg: 'Save failed. Check console.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Site Configuration
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage contact details, map, WhatsApp, and CEO profile shown on the live site.
                    </p>
                </div>
                <div className="flex gap-3">
                    {!isEditing && !isReadOnly ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 rounded-xl shadow-lg shadow-primary/20 px-6"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Configuration
                        </Button>
                    ) : isEditing ? (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setForm(originalForm);
                                    setIsEditing(false);
                                }}
                                className="rounded-xl px-4 flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                                className="flex items-center gap-2 rounded-xl shadow-lg shadow-primary/20 px-6"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving…' : 'Save Changes'}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── Contact Phones ── */}
                <SectionCard icon={Phone} title="Contact Phone Numbers">
                    <FieldLabel
                        label="Phone Numbers"
                        sublabel="The first number is shown publicly as the primary contact."
                    />
                    <MultiField
                        values={form.contactPhones}
                        onChange={(v) => setForm(f => ({ ...f, contactPhones: v }))}
                        placeholder="98765 43210"
                        type="tel"
                        isEditing={isEditing}
                    />
                </SectionCard>

                {/* ── Contact Emails ── */}
                <SectionCard icon={Mail} title="Contact Email Addresses">
                    <FieldLabel
                        label="Email Addresses"
                        sublabel="The first email is shown publicly as the primary contact."
                    />
                    <MultiField
                        values={form.contactEmails}
                        onChange={(v) => setForm(f => ({ ...f, contactEmails: v }))}
                        placeholder="hello@rebuildit.com"
                        type="email"
                        isEditing={isEditing}
                    />
                </SectionCard>

                {/* ── WhatsApp ── */}
                <SectionCard icon={MessageCircle} title="WhatsApp Number">
                    <FieldLabel
                        label="WhatsApp Number (with country code, no +)"
                        sublabel='Example: 919876543210 (for +91 98765 43210)'
                    />
                    <input
                        type="tel"
                        placeholder="98765 43210"
                        className={inputCls}
                        value={form.whatsappNumber}
                        disabled={!isEditing}
                        onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 10);
                            if (v.length > 5) v = `${v.slice(0, 5)} ${v.slice(5)}`;
                            setForm(f => ({ ...f, whatsappNumber: v }));
                        }}
                    />
                </SectionCard>

                {/* ── Office Address & Hours ── */}
                <SectionCard icon={MapPin} title="Office Address & Hours">
                    <div className="space-y-4">
                        <div>
                            <FieldLabel label="Full Office Address" sublabel="Shown on the Contact page and Footer." />
                            <textarea
                                rows={3}
                                placeholder="123 Business Ave, Bangalore, India"
                                className={`${inputCls} resize-none`}
                                value={form.officeAddress}
                                disabled={!isEditing}
                                onChange={(e) => setForm(f => ({ ...f, officeAddress: e.target.value }))}
                            />
                        </div>
                        <div>
                            <FieldLabel label="Office Hours" sublabel="Add your business hours line by line" />
                            <MultiField
                                values={form.officeHours || ['']}
                                onChange={(v) => setForm(f => ({ ...f, officeHours: v }))}
                                placeholder="Mon-Sat 9:00 AM - 6:00 PM"
                                type="text"
                                isEditing={isEditing}
                            />
                        </div>
                    </div>
                </SectionCard>

                {/* ── Map Embed URL ── */}
                <SectionCard icon={Link2} title="Google Maps Embed URL">
                    <FieldLabel
                        label="Embed URL"
                        sublabel='Go to Google Maps → Share → Embed a map → copy the src="…" value.'
                    />
                    <textarea
                        rows={3}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        className={`${inputCls} resize-none font-mono text-xs`}
                        value={form.mapEmbedUrl}
                        disabled={!isEditing}
                        onChange={(e) => setForm(f => ({ ...f, mapEmbedUrl: e.target.value }))}
                    />
                    {form.mapEmbedUrl && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                            <iframe
                                src={form.mapEmbedUrl}
                                width="100%"
                                height="180"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Map preview"
                            />
                        </div>
                    )}
                </SectionCard>

                {/* ── CEO Profile ── */}
                <SectionCard icon={User} title="CEO / Instructor Profile">
                    <FieldLabel label="CEO / Instructor Name" />
                    <input
                        type="text"
                        placeholder="John Doe"
                        className={inputCls}
                        {...field('ceoName')}
                    />

                    <div className="space-y-4 mt-4">
                        <div>
                            <FieldLabel
                                label="CEO Picture Profile URL"
                                sublabel="Paste the URL of the CEO picture"
                            />
                            <div className="flex items-center gap-4 mt-2">
                                {form.ceoPictureUrl ? (
                                    <img
                                        src={form.ceoPictureUrl}
                                        alt="CEO"
                                        className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/30 shadow-md shrink-0 bg-white"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                        <User className="w-6 h-6 text-slate-400" />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="https://example.com/ceo-picture.png"
                                    className={inputCls}
                                    {...field('ceoPictureUrl')}
                                />
                            </div>
                        </div>

                        <hr className="border-slate-100 dark:border-white/10" />

                        <div>
                            <FieldLabel
                                label="CEO Signature URL"
                                sublabel="Paste the URL of the CEO signature image"
                            />
                            <div className="flex items-center gap-4 mt-2">
                                {form.ceoSignUrl ? (
                                    <img
                                        src={form.ceoSignUrl}
                                        alt="CEO Signature"
                                        className="h-12 w-auto object-contain shrink-0"
                                    />
                                ) : (
                                    <div className="h-12 w-24 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                        <span className="text-xs text-slate-400">No Signature</span>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="https://example.com/ceo-sign.png"
                                    className={inputCls}
                                    {...field('ceoSignUrl')}
                                />
                            </div>
                        </div>
                    </div>

                </SectionCard>

            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    type={toast.type}
                    msg={toast.msg}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default SiteConfig;
