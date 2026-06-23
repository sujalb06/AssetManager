document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openAssignModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('addAssignmentModal');
    const assignAssetForm = document.getElementById('assignAssetForm');
    const tableBody = document.getElementById('assignmentTableBody');
    
    const assetSelect = document.getElementById('assetSelect');
    const employeeSelect = document.getElementById('employeeSelect');

    const BASE_URL = 'https://assetmanager-utjo.onrender.com/api';

    openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
    closeModalBtn.addEventListener('click', () => {
        assignAssetForm.reset();
        modalOverlay.classList.remove('active');
    });

    const loadDropdownData = async () => {
        try {
            const [assetsRes, employeesRes] = await Promise.all([
                fetch(`${BASE_URL}/assets`),
                fetch(`${BASE_URL}/employees`)
            ]);

            const assets = await assetsRes.json();
            const employees = await employeesRes.json();

            const availableAssets = assets.filter(a => a.status === 'Available');
            assetSelect.innerHTML = '<option value="">-- Select an Asset --</option>'; 
            
            if (availableAssets.length === 0) {
                assetSelect.innerHTML += '<option value="" disabled>No assets available!</option>';
            } else {
                availableAssets.forEach(asset => {
                    assetSelect.innerHTML += `<option value="${asset._id}">${asset.name} (#${asset.assetTag})</option>`;
                });
            }

            employeeSelect.innerHTML = '<option value="">-- Select an Employee --</option>'; 
            employees.forEach(emp => {
                employeeSelect.innerHTML += `<option value="${emp._id}">${emp.name} (${emp.department})</option>`;
            });

        } catch (error) {
            console.error("Error loading dropdowns:", error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/assignments`);
            const assignments = await response.json();

            tableBody.innerHTML = ''; 

            assignments.forEach(assignment => {
                const tr = document.createElement('tr');
                
                const dateObj = new Date(assignment.assignedDate);
                const formattedDate = dateObj.toLocaleDateString();

                let badgeClass = assignment.status === 'Active' ? 'in-use' : 'available';
                
                tr.innerHTML = `
                    <td data-label="Asset Name">${assignment.asset ? assignment.asset.name : 'Deleted Asset'}</td>
                    <td data-label="Assigned To">${assignment.employee ? assignment.employee.name : 'Deleted Employee'}</td>
                    <td data-label="Date Assigned">${formattedDate}</td>
                    <td data-label="Status"><span class="badge ${badgeClass}">${assignment.status}</span></td>
                    <td data-label="Actions">
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
                
                fetchAssignments(); 
                loadDropdownData(); 
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error assigning asset:", error);
        }
    });

    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('return-btn')) {
            const assignmentId = event.target.getAttribute('data-id');

            if (confirm("Mark this asset as returned?")) {
                try {
                    await fetch(`${BASE_URL}/assignments/${assignmentId}/return`, {
                        method: 'PUT'
                    });
                    
                    fetchAssignments(); 
                    loadDropdownData(); 
                } catch (error) {
                    console.error("Error returning asset:", error);
                }
            }
        }
    });

    loadDropdownData();
    fetchAssignments();
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