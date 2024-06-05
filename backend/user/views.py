from rest_framework import generics, authentication, status
from rest_framework.response import Response
from django.contrib.auth import logout
from django.shortcuts import redirect
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from .models import User



class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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