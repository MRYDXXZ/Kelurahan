from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Warga, Pengaduan
from .forms import WargaForm, PengaduanForm
# DRF imports for API
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import WargaSerializer


class WargaListView(ListView):
	model = Warga


class WargaRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
	"""API endpoint for retrieve/update/delete of a single Warga by PK.

	GET /api/warga/<pk>/
	PUT /api/warga/<pk>/
	PATCH /api/warga/<pk>/
	DELETE /api/warga/<pk>/
	"""
	queryset = Warga.objects.all()
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
class WargaListCreateAPIView(ListCreateAPIView):
	"""API endpoint that returns a list of Warga (GET) and allows creation (POST).

	GET /api/warga/
	POST /api/warga/
	"""
	queryset = Warga.objects.all()
	serializer_class = WargaSerializer


