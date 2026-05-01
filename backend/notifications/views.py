from rest_framework.views import APIView
from core.response import standard_response
from core.exceptions import ResourceNotFoundException
from budgets.services import BudgetService
from .serializers import NotificationLogSerializer
from .services import NotificationService
from .models import NotificationLog


class NotificationListView(APIView):
    def get(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        notifications = NotificationService.get_notifications(cycle)
        serializer = NotificationLogSerializer(notifications, many=True)
        unread_count = notifications.filter(is_dismissed=False).count()
        return standard_response(data={
            'notifications': serializer.data,
            'unread_count': unread_count,
        })


class NotificationCheckView(APIView):
    """Called after every transaction to trigger any new alerts."""
    def post(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        new_notifications = NotificationService.check_and_trigger(cycle)
        serializer = NotificationLogSerializer(new_notifications, many=True)
        return standard_response(
            data={'triggered': serializer.data},
            message=f"{len(new_notifications)} new alert(s) triggered." if new_notifications else "No new alerts."
        )


class NotificationDismissView(APIView):
    def patch(self, request, pk):
        try:
            notification = NotificationLog.objects.get(pk=pk, cycle__user=request.user)
        except NotificationLog.DoesNotExist:
            raise ResourceNotFoundException("Notification not found.")
        NotificationService.dismiss_notification(notification)
        return standard_response(message="Notification dismissed.")


class NotificationDismissAllView(APIView):
    def patch(self, request):
        cycle = BudgetService.get_active_cycle(request.user)
        NotificationService.dismiss_all(cycle)
        return standard_response(message="All notifications dismissed.")
