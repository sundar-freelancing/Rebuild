import { useLeadCapture } from '@/context/LeadCaptureContext';
import usePublicStore from '@/store/usePublicStore';
import { placementStats, placementSteps } from '@/utils/constants';
import { motion as Motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

const Placement = () => {
    const { openModal } = useLeadCapture();
    const { initPartners } = usePublicStore();

    useEffect(() => {
        initPartners();
    }, [initPartners]);

    return (
        <section className="py-24 overflow-hidden" id="placement">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">Placement Support</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        Placement End-to-End <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
                            Owned by Re Build
                        </span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        We don't just teach modules; we build careers. Our specialized placement engine ensures you land your dream role with the package you deserve.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-20">
                    {placementStats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.2 } }}
                                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 z-10 relative"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <IconComponent className="size-5" />
                                    </div>
                                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                    {stat.value}
                                </div>
                                <div className="mt-2 flex items-center gap-1 text-emerald-500 text-xs font-bold">
                                    <ArrowUpRight className="size-3" />
                                    <span>Top Success Rate</span>
                                </div>
                            </Motion.div>
                        );
                    })}
                </div>

                {/* Steps Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div data-aos="fade-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                            The Placement Engine
                        </div>
                        <h4 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                            How we ensure your <span className="text-primary italic">Success</span>
                        </h4>
                        <div className="space-y-6">
                            {placementSteps.map((step, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="shrink-0 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm ring-4 ring-primary/5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{step.title}</h5>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="mt-10 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 group"
                            onClick={() => openModal('Placement Section', {
                                title: 'Talk to Career Expert',
                                subtitle: 'Get expert guidance on your career path and placement strategies.'
                            })}
                        >
                            Talk to Career Expert <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="relative" data-aos="fade-left">
                        <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-blue-500/20 blur-3xl rounded-full animate-pulse" />
                        <Motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h5 className="text-xl font-bold text-slate-900 dark:text-white">Placement Analytics</h5>
                                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">LIVE DATA</div>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { label: 'Role Conversion Rate', value: '94%', color: 'from-emerald-500 to-teal-400' },
                                    { label: 'Interview Confidence', value: '88%', color: 'from-blue-500 to-indigo-400' },
                                    { label: 'Salary Hike Average', value: '110%', color: 'from-orange-500 to-primary' },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <Motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: item.value }}
                                                transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                                                className={`h-full bg-linear-to-r ${item.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-3 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Recently Placed</span>
                                </div>
                                <div className="flex -space-x-3 mb-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Motion.img
                                            key={i}
                                            whileHover={{ scale: 1.2, zIndex: 10, transition: { duration: 0.2 } }}
                                            src={`https://i.pravatar.cc/150?u=${i}`}
                                            alt="user"
                                            className="size-10 rounded-full border-2 border-white dark:border-slate-950 cursor-pointer"
                                        />
                                    ))}
                                    <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-950">+12</div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic">"I got 3 offers from Top MNCs within 2 weeks of completing the mock rounds."</p>
                            </div>
                        </Motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Placement;
