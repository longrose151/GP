import logging
from django.shortcuts import render
from .models import User, Withdrawal, UserSubscription
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from .serializers import UserSerializer, WithdrawalSerializer, UserSubscriptionSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
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



class WithdrawalViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    # Endpoint to fetch pending withdrawals remains unchanged
    @action(detail=False, methods=['get'])
    def pending(self, request):
        withdrawals = Withdrawal.objects.filter(user=request.user, status='pending')
        serializer = WithdrawalSerializer(withdrawals, many=True)
        return Response(serializer.data)



    @action(detail=False, methods=['get'])
    def status(self, request):
        try:
            # Get the user's subscription record
            subscription = UserSubscription.objects.get(user=request.user)
            return Response({
                'current_stage': subscription.stage,
                'is_processing': subscription.is_processing,
                'is_completed': subscription.is_completed
            }, status=status.HTTP_200_OK)
        except UserSubscription.DoesNotExist:
            # If the user does not have a subscription record, return a default response
            return Response({
                'current_stage': 1,
                'is_processing': False,
                'is_completed': False
            }, status=status.HTTP_200_OK)
        


    # Endpoint to check if user is qualified for withdrawal remains unchanged
    @action(detail=False, methods=['get'])
    def qualification(self, request):
        subscription = UserSubscription.objects.filter(user=request.user).first()
        
        # Check if the user has reached the final stage and completed it
        if subscription and subscription.stage == 5 and subscription.is_completed:
            qualified = True
        else:
            qualified = False

        return Response({'qualified': qualified}, status=status.HTTP_200_OK)



    @action(detail=False, methods=['post'])
    def upload_receipt(self, request):
        # Try to get the UserSubscription or create a new one if it doesn't exist
        subscription, created = UserSubscription.objects.get_or_create(
            user=request.user,
            defaults={'stage': 1, 'is_processing': True}  # Default values for a new record
        )

        # Check if there is already a payment being processed
        if not created and subscription.is_processing:
            return Response({
                'error': 'Payment for the current stage is already being processed. Please check back later.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if the receipt file is provided
        if 'receipt' in request.FILES:
            # Set the uploaded receipt and mark the stage as "processing"
            subscription.receipt = request.FILES['receipt']
            subscription.is_processing = True
            subscription.is_completed = False  # Reset to false for the current stage
            subscription.save()
            return Response({
                'status': 'Receipt uploaded, payment is processing',
                'current_stage': subscription.stage,
                'check_back': 'Please check back after two business days'
            }, status=status.HTTP_200_OK)

        return Response({'error': 'No receipt provided'}, status=status.HTTP_400_BAD_REQUEST)


    # New `complete_stage` Endpoint
    @action(detail=False, methods=['post'])
    def complete_stage(self, request):
        # Retrieve the user's subscription
        subscription = UserSubscription.objects.filter(user=request.user).first()
        if not subscription:
            return Response({'error': 'No subscription record found.'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark the current stage as completed and stop processing
        subscription.is_processing = False
        subscription.is_completed = True
        subscription.save()

        # Check if there are more stages
        if subscription.stage < 5:
            # Advance to the next stage
            subscription.stage += 1
            subscription.is_completed = False  # Reset for the new stage
            subscription.save()
            return Response({
                'status': f'Stage {subscription.stage - 1} completed. Proceed to stage {subscription.stage}.',
                'current_stage': subscription.stage,
                'next_stage_amount': self.get_stage_amount(subscription.stage)
            }, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'All stages completed!'}, status=status.HTTP_200_OK)

    def get_stage_amount(self, stage):
        # Define stage amounts
        stage_amounts = {
            1: 2000,
            2: 1500,
            3: 2000,
            4: 5000,
            5: 10000
        }
        return stage_amounts.get(stage, 0)


    # Updated `complete_stage` Endpoint
    @action(detail=False, methods=['post'])
    def complete_stage(self, request):
        subscription = UserSubscription.objects.get(user=request.user)
        
        # Check if the current stage is marked as completed and is not processing
        if subscription.is_completed and not subscription.is_processing:
            # Reset `is_completed`, move to the next stage if available
            subscription.is_completed = False
            subscription.is_processing = False  # Reset for the next stage
            subscription.receipt = None  # Clear the receipt field for the new stage
            
            if subscription.stage < 5:
                subscription.stage += 1
            subscription.save()
            
            return Response({
                'status': 'stage completed, proceed to next payment',
                'current_stage': subscription.stage
            }, status=status.HTTP_200_OK)
        
        # If the stage isn't completed or is still processing, inform the user
        return Response({
            'error': 'Stage is either not marked as completed or still in processing'
        }, status=status.HTTP_400_BAD_REQUEST)