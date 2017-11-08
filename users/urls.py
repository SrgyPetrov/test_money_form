from django.conf.urls import url

from .views import UserList, transfer

urlpatterns = [
    url(r'^$', UserList.as_view(), name='user_list'),
    url(r'^transfer/$', transfer, name='transfer')
]
