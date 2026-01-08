// app.js
const API_URL = 'http://127.0.0.1:8000/api/warga/';
const AUTH_TOKEN = '31aff164c2a680575c19848017db323182020fc9'; // Admin token for authentication

// Function to render a single warga card
function renderWarga(warga) {
    const wargaDiv = document.createElement('div');
    wargaDiv.className = 'warga-card';

    const nama = document.createElement('h3');
    nama.textContent = warga.nama_lengkap;

    const nik = document.createElement('p');
    nik.innerHTML = `<strong>NIK:</strong> ${warga.nik}`;

    const alamat = document.createElement('p');
    alamat.innerHTML = `<strong>Alamat:</strong> ${warga.alamat}`;

    const noTelepon = document.createElement('p');
    noTelepon.innerHTML = `<strong>No. Telepon:</strong> ${warga.no_telepon}`;

    const tanggalRegistrasi = document.createElement('p');
    const tanggal = new Date(warga.tanggal_registrasi).toLocaleDateString('id-ID');
    tanggalRegistrasi.innerHTML = `<strong>Terdaftar:</strong> ${tanggal}`;

    wargaDiv.appendChild(nama);
    wargaDiv.appendChild(nik);
    wargaDiv.appendChild(alamat);
    wargaDiv.appendChild(noTelepon);
    wargaDiv.appendChild(tanggalRegistrasi);

    return wargaDiv;
}

// Function to load and display warga list
function loadWargaList() {
    const wargaListContainer = document.getElementById('warga-list-container');

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            wargaListContainer.innerHTML = ''; // Clear loading message

            if (!data.results || data.results.length === 0) {
                wargaListContainer.innerHTML = '<p style="text-align: center; color: #999;">Tidak ada data warga</p>';
                return;
            }

            data.results.forEach(warga => {
                const wargaElement = renderWarga(warga);
                wargaListContainer.appendChild(wargaElement);
            });
        })
        .catch(error => {
            wargaListContainer.innerHTML = '<div class="error-message">❌ Gagal memuat data. Pastikan server backend berjalan di http://127.0.0.1:8000</div>';
            console.error('Error fetching warga:', error);
        });
}

// Function to show message
function showMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 3000);
}

// Function to add new warga
function addNewWarga(event) {
    event.preventDefault();

    const nik = document.getElementById('nik').value;
    const nama_lengkap = document.getElementById('nama_lengkap').value;
    const alamat = document.getElementById('alamat').value;
    const no_telepon = document.getElementById('no_telepon').value;

    const wargaData = {
        nik: nik,
        nama_lengkap: nama_lengkap,
        alamat: alamat,
        no_telepon: no_telepon
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${AUTH_TOKEN}` // Add authentication token
        },
        body: JSON.stringify(wargaData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add warga');
            }
            return response.json();
        })
        .then(data => {
            showMessage('✅ Warga berhasil ditambahkan!', 'success');
            document.getElementById('warga-form').reset(); // Clear form
            loadWargaList(); // Refresh list
        })
        .catch(error => {
            showMessage('❌ Gagal menambahkan warga. Periksa data Anda.', 'error');
            console.error('Error adding warga:', error);
        });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load initial warga list
    loadWargaList();

    // Attach form submission handler
    const form = document.getElementById('warga-form');
    if (form) {
        form.addEventListener('submit', addNewWarga);
    }

    // Refresh list every 10 seconds (optional)
    // setInterval(loadWargaList, 10000);
});
