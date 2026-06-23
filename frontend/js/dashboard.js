document.addEventListener('DOMContentLoaded', async () => {
    
    const totalAssetsEl = document.getElementById('totalAssets');
    const inUseAssetsEl = document.getElementById('inUseAssets');
    const maintenanceAssetsEl = document.getElementById('maintenanceAssets');
    const totalEmployeesEl = document.getElementById('totalEmployees');

    try {
        const [assetsResponse, employeesResponse] = await Promise.all([
            fetch('https://assetmanager-utjo.onrender.com/api/assets'),
            fetch('https://assetmanager-utjo.onrender.com/api/employees')
        ]);

        const assets = await assetsResponse.json();
        const employees = await employeesResponse.json();

        const totalAssetsCount = assets.length;
        const totalEmployeesCount = employees.length;
        
        const inUseCount = assets.filter(asset => asset.status === 'In Use').length;
        const maintenanceCount = assets.filter(asset => asset.status === 'Maintenance').length;
        const availableCount = assets.filter(asset => asset.status === 'Available').length; // Added for chart

        totalAssetsEl.innerText = totalAssetsCount;
        inUseAssetsEl.innerText = inUseCount;
        maintenanceAssetsEl.innerText = maintenanceCount;
        totalEmployeesEl.innerText = totalEmployeesCount;

        // Chart.js Rendering Logic
        const ctx = document.getElementById('assetStatusChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Available', 'In Use', 'In Maintenance'],
                    datasets: [{
                        label: 'Number of Assets',
                        data: [availableCount, inUseCount, maintenanceCount],
                        backgroundColor: [
                            '#4CAF50', // Green
                            '#2196F3', // Blue
                            '#F44336'  // Red
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        alert("Failed to connect to the database to load dashboard.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});