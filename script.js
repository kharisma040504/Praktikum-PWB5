document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('datasetForm');
    const datasetTableBody = document.getElementById('datasetTableBody');
    const searchDatasetInput = document.getElementById('searchDataset');

    // Menangani submit form dataset
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validasi form sebelum mengirimkan data
        const validationResult = validateForm();
        if (validationResult.isValid) {
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            const existingDatasetIndex = findDatasetIndex(data.datasetName, data.creator);
            if (existingDatasetIndex !== -1) {
                // Jika dataset dengan nama dan pembuat yang sama sudah ada, update data tersebut
                updateDataset(existingDatasetIndex, data);
            } else {
                // Jika dataset belum ada, tambahkan data baru ke dalam tabel
                addDatasetToTable(data);
            }
            
            // Reset form setelah disubmit
            form.reset();
        } else {
            // Tampilkan pesan keterangan di bawah kolom input yang tidak terisi
            for (let fieldName of validationResult.emptyFields) {
                const fieldInput = document.getElementById(fieldName);
                fieldInput.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                const errorMessage = document.createElement('span');
                errorMessage.textContent = 'Field ini wajib diisi.';
                errorMessage.style.color = 'red';
                errorMessage.className = 'error-message';
                if (!fieldInput.parentNode.querySelector('.error-message')) {
                    fieldInput.parentNode.appendChild(errorMessage);
                }
            }
        }
    });

    // Fungsi untuk menemukan indeks dataset dengan nama dan pembuat yang sama
    function findDatasetIndex(datasetName, creator) {
        const rows = datasetTableBody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const nameColumn = rows[i].getElementsByTagName('td')[0];
            const creatorColumn = rows[i].getElementsByTagName('td')[1];
            if (nameColumn && creatorColumn) {
                const nameText = nameColumn.textContent || nameColumn.innerText;
                const creatorText = creatorColumn.textContent || creatorColumn.innerText;
                if (nameText === datasetName && creatorText === creator) {
                    return i;
                }
            }
        }
        return -1;
    }

    // Fungsi untuk mengupdate dataset yang sudah ada
    function updateDataset(index, newData) {
        const row = datasetTableBody.getElementsByTagName('tr')[index];
        const recordedTime = row.cells[10].textContent;
        row.innerHTML = `
            <td>${newData.datasetName}</td>
            <td>${newData.creator}</td>
            <td>${newData.verifier}</td>
            <td>${newData.recordCount}</td>
            <td>${newData.attributeCount}</td>
            <td>${newData.dataSource}</td>
            <td>${newData.startDate}</td>
            <td>${newData.endDate}</td>
            <td>${newData.status}</td>
            <td>${newData.notes}</td>
            <td>${recordedTime}</td>
            <td>${new Date().toLocaleString()}</td>
        `;
    }

    // Fungsi untuk menambahkan data dataset ke dalam tabel
    function addDatasetToTable(dataset) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dataset.datasetName}</td>
            <td>${dataset.creator}</td>
            <td>${dataset.verifier}</td>
            <td>${dataset.recordCount}</td>
            <td>${dataset.attributeCount}</td>
            <td>${dataset.dataSource}</td>
            <td>${dataset.startDate}</td>
            <td>${dataset.endDate}</td>
            <td>${dataset.status}</td>
            <td>${dataset.notes}</td>
            <td>${new Date().toLocaleString()}</td>
            <td>${new Date().toLocaleString()}</td>
        `;
        datasetTableBody.appendChild(row);
    }

    // Fungsi untuk melakukan validasi form sebelum submit
    function validateForm() {
        const datasetName = document.getElementById('datasetName').value.trim();
        const creator = document.getElementById('creator').value.trim();
        const verifier = document.getElementById('verifier').value.trim();
        const recordCount = document.getElementById('recordCount').value.trim();
        const attributeCount = document.getElementById('attributeCount').value.trim();
        const dataSource = document.getElementById('dataSource').value.trim();
        const startDate = document.getElementById('startDate').value.trim();
        const endDate = document.getElementById('endDate').value.trim();
        const status = document.getElementById('status').value.trim();
        
        const emptyFields = [];
        
        // Validasi input kosong
        if (datasetName === '') {
            emptyFields.push('datasetName');
        }
        if (creator === '') {
            emptyFields.push('creator');
        }
        if (verifier === '') {
            emptyFields.push('verifier');
        }
        if (recordCount === '') {
            emptyFields.push('recordCount');
        }
        if (attributeCount === '') {
            emptyFields.push('attributeCount');
        }
        if (dataSource === '') {
            emptyFields.push('dataSource');
        }
        if (startDate === '') {
            emptyFields.push('startDate');
        }
        if (endDate === '') {
            emptyFields.push('endDate');
        }
        if (status === '') {
            emptyFields.push('status');
        }
        
        // Validasi tanggal mulai lebih awal daripada tanggal selesai
        if (startDate !== '' && endDate !== '' && new Date(startDate) > new Date(endDate)) {
            alert('Tanggal mulai harus lebih awal daripada tanggal selesai.');
            return { isValid: false, emptyFields };
        }
        
        return { isValid: emptyFields.length === 0, emptyFields };
    }

    // Fungsi untuk mencari dataset berdasarkan nama dataset
    function searchDataset() {
        const filter = searchDatasetInput.value.toUpperCase();
        const rows = datasetTableBody.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const nameColumn = rows[i].getElementsByTagName('td')[0];
            if (nameColumn) {
                const nameText = nameColumn.textContent || nameColumn.innerText;
                if (nameText.toUpperCase().indexOf(filter) > -1) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }       
        }
    }
});
