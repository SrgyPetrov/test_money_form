from rest_framework.generics import ListAPIView

from .models import User
from .serializers import UserSerializer


class UserList(ListAPIView):

    queryset = User.objects.filter(is_active=True, inn__isnull=False)
    serializer_class = UserSerializer
