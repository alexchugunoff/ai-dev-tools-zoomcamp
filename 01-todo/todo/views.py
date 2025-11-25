from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from .models import Todo
from .forms import TodoForm


class TodoListView(ListView):
    model = Todo
    template_name = 'todo/todo_list.html'
    context_object_name = 'todos'


class TodoCreateView(CreateView):
    model = Todo
    form_class = TodoForm
    template_name = 'todo/todo_form.html'
    success_url = reverse_lazy('todo:list')


class TodoUpdateView(UpdateView):
    model = Todo
    form_class = TodoForm
    template_name = 'todo/todo_form.html'
    success_url = reverse_lazy('todo:list')


class TodoDeleteView(DeleteView):
    model = Todo
    template_name = 'todo/todo_confirm_delete.html'
    success_url = reverse_lazy('todo:list')


def mark_resolved(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.resolved = True
    todo.save()
    return redirect('todo:list')
