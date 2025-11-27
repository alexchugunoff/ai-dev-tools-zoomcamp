from django.contrib import admin
from .models import Todo, Tag


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'resolved', 'priority', 'assignee', 'due_date', 'created_at')
    list_filter = ('resolved', 'due_date', 'priority')
    search_fields = ('title', 'description')
    filter_horizontal = ('tags',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    search_fields = ('name',)
