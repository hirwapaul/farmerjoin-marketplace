import React, { useState } from 'react';

const SeasonalCalendar = () => {
  const [selectedSeason, setSelectedSeason] = useState('current');
  
  const currentMonth = new Date().getMonth() + 1;
  const currentSeason = getSeason(currentMonth);
  
  const seasonalData = {
    spring: {
      months: ['March', 'April', 'May'],
      products: [
        { name: 'Asparagus', icon: '🥦', description: 'Fresh spears perfect for grilling' },
        { name: 'Spinach', icon: '🥬', description: 'Tender leaves for salads and cooking' },
        { name: 'Radishes', icon: '🌶️', description: 'Crisp and peppery root vegetables' },
        { name: 'Strawberries', icon: '🍓', description: 'Sweet and juicy berries' },
        { name: 'Peas', icon: '🟢', description: 'Sweet garden peas' },
        { name: 'Lettuce', icon: '🥗', description: 'Fresh salad greens' }
      ]
    },
    summer: {
      months: ['June', 'July', 'August'],
      products: [
        { name: 'Tomatoes', icon: '🍅', description: 'Vine-ripened and flavorful' },
        { name: 'Corn', icon: '🌽', description: 'Sweet summer corn' },
        { name: 'Bell Peppers', icon: '🫑', description: 'Colorful and crisp' },
        { name: 'Zucchini', icon: '🥒', description: 'Versatile summer squash' },
        { name: 'Blueberries', icon: '🫐', description: 'Sweet antioxidant-rich berries' },
        { name: 'Peaches', icon: '🍑', description: 'Juicy stone fruits' }
      ]
    },
    fall: {
      months: ['September', 'October', 'November'],
      products: [
        { name: 'Apples', icon: '🍎', description: 'Crisp and sweet varieties' },
        { name: 'Pumpkins', icon: '🎃', description: 'Perfect for pies and carving' },
        { name: 'Sweet Potatoes', icon: '🍠', description: 'Nutritious root vegetables' },
        { name: 'Brussels Sprouts', icon: '🥦', description: 'Roasted or steamed' },
        { name: 'Grapes', icon: '🍇', description: 'Sweet wine and table grapes' },
        { name: 'Pears', icon: '🍐', description: 'Buttery and sweet' }
      ]
    },
    winter: {
      months: ['December', 'January', 'February'],
      products: [
        { name: 'Carrots', icon: '🥕', description: 'Sweet and crunchy' },
        { name: 'Kale', icon: '🥬', description: 'Nutritious winter greens' },
        { name: 'Citrus', icon: '🍊', description: 'Oranges and lemons' },
        { name: 'Beets', icon: '🍓', description: 'Earthy and sweet' },
        { name: 'Cabbage', icon: '🥬', description: 'Versatile for cooking' },
        { name: 'Onions', icon: '🧅', description: 'Essential cooking base' }
      ]
    }
  };

  function getSeason(month) {
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  const getSeasonData = () => {
    if (selectedSeason === 'current') {
      return seasonalData[currentSeason];
    }
    return seasonalData[selectedSeason];
  };

  const seasonData = getSeasonData();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">🌱 Seasonal Produce Calendar</h2>
        <div className="flex space-x-2">
          {Object.keys(seasonalData).map(season => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedSeason === season || (selectedSeason === 'current' && season === currentSeason)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {season.charAt(0).toUpperCase() + season.slice(1)}
              {season === currentSeason && ' (Now)'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {seasonData.months.join(' - ')}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasonData.products.map((product, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{product.icon}</span>
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">💡 Why Buy Seasonal?</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Better taste and nutrition</li>
          <li>• Lower prices and better value</li>
          <li>• Supports local farming cycles</li>
          <li>• Reduces environmental impact</li>
          <li>• Connects you to nature's rhythms</li>
        </ul>
      </div>
    </div>
  );
};

export default SeasonalCalendar;
