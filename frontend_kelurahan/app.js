// app.js

document.addEventListener('DOMContentLoaded', () => {
    const wargaListContainer = document.getElementById('warga-list-container');
    const apiUrl = 'http://127.0.0.1:8000/api/warga/';
    // API token for 'apiuser' (development only) — do NOT commit this in production
    const TOKEN = '78a20d9a9b8805aa997a224dca9aeb30f97af083';
    const form = document.getElementById('warga-form');
    const statusEl = document.getElementById('form-status');

    function renderWarga(warga) {
        // Membuat elemen untuk setiap warga
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

    async function fetchWarga() {
        try {
            const res = await fetch(apiUrl);
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusEl.textContent = 'Mengirim...';
        const payload = {
            nik: document.getElementById('nik').value.trim(),
            nama_lengkap: document.getElementById('nama_lengkap').value.trim(),
            alamat: document.getElementById('alamat').value.trim(),
            no_telepon: document.getElementById('no_telepon').value.trim()
        };

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${TOKEN}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                // Try to parse JSON error body (e.g., validation errors), otherwise fall back to text
                let errDetail = '';
                try {
                    const json = await res.json();
                    // Format validation errors nicely
                    if (typeof json === 'object') {
                        errDetail = Object.entries(json).map(([k,v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
                    } else {
                        errDetail = JSON.stringify(json);
                    }
                } catch (parseErr) {
                    errDetail = await res.text();
                }
                const message = `HTTP ${res.status} — ${errDetail}`;
                statusEl.textContent = message;
                statusEl.style.color = 'red';
                console.error('Submit error:', message);
                return;
            }

            const created = await res.json();
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