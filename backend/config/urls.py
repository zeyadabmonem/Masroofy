from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('security.urls')),
    path('api/v1/users/', include('users.urls')),
    path('api/v1/budgets/', include('budgets.urls')),
    path('api/v1/transactions/', include('transactions.urls')),
    path('api/v1/analytics/', include('analytics.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
]
