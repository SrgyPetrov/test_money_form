from django.db import transaction
from django.db.models import F

from .models import User


@transaction.atomic
def make_transfer(user, amount, recipients):
    user.balance -= amount
    user.save()
    per_recipient_amount = amount / len(recipients)
    recipients_ids = [r.pk for r in recipients]
    User.objects.filter(pk__in=recipients_ids).update(balance=F('balance') + per_recipient_amount)
