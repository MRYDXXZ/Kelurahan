from django.urls import path
from .views import WargaListCreateAPIView, WargaRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('warga/', WargaListCreateAPIView.as_view(), name='api-warga-list'),
    path('warga/<int:pk>/', WargaRetrieveUpdateDestroyAPIView.as_view(), name='api-warga-detail'),
]
