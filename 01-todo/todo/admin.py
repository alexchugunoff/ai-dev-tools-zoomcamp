from django.contrib import admin
from .models import Todo


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'resolved', 'due_date', 'created_at')
    list_filter = ('resolved', 'due_date')
    search_fields = ('title', 'description')
