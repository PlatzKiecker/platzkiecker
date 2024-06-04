from django.shortcuts import render
from rest_framework import generics, permissions, authentication, status
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from django.contrib.auth import logout

from rest_framework import generics
from .models import User


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    authentication_classes = [authentication.TokenAuthentication]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserLogoutView(generics.DestroyAPIView):
    queryset = User.objects.all()
    
    def get(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)