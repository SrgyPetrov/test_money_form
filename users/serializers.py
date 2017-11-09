from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('pk', 'username', 'inn', 'balance')


class TransferSerializer(serializers.Serializer):

    amount = serializers.DecimalField(max_digits=14, decimal_places=2, min_value=0)
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_active=True, is_superuser=False, is_staff=False),
        error_messages={
            'null': _('This field may not be empty.')
        }
    )
    recipients = serializers.SlugRelatedField(
        many=True,
        slug_field='inn',
        queryset=User.objects.filter(is_active=True, is_superuser=False, is_staff=False),
        error_messages={
            'does_not_exist': _('Object with INN={value} does not exist.')
        }
    )

    def validate_recipients(self, value):
        if not value:
            raise serializers.ValidationError(_("Recipients list is empty."))
        return value

    def validate(self, data):
        if data['user'] in data['recipients']:
            raise serializers.ValidationError(_("User may not be in recipients."))
        if data['user'].balance < data['amount']:
            raise serializers.ValidationError(_("Insufficient funds."))
        if data['amount'] % len(data['recipients']):
            raise serializers.ValidationError(_("Can not be divided equally."))
        return data
