from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin
from .views import UserViewSet, WithdrawalViewSet

router =DefaultRouter()


router.register(r'users', UserViewSet)
router.register(r'withdrawals', WithdrawalViewSet, basename='withdrawals')

urlpatterns = [
    path('', include(router.urls)),

]

