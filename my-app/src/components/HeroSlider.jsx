import { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState('next');

  const slides = [
    {
      image: '',
      title: 'Fresh Maize',
      subtitle: 'Rwanda Golden Corn',
      description: 'Premium quality maize from Rwandan farms',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      image: '',
      title: 'Rice Fields',
      subtitle: 'Rwanda Rice Farming',
      description: 'High-quality rice from Rwandan valleys',
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      image: '',
      title: 'Fresh Cassava',
      subtitle: 'Rwanda Cassava Farms',
      description: 'Nutritious cassava from local farmers',
      gradient: 'from-amber-400 to-yellow-600'
    },
    {
      image: '',
      title: 'Irish Potatoes',
      subtitle: 'Rwanda Potato Harvest',
      description: 'Fresh potatoes from Rwandan highlands',
      gradient: 'from-brown-400 to-amber-600'
    },
    {
      image: '',
      title: 'Soya Beans',
      subtitle: 'Rwanda Soya Production',
      description: 'Protein-rich soya beans from Rwanda',
      gradient: 'from-green-500 to-lime-600'
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setDirection('next');
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setDirection('next');
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 'next' : 'prev');
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getSlideAnimation = (index) => {
    if (index === currentSlide) {
      return direction === 'next' 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-0 opacity-100 scale-100';
    }
    return direction === 'next' 
      ? '-translate-x-full opacity-0 scale-95' 
      : 'translate-x-full opacity-0 scale-95';
  };

  return (
    <div className="relative h-[350px] overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700 ease-in-out flex items-center justify-center ${getSlideAnimation(index)}`}
          >
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 
                className="text-5xl md:text-7xl font-heading font-bold mb-6 text-shadow-premium transform transition-all duration-700 delay-100 tracking-tight"
                style={{
                  animation: index === currentSlide ? 'slideUp 0.8s ease-out' : 'none'
                }}
              >
                {slide.title}
              </h1>
              <p 
                className="text-2xl md:text-3xl mb-4 font-secondary font-light drop-shadow-lg transform transition-all duration-700 delay-200 tracking-wide"
                style={{
                  animation: index === currentSlide ? 'slideUp 0.8s ease-out 0.2s both' : 'none'
                }}
              >
                {slide.subtitle}
              </p>
              <p 
                className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 font-body transform transition-all duration-700 delay-300 leading-relaxed"
                style={{
                  animation: index === currentSlide ? 'slideUp 0.8s ease-out 0.4s both' : 'none'
                }}
              >
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-white border-opacity-30"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-white border-opacity-30"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-white border-opacity-30"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>

      {/* Advanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 h-3 bg-white rounded-full'
                : 'w-3 h-3 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-white rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-20">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
