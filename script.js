document.addEventListener('DOMContentLoaded', () => {
    initSpendingGauge();
    loadTransactions();
});

function initSpendingGauge() {
    const ctx = document.getElementById('spendingGauge').getContext('2d');
    
    // TD Colors
    const tdGreen = '#008a00';
    const tdLightGreen = '#e8f5e9';
    const tdLime = '#a4c639';
    
    // Data
    const spent = 1923;
    const typical = 2024;
    const remaining = typical - spent;
    
    // Gradient for the progress bar
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, tdLime);
    gradient.addColorStop(1, tdGreen);

    const data = {
        labels: ['Spent', 'Remaining'],
        datasets: [{
            data: [spent, remaining],
            backgroundColor: [
                gradient,
                '#f0f0f0'
            ],
            borderWidth: 0,
            borderRadius: 20,
            cutout: '85%',
            circumference: 280,
            rotation: 220
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    new Chart(ctx, config);
}

function loadTransactions() {
    const transactions = [
        {
            id: 1,
            merchant: 'Uber Eats',
            date: 'Today, 12:30 PM',
            amount: -24.50,
            category: 'Food',
            icon: 'fa-burger',
            color: '#FF9800'
        },
        {
            id: 2,
            merchant: 'Shell Station',
            date: 'Yesterday',
            amount: -45.00,
            category: 'Transport',
            icon: 'fa-gas-pump',
            color: '#F44336'
        },
        {
            id: 3,
            merchant: 'Spotify Premium',
            date: 'Nov 24',
            amount: -11.99,
            category: 'Entertainment',
            icon: 'fa-music',
            color: '#1DB954'
        },
        {
            id: 4,
            merchant: 'Salary Deposit',
            date: 'Nov 15',
            amount: 2450.00,
            category: 'Income',
            icon: 'fa-money-bill-wave',
            color: '#008a00'
        }
    ];

    const list = document.querySelector('.transaction-list');
    
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

