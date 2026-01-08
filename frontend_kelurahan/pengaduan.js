document.addEventListener('DOMContentLoaded', () => {
  const apiBase = 'http://127.0.0.1:8000/api/pengaduan/'; // sesuaikan jika backend berbeda
  const wargaApi = 'http://127.0.0.1:8000/api/warga/'; // untuk lookup NIK
  const storageKey = 'api_token';

  const listEl = document.getElementById('pengaduan-list');
  const form = document.getElementById('pengaduan-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const formTitle = document.getElementById('form-title');

  let editingId = null;

  function tokenHeader() {
    try { const t = localStorage.getItem(storageKey); return t ? { 'Authorization': `Token ${t}` } : {}; } catch (e) { return {}; }
  }

  function showStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? 'red' : 'green';
    if (!msg) statusEl.style.color = '';
  }

  async function fetchPengaduan() {
    listEl.innerHTML = '<p class="muted">Memuat data...</p>';
    try {
      const headers = { ...tokenHeader() };
      const res = await fetch(apiBase, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      renderList(items);
    } catch (err) {
      listEl.innerHTML = `<p class="muted">Gagal memuat data: ${err.message}</p>`;
      console.error(err);
    }
  }

  function renderList(items) {
    if (!items || items.length === 0) {
      listEl.innerHTML = '<p class="muted">Belum ada pengaduan.</p>';
      return;
    }
    listEl.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';

      const left = document.createElement('div');
      left.className = 'item-left';
      const h = document.createElement('h3'); h.textContent = item.judul || '(tanpa judul)';
      const d = document.createElement('p'); d.textContent = item.deskripsi || '';
      const meta = document.createElement('div'); meta.className = 'meta';
      const related = item.nik_terkait ? ` • NIK: ${item.nik_terkait}` : '';
      meta.textContent = `Pelapor: ${item.pelapor || '-'} • Kontak: ${item.kontak || '-'}${related}`;

      left.appendChild(h); left.appendChild(d); left.appendChild(meta);

      const actions = document.createElement('div'); actions.className = 'item-actions';
      const editBtn = document.createElement('button'); editBtn.className = 'btn secondary'; editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => startEdit(item));
      const delBtn = document.createElement('button'); delBtn.className = 'btn danger'; delBtn.textContent = 'Hapus';
      delBtn.addEventListener('click', () => deleteItem(item));

      actions.appendChild(editBtn); actions.appendChild(delBtn);

      div.appendChild(left); div.appendChild(actions);
      listEl.appendChild(div);
    });
  }

  function startEdit(item) {
    editingId = item.id || item.pk || item._id;
    document.getElementById('judul').value = item.judul || '';
    document.getElementById('deskripsi').value = item.deskripsi || '';
    document.getElementById('pelapor').value = item.pelapor || '';
    document.getElementById('kontak').value = item.kontak || '';
    document.getElementById('nik_terkait').value = item.nik_terkait || '';
    submitBtn.textContent = 'Simpan Perubahan';
    cancelEditBtn.style.display = 'inline-block';
    formTitle.textContent = 'Sunting Pengaduan';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    editingId = null; form.reset(); submitBtn.textContent = 'Tambah'; cancelEditBtn.style.display = 'none'; formTitle.textContent = 'Tambah Pengaduan'; showStatus('');
  }

  cancelEditBtn.addEventListener('click', resetForm);

  async function deleteItem(item) {
    const id = item.id || item.pk || item._id;
    if (!id) return alert('ID tidak tersedia');
    if (!confirm('Hapus pengaduan ini?')) return;
    try {
      const headers = { ...tokenHeader() };
      const res = await fetch(`${apiBase}${id}/`, { method: 'DELETE', headers });
      if (res.status === 204 || res.ok) {
        showStatus('Berhasil dihapus.'); fetchPengaduan();
      } else { const txt = await res.text().catch(()=> ''); throw new Error(`${res.status} ${txt}`); }
    } catch (err) { showStatus(`Gagal menghapus: ${err.message}`, true); console.error(err); }
    finally { setTimeout(()=> showStatus(''), 2500); }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); showStatus('Mengirim...');
    const payload = {
      judul: document.getElementById('judul').value.trim(),
      deskripsi: document.getElementById('deskripsi').value.trim(),
      pelapor: document.getElementById('pelapor').value.trim(),
      kontak: document.getElementById('kontak').value.trim(),
      nik_terkait: document.getElementById('nik_terkait').value.trim() || null
    };

    try {
      if (!localStorage.getItem(storageKey)) { showStatus('Silakan login terlebih dahulu.', true); setTimeout(()=> window.location.href = 'login.html', 700); return; }
    } catch (e) { /* ignore */ }

    try {
      const headers = { 'Content-Type': 'application/json', ...tokenHeader() };
      let res;
      if (editingId) {
        res = await fetch(`${apiBase}${editingId}/`, { method: 'PUT', headers, body: JSON.stringify(payload) });
      } else {
        res = await fetch(apiBase, { method: 'POST', headers, body: JSON.stringify(payload) });
      }

      if (!res.ok) {
        const json = await res.json().catch(()=> null);
        const txt = json ? JSON.stringify(json) : await res.text().catch(()=> '');
        throw new Error(`${res.status} ${txt}`);
      }

      showStatus(editingId ? 'Berhasil diperbarui.' : 'Berhasil ditambahkan.');
      resetForm(); fetchPengaduan();
    } catch (err) { showStatus(`Gagal menyimpan: ${err.message}`, true); console.error(err); }
    finally { setTimeout(()=> showStatus(''), 3000); }
  });

  // Optional: helper to validate NIK exists in warga endpoint. Returns object or null.
  async function lookupWargaByNIK(nik) {
    if (!nik) return null;
    try {
      const res = await fetch(`${wargaApi}?nik=${encodeURIComponent(nik)}`);
      if (!res.ok) return null;
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      return items[0] || null;
    } catch (e) { return null; }
  }

  // quick UX: when user types NIK, try to fetch and show small hint
  const nikInput = document.getElementById('nik_terkait');
  const hint = document.createElement('div'); hint.className = 'small muted'; hint.style.marginTop = '6px';
  nikInput.parentNode.appendChild(hint);
  let nikTimer = null;
  nikInput.addEventListener('input', () => {
    hint.textContent = '';
    clearTimeout(nikTimer);
    const val = nikInput.value.trim();
    if (!val) return;
    nikTimer = setTimeout(async () => {
      hint.textContent = 'Mencari NIK...';
      const w = await lookupWargaByNIK(val);
      if (w) hint.textContent = `Ditemukan warga: ${w.nama_lengkap || w.nama || '(nama kosong)'}`;
      else hint.textContent = 'Tidak ditemukan warga dengan NIK ini.';
    }, 500);
  });

  // initial
  fetchPengaduan();
});
