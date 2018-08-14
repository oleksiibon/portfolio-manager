from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('api/v1/employee/', include('employee.urls')),
    path('admin/', admin.site.urls),
]