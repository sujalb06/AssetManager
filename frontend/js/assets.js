document.addEventListener('DOMContentLoaded', () => {
    // 1. UI Elements Mapping
    const openModalBtn = document.getElementById('openAddAssetBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('addAssetModal');
    const addAssetForm = document.getElementById('addAssetForm');
    const tableBody = document.getElementById('assetTableBody');
    const modalTitle = document.getElementById('modalTitle');

    const API_URL = 'http://localhost:5000/api/assets';
    
    let allAssets = []; 
    let isEditing = false;
    let editAssetId = null;

    // --- 2. MODAL LOGIC ---
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

    // --- 3. FETCH ASSETS ---
    const fetchAssets = async () => {
        try {
            const response = await fetch(API_URL);
            allAssets = await response.json(); 
            tableBody.innerHTML = '';

            allAssets.forEach(asset => {
                const tr = document.createElement('tr');
                let badgeClass = 'available';
                if (asset.status === 'In Use') badgeClass = 'in-use';
                if (asset.status === 'Maintenance') badgeClass = 'maintenance';

                tr.innerHTML = `
                    <td>#${asset.assetTag}</td>
                    <td>${asset.name}</td>
                    <td>${asset.category}</td>
                    <td><span class="badge ${badgeClass}">${asset.status}</span></td>
                    <td>
                        <button class="action-btn edit" data-id="${asset._id}">Edit</button>
                        <button class="action-btn delete" data-id="${asset._id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error fetching assets:", error);
        }
    };

    // --- 4. SAVE OR UPDATE ASSET ---
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
            } else {
                alert("Error saving asset.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    // --- 5. EDIT & DELETE BUTTONS ---
    tableBody.addEventListener('click', async (event) => {
        const assetId = event.target.getAttribute('data-id'); 

        // DELETE
        if (event.target.classList.contains('delete')) {
            if (confirm("Are you sure you want to permanently delete this asset?")) {
                await fetch(`${API_URL}/${assetId}`, { method: 'DELETE' });
                fetchAssets();
            }
        }
        
        // EDIT
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

    // Load data on start
    fetchAssets();
});