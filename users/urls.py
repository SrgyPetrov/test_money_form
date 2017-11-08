from django.conf.urls import url

from .views import UserList

urlpatterns = [
    url(r'^$', UserList.as_view(), name='user_list')
]
