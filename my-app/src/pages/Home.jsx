import React from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";

const Home = () => {

    return (
        <div className="relative min-h-screen">
            {/* Hero Slider */}
            <HeroSlider />
            
            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 text-shadow-premium tracking-tight">
                        FarmerJoin
                    </h2>
                    <p className="text-lg text-white mb-6 opacity-90 font-secondary leading-relaxed">
                        Connecting farmers directly with buyers. Fresh produce at fair prices.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/products"
                            className="bg-white hover:bg-gray-100 text-primary-600 font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-ui"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-gray-800 mb-8 tracking-tight">
                        Why Choose FarmerJoin?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 tracking-tight">Fair Prices</h3>
                            <p className="text-sm text-gray-600 font-secondary leading-relaxed">
                                Get the best prices for your produce. No middlemen, just fair trade.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 tracking-tight">Fresh Produce</h3>
                            <p className="text-sm text-gray-600 font-secondary leading-relaxed">
                                Fresh, locally sourced produce directly from farmers to your table.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-gray-800 mb-2 tracking-tight">Trusted Platform</h3>
                            <p className="text-sm text-gray-600 font-secondary leading-relaxed">
                                Secure and reliable platform with verified farmers and buyers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary-600 py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-heading font-bold text-white mb-3 text-shadow-premium tracking-tight">
                        Ready to Get Started?
                    </h2>
                    <p className="text-primary-100 mb-6 text-base font-secondary leading-relaxed">
                        Join thousands of farmers and buyers already using FarmerJoin.
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition-all duration-300 font-ui"
                    >
                        Register Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
