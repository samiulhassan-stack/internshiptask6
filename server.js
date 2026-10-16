import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Generate sample data for different time ranges
function generateSalesData(startDate, endDate) {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 100) + 20,
      customers: Math.floor(Math.random() * 80) + 15
    });
  }
  return data;
}

// Generate product category data
function generateCategoryData(startDate, endDate) {
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home & Garden'];
  return categories.map(category => ({
    category,
    sales: Math.floor(Math.random() * 50000) + 10000,
    count: Math.floor(Math.random() * 500) + 100
  }));
}

// Generate regional performance data
function generateRegionalData() {
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa'];
  return regions.map(region => ({
    region,
    revenue: Math.floor(Math.random() * 100000) + 30000,
    growth: (Math.random() * 40 - 10).toFixed(1) // -10% to +30%
  }));
}

// API endpoint for dashboard stats
app.get('/api/stats', (req, res) => {
  const { startDate, endDate, category } = req.query;
  
  // Calculate date range (default to last 30 days)
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const salesData = generateSalesData(start, end);
  
  // Aggregate totals
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  
  res.json({
    summary: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue: avgOrderValue.toFixed(2),
      revenueGrowth: (Math.random() * 30 - 5).toFixed(1), // -5% to +25%
      ordersGrowth: (Math.random() * 25 - 3).toFixed(1)
    },
    salesOverTime: salesData,
    categoryBreakdown: generateCategoryData(start, end),
    regionalPerformance: generateRegionalData(),
    dateRange: {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    }
  });
});

// API endpoint for category-specific data
app.get('/api/categories/:category', (req, res) => {
  const { category } = req.params;
  const products = [
    { name: 'Product A', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Product B', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Product C', sales: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Product D', sales: Math.floor(Math.random() * 5000) + 1000 }
  ];
  
  res.json({
    category,
    products
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/stats`);
});
