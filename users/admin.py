from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import ugettext_lazy as _

from .models import User


class UserAdmin(BaseUserAdmin):

    list_display = ('username', 'inn', 'balance')
    fieldsets = BaseUserAdmin.fieldsets + (
        (_('Personal data'), {'fields': ('inn', 'balance')}),
    )


admin.site.register(User, UserAdmin)
