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
                return;
            }
            items.forEach(warga => {
                const wargaElement = renderWarga(warga);
                wargaListContainer.appendChild(wargaElement);
            });
        } catch (err) {
            wargaListContainer.innerHTML = '<p>Gagal memuat data. Pastikan server backend berjalan.</p>';
            console.error('Fetch error:', err);
        }
    }

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