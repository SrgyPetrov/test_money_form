import pytest

from django.core.management import call_command

from rest_framework.test import APIClient


@pytest.fixture(autouse=True)
def load_data(admin_user):
    fixtures = ['users']
    call_command('loaddata', *fixtures)


@pytest.fixture()
def api_client(admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)
    return client
