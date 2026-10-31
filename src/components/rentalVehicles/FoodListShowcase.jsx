import React, { useState } from 'react';
import './FoodListShowcase.css';

const DEFAULT_FOODS = [
  {
    id: 'FD-1',
    name: 'Pama Paw Salad',
    rating: 4.7,
    price: '$25.45',
    orderCount: '452',
    repeatBuyers: '25%',
    image: '/images/food_1.jpg',
    category: 'Salad'
  },
  {
    id: 'FD-2',
    name: 'Beef Oregano Momos',
    rating: 4.7,
    price: '$47.45',
    orderCount: '52',
    repeatBuyers: '11%',
    image: '/images/food_2.jpg',
    category: 'Momos'
  },
  {
    id: 'FD-3',
    name: 'Beef Salad',
    rating: 4.7,
    price: '$40.45',
    orderCount: '78',
    repeatBuyers: '3%',
    image: '/images/food_3.jpg',
    category: 'Salad'
  },
  {
    id: 'FD-4',
    name: 'Italian Blast Pasta',
    rating: 4.7,
    price: '$244.45',
    orderCount: '40',
    repeatBuyers: '2%',
    image: '/images/food_4.jpg',
    category: 'Pasta'
  },
  {
    id: 'FD-5',
    name: 'Beef Origano Pizza',
    rating: 4.7,
    price: '$8.45',
    orderCount: '78',
    repeatBuyers: '49%',
    image: '/images/food_5.jpg',
    category: 'Pizza'
  },
  {
    id: 'FD-6',
    name: 'Masala Sushi',
    rating: 4.7,
    price: '$24.45',
    orderCount: '442',
    repeatBuyers: '75%',
    image: '/images/food_6.jpg',
    category: 'Sushi'
  }
];

const CATEGORIES = [
  { id: 'All', label: 'All', icon: 'fa-table-cells' },
  { id: 'Pizza', label: 'Pizza', icon: 'fa-pizza-slice' },
  { id: 'Drinks', label: 'Drinks', icon: 'fa-wine-glass' },
  { id: 'Sushi', label: 'Sushi', icon: 'fa-bowl-rice' },
  { id: 'Burger', label: 'Burger', icon: 'fa-burger' },
  { id: 'Set Menu', label: 'Set Menu', icon: 'fa-utensils' },
  { id: 'Pasta', label: 'Pasta', icon: 'fa-plate-wheat' },
  { id: 'Momos', label: 'Momos', icon: 'fa-cookie-bite' }
];

export default function FoodListShowcase() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeCategory === 'All'
    ? DEFAULT_FOODS
    : DEFAULT_FOODS.filter(f => f.category === activeCategory);

  return (
    <div className="food-list-container">
      {/* Header Row: Title & Add Food Button */}
      <div className="food-list-header">
        <h3 className="food-list-heading">Food List</h3>
        <button type="button" className="btn-add-food">
          Add Food
        </button>
      </div>

      {/* Food Categories Strip */}
      <div className="food-categories-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`food-category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <i className={`fa-solid ${cat.icon}`}></i>
            <span>{cat.label}</span>
          </button>
        ))}
        <button type="button" className="food-category-pill view-list-pill">
          View List
        </button>
      </div>

      {/* Food Cards Grid (2 rows x 3 columns) */}
      <div className="food-cards-grid">
        {filtered.map(food => (
          <div key={food.id} className="food-item-card">
            <div className="food-card-img-wrap">
              <img
                src={food.image}
                alt={food.name}
                className="food-card-img"
                onError={(e) => {
                  e.target.src = '/images/fullday_driver_showcase.jpg';
                }}
              />
            </div>

            <div className="food-card-content">
              <div className="food-name-rating-row">
                <h4 className="food-title">{food.name}</h4>
                <div className="food-rating-badge">
                  <i className="fa-solid fa-star"></i>
                  <span>{food.rating}</span>
                </div>
              </div>

              {/* Specs footer table: Price, Order, Repeat Buyers */}
              <div className="food-stats-footer">
                <div className="food-stat-col">
                  <span className="stat-label">Price</span>
                  <span className="stat-value">{food.price}</span>
                </div>
                <div className="food-stat-col">
                  <span className="stat-label">Order</span>
                  <span className="stat-value">{food.orderCount}</span>
                </div>
                <div className="food-stat-col">
                  <span className="stat-label">Repeat Buyers</span>
                  <span className="stat-value">{food.repeatBuyers}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="food-pagination-row">
        <button type="button" className="page-nav-arrow" disabled>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button type="button" className={`page-number-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
        <button type="button" className={`page-number-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
        <span className="pagination-ellipsis">...</span>
        <button type="button" className="page-number-btn" onClick={() => setCurrentPage(9)}>9</button>
        <button type="button" className="page-number-btn" onClick={() => setCurrentPage(10)}>10</button>
        <button type="button" className="page-nav-arrow">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

