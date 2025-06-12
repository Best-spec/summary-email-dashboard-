from django.shortcuts import render
from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

def index(request):
    todos = Todo.objects.all()
    return render(request, 'api/index.html', {'todos': todos})
