import React from "react";

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full filter blur-3xl"></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-4 shadow-2xl">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-gray-800 mb-4 tracking-tight">About Us</h1>
                        <p className="text-lg text-gray-600 font-secondary leading-relaxed max-w-3xl mx-auto">
                            Connecting Farmers and Buyers, Fairly and Efficiently
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Welcome Section */}
                <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 mb-8">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4 tracking-tight">Welcome to FarmerJoin</h2>
                    <div className="text-gray-600 font-secondary leading-relaxed">
                        <p>
                            A community-driven platform designed to bring farmers in cooperatives closer to buyers. Our mission is simple: help local farmers sell their produce directly, while giving buyers access to fresh, high-quality crops at fair prices.
                        </p>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 mb-8">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4 tracking-tight">Our Mission</h2>
                    <div className="space-y-3 text-gray-600 font-secondary leading-relaxed">
                        <p>
                            We believe in empowering farmers and promoting sustainable agriculture. By connecting cooperatives directly with buyers, we:
                        </p>
                        <div className="space-y-2 ml-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-emerald-600 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-600 font-secondary text-sm">Ensure farmers get fair prices for their hard work.</span>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-emerald-600 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-600 font-secondary text-sm">Reduce the role of middlemen, increasing transparency in transactions.</span>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-emerald-600 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-600 font-secondary text-sm">Make it easier for buyers to access fresh, local produce.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 mb-8">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4 tracking-tight">Why Choose Us?</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">Trustworthy Network</h3>
                                    <p className="text-gray-600 font-secondary text-sm">All farmers are part of verified cooperatives.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">Fresh and Quality Produce</h3>
                                    <p className="text-gray-600 font-secondary text-sm">Products come straight from the source.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">Community Focused</h3>
                                    <p className="text-gray-600 font-secondary text-sm">We support local agriculture and strengthen cooperative systems.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">Simple and Efficient</h3>
                                    <p className="text-gray-600 font-secondary text-sm">Easy browsing, ordering, and communication for both farmers and buyers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meet Our Team */}
                <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 mb-8">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4 tracking-tight">Meet Our Team</h2>
                    <div className="text-gray-600 font-secondary leading-relaxed">
                        <p>
                            We are a group of passionate developers, agricultural enthusiasts, and community builders committed to improving the way farmers and buyers connect. Our goal is to make agriculture more profitable and sustainable for everyone.
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="grid lg:grid-cols-2 gap-8 items-start mb-8">
                    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
                        <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4 tracking-tight">Get Involved</h2>
                        <div className="text-gray-600 font-secondary leading-relaxed mb-6">
                            <p>
                                Whether you are a farmer looking to reach more buyers or a buyer seeking fresh produce, join our platform today and be part of a growing community that values fairness, quality, and sustainability.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-ui">Platform Email</p>
                                    <p className="text-base font-semibold text-gray-800 font-secondary">info@farmerjoin.rw</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-ui">Farmers Contact</p>
                                    <p className="text-base font-semibold text-gray-800 font-secondary">farmers@farmerjoin.rw</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
                        <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4 tracking-tight">Join Our Farmer Network</h2>
                        
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                            <h3 className="text-lg font-semibold text-emerald-800 mb-2">For Farmers</h3>
                            <p className="text-emerald-700 font-secondary text-sm">
                                Are you a farmer looking to expand your market reach? We're actively seeking dedicated farmers to join our growing network!
                            </p>
                            <p className="text-emerald-600 font-secondary text-sm">
                                Contact us to create your farmer account and start selling your products directly to buyers across Rwanda.
                            </p>
                        </div>

                        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                            <h4 className="text-base font-semibold text-teal-800 mb-2">Business Hours</h4>
                            <div className="space-y-1 text-teal-700 font-secondary text-sm">
                                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                                <p>Saturday: 9:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4 tracking-tight">Join FarmerJoin Today</h2>
                    <p className="text-gray-600 font-secondary leading-relaxed max-w-2xl mx-auto mb-6">
                        Be part of a growing community that values fairness, quality, and sustainability in agriculture.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-ui">
                            Join Now
                        </button>
                        <button className="px-6 py-2 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-ui">
                            Browse Produce
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
