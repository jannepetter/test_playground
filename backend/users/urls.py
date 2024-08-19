from django.urls import path, re_path
from django.contrib.auth.views import LoginView, LogoutView
from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register(r'login', LoginView.as_view(
#     template_name='admin/login.html'), name='login')
# router.register(r'logout', LogoutView.as_view(), name='logout')

# urlpatterns = [
#     # Django authentication views
#     path('login/',
#          LoginView.as_view(template_name='admin/login.html'), name='login'),
#     path('logout/', LogoutView.as_view(), name='logout'),
# ]
