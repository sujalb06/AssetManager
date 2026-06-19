document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Grab all the HTML elements where numbers will go
    const totalAssetsEl = document.getElementById('totalAssets');
    const inUseAssetsEl = document.getElementById('inUseAssets');
    const maintenanceAssetsEl = document.getElementById('maintenanceAssets');
    const totalEmployeesEl = document.getElementById('totalEmployees');

    try {
        // 2. Fetch data from BOTH APIs at the exact same time! (Pro Developer trick)
        const [assetsResponse, employeesResponse] = await Promise.all([
            fetch('https://assetmanager-utjo.onrender.com/api/assets'),
            fetch('https://assetmanager-utjo.onrender.com/api/employees')
        ]);

        // 3. Convert the responses to JSON data
        const assets = await assetsResponse.json();
        const employees = await employeesResponse.json();

        // 4. Do the math!
        const totalAssetsCount = assets.length;
        const totalEmployeesCount = employees.length;
        
        // Filter out specific statuses
        const inUseCount = assets.filter(asset => asset.status === 'In Use').length;
        const maintenanceCount = assets.filter(asset => asset.status === 'Maintenance').length;

        // 5. Update the HTML with the final numbers
        totalAssetsEl.innerText = totalAssetsCount;
        inUseAssetsEl.innerText = inUseCount;
        maintenanceAssetsEl.innerText = maintenanceCount;
        totalEmployeesEl.innerText = totalEmployeesCount;

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        alert("Failed to connect to the database to load dashboard.");
    }
});