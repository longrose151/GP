import logging
from django.shortcuts import render
from .models import User
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.contrib.auth import authenticate, get_user_model
# Create your views here.

logger = logging.getLogger(__name__)
User = get_user_model()


class ObtainTokenView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username_or_email = request.data.get('username')
        password = request.data.get('password')

        # Check if both username/email and password are provided
        if not username_or_email or not password:
            logger.info("[ObtainTokenView] Missing username or password.")
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"[ObtainTokenView] Username or Email: {username_or_email}")

        # Attempt to find user by email or username
        try:
            if '@' in username_or_email:
                user = User.objects.get(email=username_or_email)
            else:
                user = User.objects.get(username=username_or_email)
        except User.DoesNotExist:
            logger.info("[ObtainTokenView] No user found with this email or username.")
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Ensure the user is active
        if not user.is_active:
            logger.info(f"[ObtainTokenView] User {username_or_email} is inactive.")
            return Response({"detail": "User is inactive."}, status=status.HTTP_403_FORBIDDEN)

        # Authenticate the user using Django's `authenticate`
        logger.info("[ObtainTokenView] Attempting standard authentication.")
        authenticated_user = authenticate(request, username=user.username, password=password)
        if authenticated_user is None:
            logger.info("[ObtainTokenView] Standard authentication failed.")
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Log the authenticated user
        logger.info(f"[ObtainTokenView] Authenticated User: {authenticated_user.username}")

        # Generate JWT token using RefreshToken directly
        refresh = RefreshToken.for_user(authenticated_user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_type': str(authenticated_user.user_type),
            'user_name': str(authenticated_user.first_name)
        }

        return Response(data, status=status.HTTP_200_OK)



class RefreshTokenView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]


class VerifyTokenView(TokenVerifyView):
    permission_classes = [permissions.AllowAny]



class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"message": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(user.password)
        user.save()