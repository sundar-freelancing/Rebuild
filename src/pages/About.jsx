import React from 'react';
import SEO from '@/components/SEO';
import { SEO_TITLES } from '@/utils/constants';
import { Target, Users, Zap, Award, Quote, Calendar, Milestone } from 'lucide-react';
import SocialProof from '@/components/home/SocialProof';
import PageHero from '@/components/common/PageHero';
import useSiteConfigStore from '@/store/useSiteConfigStore';

const About = () => {
    const config = useSiteConfigStore((s) => s.config);

    return (
        <div className="min-h-screen overflow-hidden">
            <SEO title={SEO_TITLES.about} description="Learn about Rebuild It Solution's mission to bridge the gap between education and industry, empowering students and professionals to build successful tech careers." url="/about" />
            <PageHero
                badge="Our Story"
                title="Empowering the next"
                gradientText="Tech Leaders"
                subtitle="We are on a mission to bridge the gap between education and industry, providing individuals with the exact skills, mentorship, and opportunities they need to thrive in the digital era."
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-20">

                {/* Values / Stats Section */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
                >
                    {[
                        { icon: <Target className="w-6 h-6 text-primary" />, title: "Our Mission", desc: "To make high-quality tech education accessible to everyone." },
                        { icon: <Zap className="w-6 h-6 text-secondary" />, title: "Our Vision", desc: "A world where talent, not zip code, determines success." },
                        { icon: <Award className="w-6 h-6 text-primary" />, title: "Excellence", desc: "We strive for excellence in every line of code we teach." },
                        { icon: <Users className="w-6 h-6 text-secondary" />, title: "Community", desc: "Fostering a supportive network of lifelong learners." },
                    ].map((item, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Our Journey Section */}
                <div
                    data-aos="fade-up"
                    className="mb-24"
                >
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-6 border border-secondary/20">
                            <Milestone className="w-4 h-4" />
                            <span>Timeline</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Our Journey</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">The milestones that shaped our path since we started in 2023.</p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-primary/20 via-secondary/20 to-transparent rounded-full" />

                        <div className="space-y-12 relative z-10">
                            {/* 2023 */}
                            <div data-aos="fade-up" data-aos-delay="100" className="flex flex-col md:flex-row items-start md:items-center relative">
                                <div className="hidden md:block md:w-1/2 md:pr-12 text-right">
                                    <h3 className="text-3xl font-bold text-primary mb-2">2023</h3>
                                    <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">The Beginning</h4>
                                    <p className="text-slate-600 dark:text-slate-400">Founded with a vision to revolutionize tech education and make practical skills accessible to everyone.</p>
                                </div>
                                <div className="absolute left-0 md:left-1/2 -translate-x-[2px] md:-translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-slate-50 dark:border-background-dark">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                </div>
                                <div className="md:w-1/2 pl-12 md:hidden">
                                    <h3 className="text-2xl font-bold text-primary mb-1">2023</h3>
                                    <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">The Beginning</h4>
                                    <p className="text-slate-600 dark:text-slate-400">Founded with a vision to revolutionize tech education and make practical skills accessible to everyone.</p>
                                </div>
                            </div>

                            {/* 2024 */}
                            <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col md:flex-row items-start md:items-center relative">
                                <div className="hidden md:block md:w-1/2" />
                                <div className="absolute left-0 md:left-1/2 -translate-x-[2px] md:-translate-x-1/2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center border-4 border-slate-50 dark:border-background-dark">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                </div>
                                <div className="md:w-1/2 pl-12 text-left">
                                    <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-1 md:mb-2">2024</h3>
                                    <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Rapid Expansion</h4>
                                    <p className="text-slate-600 dark:text-slate-400">Launched our flagship courses, partnered with key industry leaders, and grew our community to over 10,000 learners.</p>
                                </div>
                            </div>

                            {/* 2025 */}
                            <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col md:flex-row items-start md:items-center relative">
                                <div className="hidden md:block md:w-1/2 md:pr-12 text-right">
                                    <h3 className="text-3xl font-bold text-primary mb-2">2025</h3>
                                    <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Global Impact</h4>
                                    <p className="text-slate-600 dark:text-slate-400">Continuing to innovate and expand our curriculum to empower the next generation of global tech leaders.</p>
                                </div>
                                <div className="absolute left-0 md:left-1/2 -translate-x-[2px] md:-translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-slate-50 dark:border-background-dark">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                </div>
                                <div className="md:w-1/2 pl-12 md:hidden">
                                    <h3 className="text-2xl font-bold text-primary mb-1">2025</h3>
                                    <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Global Impact</h4>
                                    <p className="text-slate-600 dark:text-slate-400">Continuing to innovate and expand our curriculum to empower the next generation of global tech leaders.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <SocialProof />

                {/* CEO Section */}
                <div
                    data-aos="fade-up"
                    className="relative bg-white dark:bg-[#1e1628] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Quote className="w-32 h-32 text-primary" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="relative h-[400px] lg:h-auto overflow-hidden">
                            {/* Dynamic CEO Image */}
                            <img
                                src={config.ceoPictureUrl}
                                alt={config.ceoName}
                                className="absolute inset-0 w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-slate-900/80" />
                        </div>

                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Message from our CEO</h2>
                            <p className="text-primary font-semibold mb-8 uppercase tracking-wider text-sm">{config.ceoName}, Founder & CEO</p>

                            <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                <p>
                                    "When we started this journey, our goal was simple: to build a platform that truly cares about the success of its students. Over the years, I've seen firsthand how access to the right knowledge and community can completely transform a person's life."
                                </p>
                                <p>
                                    "We are not just a company; we are a movement dedicated to bridging the global skills gap. Every feature we build, every course we design, is crafted with one question in mind: How does this help our users achieve their goals faster and more effectively?"
                                </p>
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                    "Join us, and let's build the future together."
                                </p>
                            </div>

                            <div className="mt-10">
                                <img src={config.ceoSignUrl} alt="Signature" className="h-12 opacity-80 dark:invert" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
