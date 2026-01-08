#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'data_kelurahan.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

# Get or create superuser
user = User.objects.get(username='admin')

# Get or create token
token, created = Token.objects.get_or_create(user=user)

print(f"\n{'='*50}")
print(f"USER: {user.username}")
print(f"EMAIL: {user.email}")
print(f"IS SUPERUSER: {user.is_superuser}")
print(f"TOKEN: {token.key}")
print(f"{'='*50}\n")
