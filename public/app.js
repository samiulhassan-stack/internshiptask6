// Chart instances
let revenueChart, categoryChart, regionalChart, comparisonChart;

// API Base URL - works for both local and production
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDateInputs();
    setupEventListeners();
    loadDashboardData();
});

// Set default dates (last 30 days)
function initializeDateInputs() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    document.getElementById('endDate').valueAsDate = endDate;
    document.getElementById('startDate').valueAsDate = startDate;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('applyFilters').addEventListener('click', loadDashboardData);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

// Reset filters
function resetFilters() {
    initializeDateInputs();
    document.getElementById('categoryFilter').value = '';
    loadDashboardData();
}

// Fetch and load all dashboard data
async function loadDashboardData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const category = document.getElementById('categoryFilter').value;
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (category) params.append('category', category);
    
    try {
        const response = await fetch(`${API_URL}/stats?${params.toString()}`);
        const data = await response.json();
        
        updateStatCards(data.summary);
        updateRevenueChart(data.salesOverTime);
        updateCategoryChart(data.categoryBreakdown);
        updateRegionalChart(data.regionalPerformance);
        updateComparisonChart(data.salesOverTime);
        
        updateLastUpdateTime();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Failed to load dashboard data. Make sure the server is running on port 3000.');
    }
}

// Update stat cards
function updateStatCards(summary) {
    document.getElementById('totalRevenue').textContent = `$${formatNumber(summary.totalRevenue)}`;
    document.getElementById('totalOrders').textContent = formatNumber(summary.totalOrders);
    document.getElementById('totalCustomers').textContent = formatNumber(summary.totalCustomers);
    document.getElementById('avgOrderValue').textContent = `$${summary.avgOrderValue}`;
    
    // Update growth indicators
    const revenueChange = document.getElementById('revenueChange');
    revenueChange.textContent = `${summary.revenueGrowth}%`;
    revenueChange.className = 'stat-change ' + (parseFloat(summary.revenueGrowth) >= 0 ? 'positive' : 'negative');
    
    const ordersChange = document.getElementById('ordersChange');
    ordersChange.textContent = `${summary.ordersGrowth}%`;
    ordersChange.className = 'stat-change ' + (parseFloat(summary.ordersGrowth) >= 0 ? 'positive' : 'negative');
}

// Update revenue line chart
function updateRevenueChart(salesData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Destroy existing chart
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    // Prepare data (aggregate by week if too many days)
    const chartData = salesData.length > 30 ? aggregateByWeek(salesData) : salesData;
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map(d => formatDate(d.date)),
            datasets: [{
                label: 'Revenue ($)',
                data: chartData.map(d => d.revenue),
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Revenue: $${formatNumber(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Update category bar chart
function updateCategoryChart(categoryData) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryData.map(d => d.category),
            datasets: [{
                label: 'Sales ($)',
                data: categoryData.map(d => d.sales),
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(237, 100, 166, 0.8)',
                    'rgba(255, 154, 158, 0.8)',
                    'rgba(250, 208, 196, 0.8)'
                ],
                borderColor: [
                    'rgb(102, 126, 234)',
                    'rgb(118, 75, 162)',
                    'rgb(237, 100, 166)',
                    'rgb(255, 154, 158)',
                    'rgb(250, 208, 196)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Sales: $${formatNumber(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Update regional doughnut chart
function updateRegionalChart(regionalData) {
    const ctx = document.getElementById('regionalChart').getContext('2d');
    
    if (regionalChart) {
        regionalChart.destroy();
    }
    
    regionalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: regionalData.map(d => d.region),
            datasets: [{
                label: 'Revenue',
                data: regionalData.map(d => d.revenue),
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(237, 100, 166, 0.8)',
                    'rgba(255, 154, 158, 0.8)',
                    'rgba(250, 208, 196, 0.8)'
                ],
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${formatNumber(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update comparison bar chart
function updateComparisonChart(salesData) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    // Aggregate by week
    const weeklyData = aggregateByWeek(salesData);
    
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeklyData.map(d => formatDate(d.date)),
            datasets: [
                {
                    label: 'Orders',
                    data: weeklyData.map(d => d.orders),
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: 'rgb(102, 126, 234)',
                    borderWidth: 2
                },
                {
                    label: 'Customers',
                    data: weeklyData.map(d => d.customers),
                    backgroundColor: 'rgba(237, 100, 166, 0.7)',
                    borderColor: 'rgb(237, 100, 166)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Helper: Aggregate daily data by week
function aggregateByWeek(data) {
    if (data.length <= 7) return data;
    
    const weeks = {};
    data.forEach(day => {
        const date = new Date(day.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeks[weekKey]) {
            weeks[weekKey] = {
                date: weekKey,
                revenue: 0,
                orders: 0,
                customers: 0,
                count: 0
            };
        }
        
        weeks[weekKey].revenue += day.revenue;
        weeks[weekKey].orders += day.orders;
        weeks[weekKey].customers += day.customers;
        weeks[weekKey].count++;
    });
    
    return Object.values(weeks).map(week => ({
        date: week.date,
        revenue: Math.round(week.revenue / week.count),
        orders: Math.round(week.orders / week.count),
        customers: Math.round(week.customers / week.count)
    }));
}

// Helper: Format numbers with commas
function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Helper: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
