document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openAddAssetBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('addAssetModal');
    const addAssetForm = document.getElementById('addAssetForm');
    const tableBody = document.getElementById('assetTableBody');
    const modalTitle = document.getElementById('modalTitle');
    const searchInput = document.getElementById('searchInput'); // New Search Input

    const API_URL = 'https://assetmanager-utjo.onrender.com/api/assets';
    
    let allAssets = []; 
    let isEditing = false;
    let editAssetId = null;

    const resetModal = () => {
        addAssetForm.reset();
        isEditing = false;
        editAssetId = null;
        if(modalTitle) modalTitle.innerText = 'Add New Asset';
        modalOverlay.classList.remove('active');
    };

    openModalBtn.addEventListener('click', () => {
        resetModal();
        modalOverlay.classList.add('active');
    });
    
    closeModalBtn.addEventListener('click', resetModal);

    // --- NEW: RENDER TABLE FUNCTION ---
    // Instructor Note: Separated table rendering into its own function so that the search filter can easily update the DOM without needing to hit the API again.
    const renderTable = (assetsToRender) => {
        tableBody.innerHTML = '';

        if (assetsToRender.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No assets found.</td></tr>';
            return;
        }

        assetsToRender.forEach(asset => {
            const tr = document.createElement('tr');
            let badgeClass = 'available';
            if (asset.status === 'In Use') badgeClass = 'in-use';
            if (asset.status === 'Maintenance') badgeClass = 'maintenance';

            tr.innerHTML = `
                <td data-label="Asset Tag">#${asset.assetTag}</td>
                <td data-label="Name">${asset.name}</td>
                <td data-label="Category">${asset.category}</td>
                <td data-label="Status"><span class="badge ${badgeClass}">${asset.status}</span></td>
                <td data-label="Actions">
                    <button class="action-btn edit" data-id="${asset._id}">Edit</button>
                    <button class="action-btn delete" data-id="${asset._id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };

    const fetchAssets = async () => {
        try {
            const response = await fetch(API_URL);
            allAssets = await response.json(); 
            renderTable(allAssets); // Call the render function
        } catch (error) {
            console.error("Error fetching assets:", error);
        }
    };

    // --- NEW: LIVE SEARCH LOGIC ---
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            
            // Filters the array dynamically based on the input
            const filteredAssets = allAssets.filter(asset => 
                asset.name.toLowerCase().includes(searchTerm) || 
                asset.assetTag.toLowerCase().includes(searchTerm) ||
                asset.category.toLowerCase().includes(searchTerm)
            );
            
            // Re-render the table with the filtered results
            renderTable(filteredAssets);
        });
    }

    addAssetForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const assetData = {
            assetTag: document.getElementById('assetTag').value,
            name: document.getElementById('assetName').value,
            category: document.getElementById('assetCategory').value,
            status: document.getElementById('assetStatus').value
        };

        try {
            let response;
            if (isEditing) {
                response = await fetch(`${API_URL}/${editAssetId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(assetData)
                });
            } else {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(assetData)
                });
            }

            if (response.ok) {
                resetModal();
                fetchAssets(); 
                searchInput.value = ''; // Clear search bar on save
            } else {
                alert("Error saving asset.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    tableBody.addEventListener('click', async (event) => {
        const assetId = event.target.getAttribute('data-id'); 

        if (event.target.classList.contains('delete')) {
            if (confirm("Are you sure you want to permanently delete this asset?")) {
                await fetch(`${API_URL}/${assetId}`, { method: 'DELETE' });
                fetchAssets();
                searchInput.value = ''; 
            }
        }
        
        if (event.target.classList.contains('edit')) {
            const assetToEdit = allAssets.find(a => a._id === assetId);

            document.getElementById('assetTag').value = assetToEdit.assetTag;
            document.getElementById('assetName').value = assetToEdit.name;
            document.getElementById('assetCategory').value = assetToEdit.category;
            document.getElementById('assetStatus').value = assetToEdit.status;

            isEditing = true;
            editAssetId = assetId;
            if(modalTitle) modalTitle.innerText = 'Edit Asset'; 
            
            modalOverlay.classList.add('active');
        }
    });

    fetchAssets();
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