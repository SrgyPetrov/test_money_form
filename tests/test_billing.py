import pytest

from users.billing import make_transfer

from decimal import Decimal


def test_make_transfer(django_user_model):
    user = django_user_model.objects.get(pk=5)
    recipients = django_user_model.objects.exclude(pk=5)
    make_transfer(user, Decimal(40), recipients)
    updated_user = django_user_model.objects.get(pk=5)
    updated_recipients = django_user_model.objects.exclude(pk=5).order_by('balance')
    updated_balances = updated_recipients.values_list('balance', flat=True)
    assert updated_user.balance == Decimal('10.50')
    assert list(updated_balances) == [Decimal('20.10'), Decimal('30.20'),
                                      Decimal('40.30'), Decimal('50.40')]


def test_make_transfer_error(django_user_model):
    user = django_user_model.objects.get(pk=1)
    with pytest.raises(ZeroDivisionError):
        make_transfer(user, Decimal(10), [])
    updated_user = django_user_model.objects.get(pk=1)
    assert updated_user.balance == Decimal('10.10')
