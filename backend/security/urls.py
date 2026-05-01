from django.urls import path
from .views import PINSetupView, PINVerifyView

urlpatterns = [
    path('pin/setup/', PINSetupView.as_view(), name='pin-setup'),
    path('pin/verify/', PINVerifyView.as_view(), name='pin-verify'),
]
