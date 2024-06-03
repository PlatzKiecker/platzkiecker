from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):

    def create_user(self, email, password, team, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(email=BaseUserManager.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        return self.create_user(email, password, team=Team.objects.create(), is_admin=True)


class Team(models.Model):
    stripe_customer_id = models.CharField(max_length=255)


class User(AbstractBaseUser):
    email = models.EmailField(unique=True, max_length=255)
    created = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def _str_(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin