from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Warga, Pengaduan
from .forms import WargaForm, PengaduanForm
# DRF imports for API
from rest_framework import viewsets
from .serializers import WargaSerializer, PengaduanSerializer


class WargaListView(ListView):
	model = Warga


class WargaViewSet(viewsets.ModelViewSet):
	"""API endpoint that allows Warga to be viewed or edited via ViewSet/Router."""
	queryset = Warga.objects.all().order_by('-tanggal_registrasi')
	serializer_class = WargaSerializer


class WargaDetailView(DetailView):
	model = Warga


class PengaduanListView(ListView):
	model = Pengaduan
	template_name = 'warga/pengaduan_list.html'
	context_object_name = 'daftar_pengaduan'
	ordering = ['-tanggal_pengaduan']

class WargaCreateView(CreateView):
	model = Warga
	form_class = WargaForm
	template_name = 'warga/warga_form.html'
	success_url = reverse_lazy('warga-list')


class PengaduanCreateView(CreateView):
	model = Pengaduan
	form_class = PengaduanForm
	template_name = 'warga/pengaduan_form.html'
	success_url = reverse_lazy('pengaduan-list')


class WargaUpdateView(UpdateView):
	model = Warga
	form_class = WargaForm
	template_name = 'warga/warga_form.html'
	success_url = reverse_lazy('warga-list')


class WargaDeleteView(DeleteView):
	model = Warga
	template_name = 'warga/warga_confirm_delete.html'
	success_url = reverse_lazy('warga-list')


class PengaduanUpdateView(UpdateView):
	model = Pengaduan
	form_class = PengaduanForm
	template_name = 'warga/pengaduan_form.html'
	success_url = reverse_lazy('pengaduan-list')


class PengaduanDeleteView(DeleteView):
	model = Pengaduan
	template_name = 'warga/pengaduan_confirm_delete.html'
	success_url = reverse_lazy('pengaduan-list')


# --- API VIEWS ---
class PengaduanViewSet(viewsets.ModelViewSet):
	"""API endpoint that allows Pengaduan to be viewed or edited via ViewSet/Router."""
	queryset = Pengaduan.objects.all().order_by('-tanggal_pengaduan')
	serializer_class = PengaduanSerializer


