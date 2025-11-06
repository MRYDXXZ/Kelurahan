from rest_framework import serializers
from .models import Warga


class WargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warga
        # Expose fields for the API
        fields = ['id', 'nik', 'nama_lengkap', 'alamat', 'no_telepon']
