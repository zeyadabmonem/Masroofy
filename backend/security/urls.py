from django.urls import path
from .views import PINSetupView, PINVerifyView, PINChangeView, PINStatusView

urlpatterns = [
    path('pin/status/', PINStatusView.as_view(), name='pin-status'),
    path('pin/setup/', PINSetupView.as_view(), name='pin-setup'),
    path('pin/verify/', PINVerifyView.as_view(), name='pin-verify'),
    path('pin/change/', PINChangeView.as_view(), name='pin-change'),
]
