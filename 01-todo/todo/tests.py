from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Todo, Tag
from datetime import date


class TodoModelTests(TestCase):
    def test_str_shows_title(self):
        t = Todo.objects.create(title='Buy milk')
        self.assertIn('Buy milk', str(t))


class TodoViewsTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username='alice', password='pw')
        self.tag = Tag.objects.create(name='home', slug='home')
        self.todo = Todo.objects.create(title='Test', description='Desc', assignee=self.user)

    def test_list_view(self):
        url = reverse('todo:list')
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'Test')

    def test_create_view(self):
        url = reverse('todo:create')
        data = {
            'title': 'New',
            'description': 'x',
            'due_date': date.today(),
            'assignee': self.user.pk,
            'priority': Todo.PRIORITY_HIGH,
            'tags': [self.tag.pk],
        }
        r = self.client.post(url, data)
        self.assertEqual(r.status_code, 302)
        self.assertTrue(Todo.objects.filter(title='New').exists())

    def test_mark_resolved_view(self):
        t = self.todo
        url = reverse('todo:resolve', args=[t.pk])
        r = self.client.post(url)
        self.assertEqual(r.status_code, 302)
        t.refresh_from_db()
        self.assertTrue(t.resolved)
        # resolved_at should be set by the domain logic
        self.assertIsNotNone(t.resolved_at)

    def test_mark_resolved_disallows_get(self):
        t = self.todo
        url = reverse('todo:resolve', args=[t.pk])
        r = self.client.get(url)
        # GET is not allowed — expect 405 Method Not Allowed
        self.assertEqual(r.status_code, 405)

    def test_queryset_helpers(self):
        # create an overdue todo and a resolved one
        import datetime

        past = datetime.date.today() - datetime.timedelta(days=2)
        future = datetime.date.today() + datetime.timedelta(days=2)

        overdue = Todo.objects.create(title='old', due_date=past)
        t2 = Todo.objects.create(title='resolved-work', due_date=future)
        t2.mark_resolved()

        self.assertIn(overdue, list(Todo.objects.overdue()))
        self.assertIn(t2, list(Todo.objects.resolved()))
        self.assertIn(self.todo, list(Todo.objects.unresolved()))

    def test_todo_str_and_tag_relation(self):
        t = Todo.objects.create(title='Tagged item')
        t.tags.add(self.tag)
        self.assertIn('Tagged', str(t))
        self.assertIn(self.tag, list(t.tags.all()))
