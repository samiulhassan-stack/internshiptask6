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
function generateCategoryData() {
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
    growth: (Math.random() * 40 - 10).toFixed(1)
  }));
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const { startDate, endDate, category } = params;
    
    // Calculate date range (default to last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const salesData = generateSalesData(start, end);
    
    // Aggregate totals
    const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
    const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    
    const responseData = {
      summary: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        avgOrderValue: avgOrderValue.toFixed(2),
        revenueGrowth: (Math.random() * 30 - 5).toFixed(1),
        ordersGrowth: (Math.random() * 25 - 3).toFixed(1)
      },
      salesOverTime: salesData,
      categoryBreakdown: generateCategoryData(),
      regionalPerformance: generateRegionalData(),
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message })
    };
  }
};
