import React from 'react';
import SEO from '@/components/SEO';
import HeroSection from '@/components/home/HeroSection';
import SocialProof from '@/components/home/SocialProof';
import WhyTrustUs from '@/components/home/WhyTrustUs';
import ProblemSolution from '@/components/home/ProblemSolution';
import Placement from '@/components/home/Placement';
import Framework from '@/components/home/Framework';
import Courses from '@/components/home/Courses';
import Testimonials from '@/components/home/Testimonials';
import FinalCTA from '@/components/home/FinalCTA';

const Home = () => {
    return (
        <>
            <SEO title="Home" description="Empowering the next generation of Tech Leaders. Learn highly sought after IT skills today." url="/" />
            <HeroSection />
            <SocialProof />
            <WhyTrustUs />
            <ProblemSolution />
            <Placement />
            <Framework />
            <Courses />
            <Testimonials />
        </>
    );
};

export default Home;
