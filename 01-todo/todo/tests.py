from django.test import TestCase
from django.urls import reverse
from .models import Todo
from datetime import date


class TodoModelTests(TestCase):
    def test_str_shows_title(self):
        t = Todo.objects.create(title='Buy milk')
        self.assertIn('Buy milk', str(t))


class TodoViewsTests(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(title='Test', description='Desc')

    def test_list_view(self):
        url = reverse('todo:list')
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Test')

    def test_create_view(self):
        url = reverse('todo:create')
        r = self.client.post(url, {'title': 'New', 'description': 'x', 'due_date': date.today()})
        self.assertEqual(r.status_code, 302)
        self.assertTrue(Todo.objects.filter(title='New').exists())

    def test_mark_resolved_view(self):
        t = self.todo
        url = reverse('todo:resolve', args=[t.pk])
        r = self.client.post(url)
        self.assertEqual(r.status_code, 302)
        t.refresh_from_db()
        self.assertTrue(t.resolved)
