
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MealCard from '../components/MealCard';
import { useQuery } from '@tanstack/react-query';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      const data = await response.json();
      return data.meals || [];
    },
  });

  // Fetch areas
  const { data: areas } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      const data = await response.json();
      return data.meals || [];
    },
  });

  // Fetch meals based on search criteria
  const { data: meals, isLoading } = useQuery({
    queryKey: ['meals', searchTerm, selectedCategory, selectedArea],
    queryFn: async () => {
      let url = '';
      
      if (searchTerm) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
      } else if (selectedCategory) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
      } else if (selectedArea) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`;
      } else {
        // Get random meals if no filters
        const meals = [];
        for (let i = 0; i < 12; i++) {
          const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
          const data = await response.json();
          if (data.meals) {
            meals.push(data.meals[0]);
          }
        }
        return meals;
      }

      const response = await fetch(url);
      const data = await response.json();
      return data.meals || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory('');
    setSelectedArea('');
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedArea('');
    setSearchTerm('');
    setSearchParams({});
  };

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    setSelectedCategory('');
    setSearchTerm('');
    setSearchParams({});
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedArea('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Browse Meals</h1>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories?.map((category: any) => (
                  <SelectItem key={category.strCategory} value={category.strCategory}>
                    {category.strCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Area Filter */}
            <Select value={selectedArea} onValueChange={handleAreaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Cuisine" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {areas?.map((area: any) => (
                  <SelectItem key={area.strArea} value={area.strArea}>
                    {area.strArea}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory || selectedArea) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  Search: {searchTerm}
                </span>
              )}
              {selectedCategory && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedArea && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Cuisine: {selectedArea}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading delicious meals...</p>
          </div>
        ) : meals && meals.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">{meals.length} meals found</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {meals.map((meal: any) => (
                <MealCard key={meal.idMeal} meal={meal} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No meals found. Try different search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
