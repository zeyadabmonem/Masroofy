from django.urls import path
from .views import NotificationListView, NotificationDismissView

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/dismiss/', NotificationDismissView.as_view(), name='notification-dismiss'),
]
