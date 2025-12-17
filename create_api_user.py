from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import secrets

username = 'apiuser'
password = secrets.token_urlsafe(16)

user, created = User.objects.get_or_create(username=username)
user.set_password(password)
user.is_active = True
user.save()

token, _ = Token.objects.get_or_create(user=user)
print('USERNAME:', username)
print('PASSWORD:', password)
print('TOKEN:', token.key)
