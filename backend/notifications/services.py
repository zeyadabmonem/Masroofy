from .models import NotificationLog
from budgets.models import BudgetCycle

class NotificationService:
    @staticmethod
    def get_notifications(cycle: BudgetCycle):
        return NotificationLog.objects.filter(cycle=cycle).order_by('-created_at')

    @staticmethod
    def create_notification(cycle: BudgetCycle, notification_type: str, message: str):
        return NotificationLog.objects.create(
            cycle=cycle,
            notification_type=notification_type,
            message=message
        )

    @staticmethod
    def dismiss_notification(notification: NotificationLog):
        notification.is_dismissed = True
        notification.save()
