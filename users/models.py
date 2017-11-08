from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, RegexValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _

from decimal import Decimal


class User(AbstractUser):

    inn = models.CharField(
        _('INN'),
        max_length=12,
        validators=[
            RegexValidator(regex=r'\d{9}|\d{10}|\d{12}')
        ]
    )
    balance = models.DecimalField(
        _('Balance'),
        max_digits=14,
        decimal_places=2,
        default=0.0,
        validators=[
            MinValueValidator(Decimal(0))
        ]
    )
