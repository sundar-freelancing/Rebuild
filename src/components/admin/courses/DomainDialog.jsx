import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LayoutGrid, Loader2, HelpCircle, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
};

const DomainDialog = ({ open, onOpenChange, domain, onSave, acting }) => {
    const [formData, setFormData] = useState({
        name: domain?.name || '',
        icon: domain?.icon || 'LayoutGrid',
        description: domain?.description || '',
        isDisabled: domain?.isDisabled || false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <LayoutGrid className="w-5 h-5 text-primary" />
                        </div>
                        {domain ? 'Edit Domain' : 'New Domain'}
                    </DialogTitle>
                    <DialogDescription className="font-medium text-slate-500 text-sm">
                        Organize courses into high-level categories.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Domain Name</Label>
                        <Input
                            placeholder="e.g. Full Stack Development"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="rounded-xl h-11 border-slate-200 font-medium text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lucide Icon Name</Label>
                        <div className="relative">
                            <Input
                                placeholder="e.g. Code, Shield, Cpu"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                required
                                className="rounded-xl h-11 border-slate-200 font-medium text-sm pl-10"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/60">
                                <DynamicIcon name={formData.icon} className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</Label>
                        <Textarea
                            placeholder="Briefly describe the purpose of this domain..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="rounded-xl border-slate-200 resize-none text-sm h-24"
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                        <div className="space-y-0.5">
                            <div className="text-sm font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-slate-400" />
                                Is Disabled
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">Hide this domain from public view</p>
                        </div>
                        <Switch
                            checked={formData.isDisabled}
                            onCheckedChange={(c) => setFormData({ ...formData, isDisabled: c })}
                        />
                    </div>
                    <DialogFooter className="pt-4 gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={acting} className="flex-1">
                            {acting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {domain ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default React.memo(DomainDialog);
