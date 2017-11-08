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
        queryset=User.objects.filter(is_active=True, is_superuser=False, is_staff=False)
    )
    recipients = serializers.SlugRelatedField(
        many=True,
        slug_field='inn',
        queryset=User.objects.filter(is_active=True, is_superuser=False, is_staff=False)
    )

    def validate_recipients(self, value):
        if not value:
            raise serializers.ValidationError(_("Recipients list is empty"))
        return value
