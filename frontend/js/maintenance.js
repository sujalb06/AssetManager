document.addEventListener('DOMContentLoaded', () => {
    // 1. UI Elements
    const openModalBtn = document.getElementById('openMaintenanceBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('maintenanceModal');
    const maintenanceForm = document.getElementById('maintenanceForm');
    const tableBody = document.getElementById('maintenanceTableBody');
    const assetSelect = document.getElementById('brokenAssetSelect');

    const BASE_URL = 'https://assetmanager-utjo.onrender.com/api';

    // --- 2. MODAL LOGIC ---
    openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
    closeModalBtn.addEventListener('click', () => {
        maintenanceForm.reset();
        modalOverlay.classList.remove('active');
    });

    // --- 3. LOAD ASSETS FOR DROPDOWN ---
    const loadAssetsDropdown = async () => {
        try {
            const response = await fetch(`${BASE_URL}/assets`);
            const assets = await response.json();

            // Only show assets that are NOT already in maintenance
            const availableForRepair = assets.filter(a => a.status !== 'Maintenance');
            
            assetSelect.innerHTML = '<option value="" disabled selected>-- Choose an Asset --</option>';
            
            if (availableForRepair.length === 0) {
                assetSelect.innerHTML += '<option value="" disabled>No assets available to repair</option>';
            } else {
                availableForRepair.forEach(asset => {
                    assetSelect.innerHTML += `<option value="${asset._id}">${asset.name} (#${asset.assetTag})</option>`;
                });
            }
        } catch (error) {
            console.error("Error loading assets:", error);
        }
    };

    // --- 4. FETCH & DISPLAY MAINTENANCE LOGS ---
    const fetchLogs = async () => {
        try {
            const response = await fetch(`${BASE_URL}/maintenance`);
            const logs = await response.json();

            tableBody.innerHTML = ''; 

            logs.forEach(log => {
                const tr = document.createElement('tr');
                
                let badgeClass = log.status === 'Completed' ? 'available' : 'maintenance';
                
                tr.innerHTML = `
                    <td>${log.asset ? log.asset.name : 'Deleted Asset'}</td>
                    <td>${log.issueDescription}</td>
                    <td>₹${log.cost}</td>
                    <td><span class="badge ${badgeClass}">${log.status}</span></td>
                    <td>
                        ${log.status === 'Pending' 
                            ? `<button class="action-btn edit resolve-btn" data-id="${log._id}">Mark Resolved</button>` 
                            : `<span style="color: #888; font-size: 14px;">Done</span>`
                        }
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    // --- 5. LOG A NEW REPAIR (POST) ---
    maintenanceForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const logData = {
            assetId: assetSelect.value,
            issueDescription: document.getElementById('issueDesc').value,
            cost: document.getElementById('repairCost').value
        };

        try {
            const response = await fetch(`${BASE_URL}/maintenance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData)
            });

            if (response.ok) {
                maintenanceForm.reset();
                modalOverlay.classList.remove('active');
                fetchLogs(); 
                loadAssetsDropdown(); 
            } else {
                alert("Error logging maintenance.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    // --- 6. RESOLVE REPAIR (PUT) ---
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('resolve-btn')) {
            const logId = event.target.getAttribute('data-id');

            if (confirm("Mark this repair as completely resolved?")) {
                try {
                    await fetch(`${BASE_URL}/maintenance/${logId}/resolve`, {
                        method: 'PUT'
                    });
                    
                    fetchLogs(); 
                    loadAssetsDropdown(); 
                } catch (error) {
                    console.error("Error resolving repair:", error);
                }
            }
        }
    });

    // Initialize
    loadAssetsDropdown();
    fetchLogs();
});












// =========================================
// MOBILE SIDEBAR TOGGLE LOGIC
// Instructor Note: Attaches a click event listener to the hamburger button to toggle the 'active' class on the sidebar, triggering the CSS transition.
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggles the sliding animation class
            sidebar.classList.toggle('active');
        });
    }
});