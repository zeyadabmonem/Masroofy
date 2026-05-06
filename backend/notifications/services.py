from notifications.models import NotificationLog
from budgets.models import BudgetCycle
from budgets.services import DailyLimitEngine


class NotificationService:

    @staticmethod
    def get_notifications(cycle: BudgetCycle):
        return NotificationLog.objects.filter(cycle=cycle).order_by('-created_at')

    @staticmethod
    def dismiss_notification(notification: NotificationLog):
        notification.is_dismissed = True
        notification.save()

    @staticmethod
    def dismiss_all(cycle: BudgetCycle):
        NotificationLog.objects.filter(cycle=cycle, is_dismissed=False).update(is_dismissed=True)

    @staticmethod
    def check_and_trigger(cycle: BudgetCycle) -> list:
        """
        Evaluates the current budget state and creates notification records
        if thresholds are crossed and that notification hasn't already been triggered.
        Returns a list of newly created notifications.
        """
        summary = DailyLimitEngine.calculate(cycle)
        alert_level = summary['alert_level']
        new_notifications = []

        if alert_level == 'WARNING':
            already_exists = NotificationLog.objects.filter(
                cycle=cycle,
                notification_type='WARNING_80',
            ).exists()
            if not already_exists:
                notif = NotificationLog.objects.create(
                    cycle=cycle,
                    notification_type='WARNING_80',
                    message=f"You have used {summary['spending_percentage']}% of your budget. "
                            f"Your new daily limit is {summary['safe_daily_limit']} EGP.",
                )
                new_notifications.append(notif)

        elif alert_level == 'EXHAUSTED':
            # Also create warning if not exists (in case it was skipped)
            if not NotificationLog.objects.filter(cycle=cycle, notification_type='WARNING_80').exists():
                NotificationLog.objects.create(
                    cycle=cycle,
                    notification_type='WARNING_80',
                    message="You crossed the 80% spending threshold.",
                )
            # Create exhausted alert if not exists
            if not NotificationLog.objects.filter(cycle=cycle, notification_type='EXHAUSTED').exists():
                notif = NotificationLog.objects.create(
                    cycle=cycle,
                    notification_type='EXHAUSTED',
                    message=f"Your budget of {summary['total_allowance']} EGP has been exhausted.",
                )
                new_notifications.append(notif)

        return new_notifications
