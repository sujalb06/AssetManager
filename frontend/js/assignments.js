document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const openModalBtn = document.getElementById('openAssignModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('addAssignmentModal');
    const assignAssetForm = document.getElementById('assignAssetForm');
    const tableBody = document.getElementById('assignmentTableBody');
    
    // Dropdowns
    const assetSelect = document.getElementById('assetSelect');
    const employeeSelect = document.getElementById('employeeSelect');

    // API URLs
    const BASE_URL = 'http://localhost:5000/api';

    // --- 1. MODAL LOGIC ---
    openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
    closeModalBtn.addEventListener('click', () => {
        assignAssetForm.reset();
        modalOverlay.classList.remove('active');
    });

    // --- 2. FETCH DROPDOWN DATA (Assets & Employees) ---
    const loadDropdownData = async () => {
        try {
            // Fetch both at the same time using Promise.all
            const [assetsRes, employeesRes] = await Promise.all([
                fetch(`${BASE_URL}/assets`),
                fetch(`${BASE_URL}/employees`)
            ]);

            const assets = await assetsRes.json();
            const employees = await employeesRes.json();

            // Populate Assets Dropdown (ONLY 'Available' assets)
            const availableAssets = assets.filter(a => a.status === 'Available');
            assetSelect.innerHTML = '<option value="">-- Select an Asset --</option>'; // Clear loading text
            
            if (availableAssets.length === 0) {
                assetSelect.innerHTML += '<option value="" disabled>No assets available!</option>';
            } else {
                availableAssets.forEach(asset => {
                    assetSelect.innerHTML += `<option value="${asset._id}">${asset.name} (#${asset.assetTag})</option>`;
                });
            }

            // Populate Employees Dropdown
            employeeSelect.innerHTML = '<option value="">-- Select an Employee --</option>'; // Clear loading text
            employees.forEach(emp => {
                employeeSelect.innerHTML += `<option value="${emp._id}">${emp.name} (${emp.department})</option>`;
            });

        } catch (error) {
            console.error("Error loading dropdowns:", error);
        }
    };

    // --- 3. FETCH AND DISPLAY ASSIGNMENTS ---
    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/assignments`);
            const assignments = await response.json();

            tableBody.innerHTML = ''; 

            assignments.forEach(assignment => {
                const tr = document.createElement('tr');
                
                // Format the date to look nice (e.g., "18 Jun 2026")
                const dateObj = new Date(assignment.assignedDate);
                const formattedDate = dateObj.toLocaleDateString();

                let badgeClass = assignment.status === 'Active' ? 'in-use' : 'available';
                
                // Note: We use assignment.asset.name because we used .populate() in our backend!
                tr.innerHTML = `
                    <td>${assignment.asset ? assignment.asset.name : 'Deleted Asset'}</td>
                    <td>${assignment.employee ? assignment.employee.name : 'Deleted Employee'}</td>
                    <td>${formattedDate}</td>
                    <td><span class="badge ${badgeClass}">${assignment.status}</span></td>
                    <td>
                        ${assignment.status === 'Active' 
                            ? `<button class="action-btn edit return-btn" data-id="${assignment._id}">Return</button>` 
                            : `<span style="color: #888; font-size: 14px;">Closed</span>`
                        }
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    // --- 4. ASSIGN AN ASSET (Form Submit) ---
    assignAssetForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const assignmentData = {
            assetId: assetSelect.value,
            employeeId: employeeSelect.value
        };

        try {
            const response = await fetch(`${BASE_URL}/assignments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assignmentData)
            });

            if (response.ok) {
                assignAssetForm.reset();
                modalOverlay.classList.remove('active');
                
                // Refresh data
                fetchAssignments(); 
                loadDropdownData(); // Refresh dropdowns so the assigned asset disappears from the list!
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error assigning asset:", error);
        }
    });

    // --- 5. RETURN AN ASSET ---
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('return-btn')) {
            const assignmentId = event.target.getAttribute('data-id');

            if (confirm("Mark this asset as returned?")) {
                try {
                    await fetch(`${BASE_URL}/assignments/${assignmentId}/return`, {
                        method: 'PUT'
                    });
                    
                    fetchAssignments(); // Refresh table
                    loadDropdownData(); // Refresh dropdowns (asset is available again!)
                } catch (error) {
                    console.error("Error returning asset:", error);
                }
            }
        }
    });

    // Run on startup
    loadDropdownData();
    fetchAssignments();
});