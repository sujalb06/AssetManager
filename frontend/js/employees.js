document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const openModalBtn = document.getElementById('openAddEmployeeBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('addEmployeeModal');
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const tableBody = document.getElementById('employeeTableBody');

    // Employee Backend API
    const API_URL = 'http://localhost:5000/api/employees';

    // --- 1. MODAL LOGIC ---
    openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
    
    const closeModal = () => {
        addEmployeeForm.reset();
        modalOverlay.classList.remove('active');
    };
    closeModalBtn.addEventListener('click', closeModal);

    // --- 2. FETCH AND DISPLAY EMPLOYEES ---
    const fetchEmployees = async () => {
        try {
            const response = await fetch(API_URL);
            const employees = await response.json();

            tableBody.innerHTML = ''; // Clear table

            employees.forEach(emp => {
                const tr = document.createElement('tr');
                
                // Color code the role badge
                let badgeClass = emp.role === 'Admin' ? 'in-use' : 'available';

                tr.innerHTML = `
                    <td>${emp.name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                    <td><span class="badge ${badgeClass}">${emp.role}</span></td>
                    <td>
                        <button class="action-btn edit" data-id="${emp._id}">Edit</button>
                        <button class="action-btn delete" data-id="${emp._id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // --- 3. SAVE A NEW EMPLOYEE ---
    addEmployeeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newEmployee = {
            name: document.getElementById('empName').value,
            email: document.getElementById('empEmail').value,
            department: document.getElementById('empDepartment').value,
            role: document.getElementById('empRole').value
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployee)
            });

            if (response.ok) {
                closeModal();
                fetchEmployees(); // Refresh the table automatically!
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error saving employee:", error);
        }
    });

    // Run on page load
    fetchEmployees();
});