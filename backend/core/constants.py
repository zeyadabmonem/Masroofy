# App-wide constants

# Expense Categories
EXPENSE_CATEGORIES = [
    ('FOOD', 'Food & Dining'),
    ('TRANSPORT', 'Transportation'),
    ('SHOPPING', 'Shopping'),
    ('BILLS', 'Bills & Utilities'),
    ('ENTERTAINMENT', 'Entertainment'),
    ('EDUCATION', 'Education'),
    ('OTHER', 'Other'),
]

# Notification Types
NOTIFICATION_TYPES = [
    ('WARNING_80', '80% Budget Used'),
    ('EXHAUSTED', 'Budget Exhausted'),
    ('SYSTEM', 'System Alert'),
]

# Business Rules
DEFAULT_CURRENCY = 'EGP'
MAX_PIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15
BUDGET_THRESHOLD_WARNING = 0.80  # 80%

# Date Formats
DATE_FORMAT = '%Y-%m-%d'
DATETIME_FORMAT = '%Y-%m-%d %H:%M:%S'
