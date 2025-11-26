document.addEventListener('DOMContentLoaded', () => {
    initCashFlowChart();
    loadCashFlowTransactions();
    setupToggle();
});

let cashFlowChart;

function initCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart').getContext('2d');
    
    // Data for Monthly View (Default)
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    // Total bar height represents Income (the max potential)
    // The filled part represents Expense (how much of that income was used)
    const incomeData = [4200, 3800, 4500, 5100, 4800, 5200];
    const expenseData = [2800, 3100, 2900, 3500, 3200, 1923];

    // Create "Floating" Effect
    // We use a stacked chart where the bottom stack is Expense, and top is (Income - Expense)
    // But visually we want them to overlap. 
    // Chart.js "bar" with stacked: true puts them on top of each other.
    
    // Better approach for the visual reference:
    // The "Background" bar is the Income (lighter color)
    // The "Foreground" bar is the Expense (darker color), drawn ON TOP of the income bar.
    // This means we need two datasets on the same axis, not stacked, but grouped=false to overlap.
    
    // Colors
    const tdGreen = '#008a00';
    const tdLightGreen = '#e8f5e9'; 

    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: '#e8f5e9', // Very light green background
                    hoverBackgroundColor: '#e8f5e9',
                    borderRadius: 50, // Fully rounded pills
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                    order: 2 // Draw this first (behind)
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: '#ff8a80', // Pastel Red
                    hoverBackgroundColor: '#ff5252',
                    borderRadius: 50, // Fully rounded pills
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                    // Use the same x-axis index to overlap
                    grouped: false, 
                    order: 1 // Draw this second (on top)
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#fff',
                    titleColor: '#1a1a1a',
                    bodyColor: '#666',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: true,
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
                    beginAtZero: true,
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#888',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        padding: 10
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    };

    cashFlowChart = new Chart(ctx, config);
}

function setupToggle() {
    const weeklyRadio = document.getElementById('weekly');
    const monthlyRadio = document.getElementById('monthly');

    weeklyRadio.addEventListener('change', () => updateChartData('weekly'));
    monthlyRadio.addEventListener('change', () => updateChartData('monthly'));
    
    // Default load
    updateChartData('weekly'); 
}

function updateChartData(view) {
    if (view === 'weekly') {
        cashFlowChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        // Income (Background bar)
        cashFlowChart.data.datasets[0].data = [100, 200, 150, 100, 2600, 400, 200]; 
        // Expense (Foreground bar)
        cashFlowChart.data.datasets[1].data = [45, 80, 120, 65, 210, 340, 120];
    } else {
        cashFlowChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        cashFlowChart.data.datasets[0].data = [4200, 3800, 4500, 5100, 4800, 5200];
        cashFlowChart.data.datasets[1].data = [2800, 3100, 2900, 3500, 3200, 1923];
    }
    cashFlowChart.update();
}

function loadCashFlowTransactions() {
    const transactions = [
        {
            merchant: 'Salary Deposit',
            date: 'Apr 29',
            amount: 2800.00,
            icon: 'fa-money-bill-wave',
            color: '#008a00'
        },
        {
            merchant: 'Utility Bill',
            date: 'Apr 25',
            amount: -145.20,
            icon: 'fa-bolt',
            color: '#FF9800'
        },
        {
            merchant: 'E-Transfer Received',
            date: 'Apr 22',
            amount: 150.00,
            icon: 'fa-arrow-down',
            color: '#008a00'
        }
    ];

    const list = document.getElementById('cf-transactions');
    list.innerHTML = ''; // Clear existing
    
    transactions.forEach(t => {
        const isNegative = t.amount < 0;
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(t.amount));
        
        const amountClass = isNegative ? 'negative' : 'positive';
        const sign = isNegative ? '- ' : '+ ';

        const html = `
            <div class="transaction-item">
                <div class="t-left">
                    <div class="t-icon" style="background-color: ${t.color}20; color: ${t.color}">
                        <i class="fa-solid ${t.icon}"></i>
                    </div>
                    <div class="t-info">
                        <h4>${t.merchant}</h4>
                        <p>${t.date}</p>
                    </div>
                </div>
                <div class="t-amount ${amountClass}">
                    ${sign}${formattedAmount}
                </div>
            </div>
        `;
        
        list.insertAdjacentHTML('beforeend', html);
    });
}
