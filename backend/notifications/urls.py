from django.urls import path
from .views import (
    NotificationListView,
    NotificationCheckView,
    NotificationDismissView,
    NotificationDismissAllView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('check/', NotificationCheckView.as_view(), name='notification-check'),
    path('<int:pk>/dismiss/', NotificationDismissView.as_view(), name='notification-dismiss'),
    path('dismiss-all/', NotificationDismissAllView.as_view(), name='notification-dismiss-all'),
]
