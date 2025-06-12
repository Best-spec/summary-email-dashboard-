from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, index

router = DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('', index, name='index')
]
