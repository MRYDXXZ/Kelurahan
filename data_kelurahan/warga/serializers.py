from rest_framework import serializers
from .models import Warga, Pengaduan


class WargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warga
        # Expose fields for the API
        fields = ['id', 'nik', 'nama_lengkap', 'alamat', 'no_telepon']


class PengaduanSerializer(serializers.ModelSerializer):
    pelapor_nama = serializers.CharField(source='pelapor.nama_lengkap', read_only=True)

    class Meta:
        model = Pengaduan
        fields = ['id', 'judul', 'isi', 'status', 'tanggal_pengaduan', 'pelapor', 'pelapor_nama']
