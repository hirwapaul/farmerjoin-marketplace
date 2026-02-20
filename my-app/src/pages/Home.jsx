import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";

const Home = () => {
    const [stats, setStats] = useState({
        farmers: 0,
        products: 0,
        orders: 0,
        cooperatives: 0
    });

    useEffect(() => {
        // Mock data for demonstration
        setStats({
            farmers: 1250,
            products: 4580,
            orders: 12350,
            cooperatives: 45
        });
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Hero Section */}
            <HeroSlider />
            
            {/* Main Content Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Agricultural Technology, <span className="text-green-600">Redefined</span>
                        </h1>
                        <h2 className="text-2xl md:text-3xl text-gray-700 mb-8 font-light">
                            We help Rwandan farmers integrate data, technology, and field-level agronomy to deliver better outcomes
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            FarmerJoin is the digital marketplace partner for agriculture, supporting farmers, buyers, and cooperatives 
                            with solutions designed to scale across complex agricultural environments in Rwanda.
                        </p>
                        <div className="mt-8">
                            <Link
                                to="/register"
                                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Get Started
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Capabilities Grid */}
                    <div className="mb-20">
                        <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">What We Do</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="group">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                                    Digital Marketplace
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Connect farmers directly with buyers through our secure digital platform, eliminating middlemen and ensuring fair prices.
                                </p>
                            </div>
                            <div className="group">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                                    Farm Management
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Tools and insights to help farmers manage their operations, track production, and optimize yields.
                                </p>
                            </div>
                            <div className="group">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                                    Cooperative Support
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Empowering agricultural cooperatives with technology to scale their operations and reach more markets.
                                </p>
                            </div>
                            <div className="group">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                                    Data & Analytics
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Real-time market data and analytics to help farmers make informed decisions about their crops and pricing.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="bg-gray-50 rounded-2xl p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-green-600 mb-2">{stats.farmers}+</div>
                                <div className="text-gray-600 font-medium">Active Farmers</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-green-600 mb-2">{stats.products}+</div>
                                <div className="text-gray-600 font-medium">Products Listed</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-green-600 mb-2">{stats.orders}+</div>
                                <div className="text-gray-600 font-medium">Orders Completed</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-green-600 mb-2">{stats.cooperatives}+</div>
                                <div className="text-gray-600 font-medium">Cooperatives</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Enterprise Technology. Built for Agriculture.
                            </h3>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                FarmerJoin is the digital marketplace partner for Rwandan agriculture, supporting farmers, cooperatives, 
                                and buyers with solutions designed to scale across complex agricultural environments.
                            </p>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                We deliver the platform that helps agricultural leaders integrate data, technology, 
                                and field-level agronomy to deliver auditable, monetizable outcomes.
                            </p>
                            <Link
                                to="/about"
                                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                            >
                                Learn More
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-800 p-6 rounded-xl">
                                <div className="text-green-400 text-3xl mb-4">🌱</div>
                                <h4 className="text-white font-semibold mb-2">Sustainable Farming</h4>
                                <p className="text-gray-400 text-sm">Promoting environmentally friendly agricultural practices</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-xl">
                                <div className="text-green-400 text-3xl mb-4">📊</div>
                                <h4 className="text-white font-semibold mb-2">Data-Driven</h4>
                                <p className="text-gray-400 text-sm">Real-time insights for better decision making</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-xl">
                                <div className="text-green-400 text-3xl mb-4">🤝</div>
                                <h4 className="text-white font-semibold mb-2">Fair Trade</h4>
                                <p className="text-gray-400 text-sm">Ensuring fair prices for farmers</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-xl">
                                <div className="text-green-400 text-3xl mb-4">🚀</div>
                                <h4 className="text-white font-semibold mb-2">Scalable</h4>
                                <p className="text-gray-400 text-sm">Technology that grows with your business</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-green-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Transform Your Agricultural Business?
                    </h3>
                    <p className="text-green-100 text-lg mb-8">
                        Join thousands of farmers and buyers already using FarmerJoin to grow their agricultural enterprises.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white hover:bg-gray-100 text-green-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Register as Farmer
                        </Link>
                        <Link
                            to="/register"
                            className="border-2 border-white hover:bg-white hover:text-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Register as Buyer
                        </Link>
                    </div>
                    <p className="text-green-100 mt-6 text-sm">
                        Already have an account? <Link to="/login" className="text-white hover:text-green-100 underline">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
