
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChefHat, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MealCard from '../components/MealCard';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch random meals for hero section
  const { data: randomMeals } = useQuery({
    queryKey: ['randomMeals'],
    queryFn: async () => {
      const meals = [];
      for (let i = 0; i < 6; i++) {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        if (data.meals) {
          meals.push(data.meals[0]);
        }
      }
      return meals;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Delicious Food, <br />
            <span className="text-yellow-300">Delivered Fast</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing meals from around the world and get them delivered right to your doorstep.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-900"
              />
              <Button type="submit" variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <Link to="/browse">
            <Button size="lg" variant="secondary" className="text-orange-500">
              Browse All Meals
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FoodieExpress?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Meals</h3>
              <p className="text-gray-600">Fresh ingredients and authentic recipes from around the world.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick delivery to your doorstep within 30 minutes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Experience</h3>
              <p className="text-gray-600">Rated 5 stars by thousands of satisfied customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Meals Section */}
      {randomMeals && randomMeals.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Meals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomMeals.map((meal, index) => (
                <MealCard key={`${meal.idMeal}-${index}`} meal={meal} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/browse">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  View All Meals
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
