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
        return standard_response(data=serializer.data)

class NotificationDismissView(APIView):
    def patch(self, request, pk):
        try:
            notification = NotificationLog.objects.get(pk=pk, cycle__user=request.user)
        except NotificationLog.DoesNotExist:
            raise ResourceNotFoundException("Notification not found.")
        
        NotificationService.dismiss_notification(notification)
        return standard_response(message="Notification dismissed.")
