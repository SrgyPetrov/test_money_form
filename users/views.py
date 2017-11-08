from django.db.models import Q
from rest_framework.generics import ListAPIView

from .models import User
from .serializers import UserSerializer


class UserList(ListAPIView):

    serializer_class = UserSerializer

    def get_queryset(self):
        qs = User.objects.filter(is_active=True, is_superuser=False, is_staff=False)
        query = self.request.query_params.get('query', None)
        if query is not None:
            qs = qs.filter(Q(inn__contains=query) | Q(username__contains=query))
        return qs
