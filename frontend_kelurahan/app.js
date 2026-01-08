<<<<<<< HEAD
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
=======
document.addEventListener('DOMContentLoaded', () => {
    const wargaListContainer = document.getElementById('warga-list-container');
    const apiUrl = 'http://127.0.0.1:8000/api/warga/';
    const storageKey = 'api_token';
    const form = document.getElementById('warga-form');
    const statusEl = document.getElementById('form-status');

    // --- Top bar: auth status + login/logout button ---
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'space-between';
    topBar.style.alignItems = 'center';
    topBar.style.margin = '12px 0';
    topBar.style.gap = '8px';

    const title = document.createElement('div');
    title.textContent = 'Data Warga Kelurahan';
    title.style.fontWeight = '600';

    // link to pengaduan page
    const pengaduanLink = document.createElement('a');
    pengaduanLink.href = 'pengaduan.html';
    pengaduanLink.textContent = 'Pengaduan';
    pengaduanLink.style.marginLeft = '12px';
    pengaduanLink.style.color = '#2563eb';
    pengaduanLink.style.textDecoration = 'none';
    pengaduanLink.title = 'Kelola pengaduan';

    const authStatus = document.createElement('div');
    authStatus.style.fontSize = '0.95rem';

    const authBtn = document.createElement('button');
    authBtn.style.padding = '6px 10px';
    authBtn.style.cursor = 'pointer';

    function hasLocalToken() {
        try {
            return !!localStorage.getItem(storageKey);
        } catch (e) {
            console.error('Storage access error', e);
            return false;
        }
    }

    function currentToken() {
        try {
            return localStorage.getItem(storageKey) || '';
        } catch (e) {
            return '';
        }
    }

    function updateAuthUI() {
        const logged = hasLocalToken();
        authStatus.textContent = logged ? 'Terhubung' : 'Belum login';
        authStatus.style.color = logged ? 'green' : '#555';
        authBtn.textContent = logged ? 'Logout' : 'Login';
    }

    authBtn.addEventListener('click', () => {
        if (hasLocalToken()) {
            // logout: hapus token dan redirect ke login.html
            try {
                localStorage.removeItem(storageKey);
            } catch (e) {
                console.error('Failed to remove token', e);
            }
            updateAuthUI();
            window.location.href = 'login.html';
        } else {
            // belum login -> pergi ke halaman login
            window.location.href = 'login.html';
        }
    });

    topBar.appendChild(title);
    const rightBox = document.createElement('div');
    rightBox.style.display = 'flex';
    rightBox.style.alignItems = 'center';
    rightBox.style.gap = '10px';
    rightBox.appendChild(authStatus);
    rightBox.appendChild(authBtn);
    rightBox.appendChild(pengaduanLink);
    topBar.appendChild(rightBox);

    document.body.insertBefore(topBar, document.body.firstChild);
    updateAuthUI();

    // --- Render warga item ---
    function renderWarga(warga) {
        const wargaDiv = document.createElement('div');
        wargaDiv.style.border = '1px solid #ccc';
        wargaDiv.style.padding = '10px';
        wargaDiv.style.marginBottom = '10px';

        const nama = document.createElement('h3');
        nama.textContent = warga.nama_lengkap || warga.nama || '—';

        const nik = document.createElement('p');
        nik.textContent = `NIK: ${warga.nik || '—'}`;

        const alamat = document.createElement('p');
        alamat.textContent = `Alamat: ${warga.alamat || '—'}`;

        wargaDiv.appendChild(nama);
        wargaDiv.appendChild(nik);
        wargaDiv.appendChild(alamat);

        return wargaDiv;
    }

    // --- Fetch warga list ---
    async function fetchWarga() {
        try {
            const headers = {};
            const tok = currentToken();
            if (tok) headers['Authorization'] = `Token ${tok}`;

            const res = await fetch(apiUrl, { headers });
            if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
            const data = await res.json();
            wargaListContainer.innerHTML = '';
            const items = Array.isArray(data) ? data : (data.results || []);
            if (items.length === 0) {
                wargaListContainer.innerHTML = '<p>Tidak ada data warga.</p>';
>>>>>>> 521baa5a9ecb4016f797709b004ed9b62bf9d717
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

<<<<<<< HEAD
    // Refresh list every 10 seconds (optional)
    // setInterval(loadWargaList, 10000);
});
=======
    // --- Form submit: require login to POST ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusEl.textContent = 'Mengirim...';
        statusEl.style.color = '';

        const payload = {
            nik: document.getElementById('nik').value.trim(),
            nama_lengkap: document.getElementById('nama_lengkap').value.trim(),
            alamat: document.getElementById('alamat').value.trim(),
            no_telepon: document.getElementById('no_telepon').value.trim()
        };

        if (!hasLocalToken()) {
            statusEl.textContent = 'Anda harus login terlebih dahulu.';
            statusEl.style.color = 'red';
            setTimeout(() => { window.location.href = 'login.html'; }, 700);
            return;
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Token ${currentToken()}`
            };

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                let errDetail = '';
                try {
                    const json = await res.json();
                    if (typeof json === 'object') {
                        errDetail = Object.entries(json).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
                    } else {
                        errDetail = JSON.stringify(json);
                    }
                } catch (parseErr) {
                    errDetail = await res.text().catch(() => '');
                }
                const message = `HTTP ${res.status} — ${errDetail}`;
                statusEl.textContent = message;
                statusEl.style.color = 'red';
                console.error('Submit error:', message);
                return;
            }

            await res.json();
            statusEl.textContent = 'Berhasil ditambahkan.';
            statusEl.style.color = 'green';
            form.reset();
            await fetchWarga();
        } catch (err) {
            statusEl.textContent = `Gagal mengirim data: ${err.message}`;
            statusEl.style.color = 'red';
            console.error('Submit error:', err);
        } finally {
            setTimeout(() => { statusEl.textContent = ''; statusEl.style.color = ''; }, 5000);
        }
    });

    // Initial load
    fetchWarga();
});
>>>>>>> 521baa5a9ecb4016f797709b004ed9b62bf9d717
