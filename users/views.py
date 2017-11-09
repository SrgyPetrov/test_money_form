from django.db.models import Q
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .billing import make_transfer
from .models import User
from .serializers import UserSerializer, TransferSerializer


class UserList(ListAPIView):

    serializer_class = UserSerializer

    def get_queryset(self):
        qs = User.objects.filter(is_active=True, is_superuser=False, is_staff=False)
        query = self.request.query_params.get('query', None)
        if query is not None:
            qs = qs.filter(Q(inn__contains=query) | Q(username__contains=query))
        return qs


@api_view(['POST'])
def transfer(request):
    serializer = TransferSerializer(data=request.data)
    if serializer.is_valid():
        make_transfer(
            serializer.validated_data['user'],
            serializer.validated_data['amount'],
            serializer.validated_data['recipients']
        )
        return Response({'success': True})
    return Response({'errors': serializer.errors})
