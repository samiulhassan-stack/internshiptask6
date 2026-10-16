# Data Visualization Dashboard 📊

A comprehensive, interactive dashboard with multiple chart types and real-time data visualization. Features responsive design, interactive filters, and a full-stack implementation with Express.js backend and Chart.js frontend.

## Features ✨

### Visualizations
- **Line Chart**: Revenue trends over time with smooth curves and filled areas
- **Bar Chart**: Category-wise sales comparison with vibrant colors
- **Doughnut Chart**: Regional performance distribution with percentage breakdown
- **Multi-Bar Chart**: Orders vs Customers comparison by week

### Stat Cards
- Total Revenue with growth indicator
- Total Orders with trend percentage
- Customer count
- Average Order Value

### Interactive Filtering
- **Date Range Filter**: Select custom start and end dates
- **Category Filter**: Filter data by product category
- Real-time chart updates on filter changes
- Reset functionality to return to default view

### Responsive Design
- Works seamlessly on desktop, tablet, and mobile devices
- Charts automatically resize and reorganize
- Touch-friendly filters on mobile
- Optimized grid layouts for all screen sizes

## Technology Stack 🛠️

### Backend
- **Node.js** with Express.js
- RESTful API architecture
- Server-side data aggregation
- CORS enabled for development

### Frontend
- **Chart.js 4.4.0** for data visualization
- Vanilla JavaScript (ES6+)
- CSS3 with animations and gradients
- Responsive CSS Grid and Flexbox

## Installation 📦

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## API Endpoints 🔌

### Get Dashboard Stats
```
GET /api/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&category=CategoryName
```

**Query Parameters:**
- `startDate` (optional): Start date for data range
- `endDate` (optional): End date for data range
- `category` (optional): Filter by product category

**Response:**
```json
{
  "summary": {
    "totalRevenue": 150000,
    "totalOrders": 2500,
    "totalCustomers": 1800,
    "avgOrderValue": "60.00",
    "revenueGrowth": "15.5",
    "ordersGrowth": "8.2"
  },
  "salesOverTime": [...],
  "categoryBreakdown": [...],
  "regionalPerformance": [...],
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

### Get Category Details
```
GET /api/categories/:category
```

## Project Structure 📁

```
data-visualization-dashboard/
├── server.js              # Express server with API endpoints
├── package.json           # Dependencies and scripts
├── README.md             # Documentation
└── public/
    ├── index.html        # Main dashboard HTML
    ├── styles.css        # Responsive styles with animations
    └── app.js            # Chart.js integration and data handling
```

## Features Breakdown 🎯

### 1. Multiple Chart Types
- **Line Chart**: Smooth, animated line chart showing revenue trends with area fill
- **Bar Charts**: Colorful bars comparing categories and metrics side-by-side
- **Doughnut Chart**: Circular visualization showing proportional data distribution

### 2. Server-Side Data Aggregation
- Dynamic date range handling
- Category filtering
- Statistical calculations (totals, averages, growth percentages)
- Data normalization for different time periods

### 3. Responsive Design
- Mobile-first approach
- Breakpoints at 1200px, 768px, and 480px
- Flexible grid layouts
- Touch-optimized controls
- Readable charts on all screen sizes

### 4. Interactive Filtering
- Date range picker
- Category dropdown
- Apply and Reset buttons
- Real-time chart updates
- Maintains filter state across interactions

## Customization 💡

### Add New Chart Types
Edit `public/app.js` and add your chart update function:
```javascript
function updateMyCustomChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar', // or 'polarArea', 'bubble', etc.
        data: { /* your data */ },
        options: { /* your options */ }
    });
}
```

### Modify Data Generation
Edit `server.js` to customize the data generation logic:
```javascript
function generateSalesData(startDate, endDate) {
    // Customize data generation logic
    // Can connect to real database here
}
```

### Styling
Modify `public/styles.css` to change colors, layouts, and animations:
```css
.stat-card {
    /* Customize card appearance */
}
```

## Performance Optimizations ⚡

- Data aggregation by week for large date ranges
- Chart instance destruction before updates (prevents memory leaks)
- Efficient DOM updates
- CSS animations with GPU acceleration
- Responsive images and lazy loading ready

## Browser Support 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements 🚀

- [ ] Export charts as images (PNG/SVG)
- [ ] Real-time data streaming with WebSockets
- [ ] More chart types (radar, polar, bubble)
- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] User authentication and personalized dashboards
- [ ] Data export (CSV, Excel)
- [ ] Advanced filtering (multi-select, date presets)
- [ ] Dark mode toggle
- [ ] Drill-down functionality for detailed views

## License 📄

ISC

## Author 👨‍💻

Built with ❤️ for modern data visualization needs
