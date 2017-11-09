import pytest

from decimal import Decimal

from django.core.urlresolvers import reverse

from rest_framework import status


class TestUserList:

    url = reverse('user_list')

    def test_get_all(self, api_client):
        response = api_client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 5
        assert response.data[0]['username'] == 'one'
        assert response.data[0]['inn'] == '111111111111'
        assert response.data[0]['balance'] == '10.10'

    def test_filter_by_inn(self, api_client):
        url = '{}?query=33'.format(self.url)
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['username'] == 'three'
        assert response.data[0]['inn'] == '333333333333'

    def test_filter_by_username(self, api_client):
        url = '{}?query=o'.format(self.url)
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
        usernames = [i['username'] for i in response.data]
        assert sorted(usernames) == ['four', 'one', 'two']

    def test_filter_empty(self, api_client):
        url = '{}?query=o33'.format(self.url)
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0


class TestTransfer:

    url = reverse('transfer')

    def test_no_amout(self, api_client):
        data = {'user': 1, 'recipients': ['333333333333']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'amount': ['Это поле обязательно.']}}

    def test_no_user(self, api_client):
        data = {'amount': '10.10', 'recipients': ['333333333333']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'user': ['Это поле обязательно.']}}

    def test_no_recipients(self, api_client):
        data = {'amount': '10.10', 'user': 1}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'recipients': ['Список получателей пуст.']}}

    def test_negative_amount(self, api_client):
        data = {'user': 1, 'amount': '-10.10', 'recipients': ['333333333333']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'amount': [
            'Убедитесь, что значение больше или равно 0.01.'
        ]}}

    def test_invalid_amount(self, api_client):
        data = {'user': 1, 'amount': 'test', 'recipients': ['333333333333']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'amount': ['Требуется численное значение.']}}

    def test_invalid_user(self, api_client):
        data = {'user': -1, 'amount': '10.10', 'recipients': ['333333333333']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'user': [
            'Недопустимый первичный ключ "-1" - объект не существует.'
        ]}}

    def test_not_exist_user(self, api_client):
        data = {'user': 10, 'amount': '10.10', 'recipients': ['333333333333']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'user': [
            'Недопустимый первичный ключ "10" - объект не существует.'
        ]}}

    def test_empty_recipients(self, api_client):
        data = {'user': 1, 'amount': '10.10', 'recipients': []}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'recipients': ['Список получателей пуст.']}}

    def test_wrong_recipient(self, api_client):
        data = {'user': 1, 'amount': '10.10', 'recipients': ['333333333333', 'test']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'recipients': [
            'Получатель с ИНН=test не существует.'
        ]}}

    def test_invalid_recipients(self, api_client):
        data = {'user': 1, 'amount': '10.10', 'recipients': 'test'}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'recipients': [
            'Получатель с ИНН=test не существует.'
        ]}}

    def test_user_in_recipients(self, api_client):
        data = {'user': 3, 'amount': '10.10', 'recipients': ['333333333333']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'non_field_errors': [
            ('Пользователь со счета которого нужно перевести деньги '
             'не может быть в списке получателей.')
        ]}}

    def test_user_low_balance(self, api_client):
        data = {'user': 1, 'amount': '20.10', 'recipients': ['333333333333']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'non_field_errors': ['Недостаточно средств.']}}

    def test_inequal_division(self, api_client):
        data = {'user': 5, 'amount': '10.13', 'recipients': ['333333333333', '444444444444']}
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'errors': {'non_field_errors': [
            'Сумма не может быть поделена ровно между получателями.'
        ]}}

    @pytest.mark.parametrize("data,expected", [
        (
            {'user': 5, 'amount': '10.24', 'recipients': ['333333333333', '444444444444']},
            [Decimal('35.42'), Decimal('45.52')]
        ),
        (
            {'user': 5, 'amount': '10.24', 'recipients': ['222222222222']},
            [Decimal('30.44')]
        )
    ])
    def test_success(self, django_user_model, api_client, data, expected):
        response = api_client.post(self.url, data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'success': True}
        user = django_user_model.objects.get(pk=data['user'])
        recipients = django_user_model.objects.filter(inn__in=data['recipients'])
        balances = sorted(recipients.values_list('balance', flat=True))
        assert user.balance == Decimal('40.26')
        assert balances == expected
