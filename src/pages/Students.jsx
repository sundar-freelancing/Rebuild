import { ArrowRight, GraduationCap, Zap, Users, CheckCircle2, PlayCircle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import SectionHeader from '@/components/common/SectionHeader';
import GlassCard from '@/components/common/GlassCard';
import { collegeStudentPrograms, SEO_TITLES } from '@/utils/constants';
import SEO from '@/components/SEO';

const Students = () => {
    return (
        <div className="min-h-screen overflow-hidden">
            <SEO title={SEO_TITLES.students} description="Special programs from Rebuild It Solution designed to help college students land top-tier tech jobs — from placement cracking to campus-to-corporate transitions." url="/students" />
            <PageHero
                badge="Campus To Corporate"
                icon={GraduationCap}
                title="Master Your"
                gradientText="First Big Break"
                subtitle="We bridge the gap between academic theory and high-paying industry roles. Join the elite 1% of freshers who land top-tier product roles."
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                {/* Statistics / Impact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
                    {[
                        { label: "College Partners", val: "50+" },
                        { label: "Avg. Fresher Pkg", val: "8.5 LPA" },
                        { label: "Success Rate", val: "94%" },
                        { label: "Community", val: "5k+" },
                    ].map((stat, i) => (
                        <div key={i} data-aos="zoom-in" data-aos-delay={i * 100} className="bg-white dark:bg-white/5 p-6 rounded-3xl text-center border border-slate-200 dark:border-white/10">
                            <div className="text-2xl md:text-3xl font-black text-primary mb-1">{stat.val}</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Programs */}
                <section className="mb-32">
                    <SectionHeader
                        badge="Our Tracks"
                        title="Specialized Student Blueprints"
                        subtitle="Tailored journeys whether you are in your 1st year or final semester."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {collegeStudentPrograms.map((program, index) => (
                            <GlassCard key={index} delay={index * 150} className="relative flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <program.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{program.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-8">{program.desc}</p>
                                <div className="mt-auto px-4 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                                    {program.benefit}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Why Colleges Trust Us */}
                <section className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div data-aos="fade-right">
                        <SectionHeader
                            centered={false}
                            badge="The Edge"
                            title="Why Students Choose ReBuild IT"
                        />
                        <div className="space-y-6">
                            {[
                                { t: "Real Enterprise Projects", d: "No more library management systems. Build actual CI/CD pipelines and microservices." },
                                { t: "Industry Mentorship", d: "Direct access to engineering leads from top product companies." },
                                { t: "Interview Cracker", d: "Specialized focus on DSA, System Design, and Technical Communication." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.t}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div data-aos="fade-left" className="relative group">
                        <div className="absolute -inset-4 bg-linear-to-r from-primary/30 to-secondary/30 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                        <img
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
                            alt="Students collaborating"
                            className="relative rounded-[2.5rem] shadow-2xl grayscale group-hover:grayscale-0 transition duration-700"
                        />
                        <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                                    <PlayCircle className="w-6 h-6" />
                                </div>
                                <div className="text-white">
                                    <div className="font-bold">Watch our Alumni Stories</div>
                                    <div className="text-xs opacity-70">12 mins of pure inspiration</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};
export default Students;
