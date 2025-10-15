from django import forms
from .models import Warga, Pengaduan


class WargaForm(forms.ModelForm):
    class Meta:
        model = Warga
        # Tentukan field mana saja dari model yang ingin ditampilkan di form
        fields = ['nik', 'nama_lengkap', 'alamat', 'no_telepon']


class PengaduanForm(forms.ModelForm):
    class Meta:
        model = Pengaduan
        # Include fields: judul, isi, status, pelapor
        fields = ['judul', 'isi', 'status', 'pelapor']
