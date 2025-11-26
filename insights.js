document.addEventListener('DOMContentLoaded', () => {
    initMoneyPathChart();
    initHabitsChart();
    loadTopMerchants();
});

function initMoneyPathChart() {
    const ctx = document.getElementById('moneyPathChart').getContext('2d');
    
    const tdGreen = '#008a00';
    const tdLime = '#a4c639';
    const tdDarkGray = '#444444';
    
    // Data points
    const labels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    
    // Historical data (Aug - Nov)
    const historicalData = [1800, 1950, 1850, 1923, null, null];
    
    // Projected data (Nov - Jan) - starting from last historical point
    const projectedData = [null, null, null, 1923, 2100, 2250];

    // Income data (Aug - Jan)
    const incomeData = [2400, 2400, 2450, 2450, 2450, 2500];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                borderColor: tdDarkGray,
                backgroundColor: tdDarkGray,
                borderDash: [2, 2],
                tension: 0.1,
                pointRadius: 3,
                pointHoverRadius: 5,
                fill: false
            },
            {
                label: 'Actual Spending',
                data: historicalData,
                borderColor: tdGreen,
                backgroundColor: tdGreen,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false
            },
            {
                label: 'Projected Path',
                data: projectedData,
                borderColor: tdLime,
                backgroundColor: tdLime,
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    };

    new Chart(ctx, config);
}

function initHabitsChart() {
    const ctx = document.getElementById('habitsChart').getContext('2d');

    const data = {
        labels: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills'],
        datasets: [{
            data: [35, 20, 25, 10, 10],
            backgroundColor: [
                '#F44336', // Red
                '#1976D2', // Blue
                '#008a00', // Green (TD)
                '#FF9800', // Orange
                '#9C27B0'  // Purple
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        color: '#666'
                    }
                },
                tooltip: {
                    backgroundColor: '#fff',
                    titleColor: '#1a1a1a',
                    bodyColor: '#666',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
}

function loadTopMerchants() {
    // Mock Data: Merchants and their transaction counts
    const merchants = [
        {
            name: 'Uber Eats',
            count: 12,
            amount: 245.50,
            icon: 'fa-burger',
            color: '#FF9800',
            transactions: [
                { date: 'Today, 12:30 PM', amount: -24.50 },
                { date: 'Yesterday, 6:15 PM', amount: -32.10 },
                { date: 'Nov 24, 1:45 PM', amount: -18.75 }
            ]
        },
        {
            name: 'Shell Station',
            count: 8,
            amount: 380.00,
            icon: 'fa-gas-pump',
            color: '#F44336',
            transactions: [
                { date: 'Yesterday', amount: -45.00 },
                { date: 'Nov 20', amount: -55.00 },
                { date: 'Nov 15', amount: -60.00 }
            ]
        },
        {
            name: 'Starbucks',
            count: 15, // High frequency
            amount: 85.20,
            icon: 'fa-mug-hot',
            color: '#00796B',
            transactions: [
                { date: 'Today, 8:00 AM', amount: -5.65 },
                { date: 'Yesterday, 8:10 AM', amount: -6.20 },
                { date: 'Nov 24, 9:30 AM', amount: -5.45 }
            ]
        },
        {
            name: 'Walmart',
            count: 4,
            amount: 412.30,
            icon: 'fa-cart-shopping',
            color: '#1976D2',
            transactions: [
                { date: 'Nov 22', amount: -120.50 },
                { date: 'Nov 10', amount: -291.80 }
            ]
        },
        {
            name: 'Netflix',
            count: 1,
            amount: 16.99,
            icon: 'fa-film',
            color: '#E50914',
            transactions: [
                { date: 'Nov 15', amount: -16.99 }
            ]
        }
    ];

    // Sort by count descending
    merchants.sort((a, b) => b.count - a.count);

    const list = document.getElementById('topMerchantsList');
    const maxCount = merchants[0].count; // For progress bar calculation

    merchants.forEach(m => {
        const percent = (m.count / maxCount) * 100;
        
        // Generate transaction HTML
        const transactionsHtml = m.transactions.map(t => `
            <div class="m-transaction">
                <span class="mt-date">${t.date}</span>
                <span class="mt-amount">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(t.amount))}</span>
            </div>
        `).join('');

        const html = `
            <div class="merchant-item">
                <div class="merchant-main">
                    <div class="t-icon" style="background-color: ${m.color}20; color: ${m.color};">
                        <i class="fa-solid ${m.icon}"></i>
                    </div>
                    <div class="m-info">
                        <div class="m-header">
                            <h4 class="m-name">${m.name}</h4>
                            <div class="m-right">
                                <span class="m-count">${m.count} txns</span>
                                <i class="fa-solid fa-chevron-down expand-icon"></i>
                            </div>
                        </div>
                        <div class="progress-bg">
                            <div class="progress-fill" style="width: ${percent}%; background: ${m.color};"></div>
                        </div>
                    </div>
                </div>
                <div class="merchant-details">
                    <div class="m-transactions-list">
                        <div class="m-transaction-header">Recent Activity</div>
                        ${transactionsHtml}
                    </div>
                </div>
            </div>
        `;
        
        list.insertAdjacentHTML('beforeend', html);
    });

    // Add click event listeners
    document.querySelectorAll('.merchant-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });
    });
}
