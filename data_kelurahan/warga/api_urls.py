from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WargaViewSet, PengaduanViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'warga', WargaViewSet, basename='warga')
router.register(r'pengaduan', PengaduanViewSet, basename='pengaduan')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
