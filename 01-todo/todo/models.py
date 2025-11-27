from django.db import models
from django.conf import settings

from django.urls import reverse


class TodoQuerySet(models.QuerySet):
    def resolved(self):
        return self.filter(resolved=True)

    def unresolved(self):
        return self.filter(resolved=False)

    def overdue(self):
        from django.utils import timezone

        today = timezone.localdate()
        return self.filter(due_date__lt=today, resolved=False)


class TodoManager(models.Manager):
    def get_queryset(self):
        return TodoQuerySet(self.model, using=self._db)

    def resolved(self):
        return self.get_queryset().resolved()

    def unresolved(self):
        return self.get_queryset().unresolved()

    def overdue(self):
        return self.get_queryset().overdue()


class Todo(models.Model):
    PRIORITY_LOW = 10
    PRIORITY_MEDIUM = 20
    PRIORITY_HIGH = 30
    PRIORITY_CHOICES = [
        (PRIORITY_LOW, 'Low'),
        (PRIORITY_MEDIUM, 'Medium'),
        (PRIORITY_HIGH, 'High'),
    ]

    title = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    resolved = models.BooleanField(default=False)
    # timestamp when task was resolved — useful for auditing and sorting
    resolved_at = models.DateTimeField(null=True, blank=True)
    # optional assignee — link to project/user who is responsible
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='todos'
    )
    priority = models.PositiveSmallIntegerField(choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
    tags = models.ManyToManyField('Tag', blank=True, related_name='todos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    # attach custom manager for convenient query helpers
    objects = TodoManager()

    def __str__(self):
        return f"{'✓ ' if self.resolved else ''}{self.title}"

    def get_absolute_url(self):
        return reverse('todo:list')

    def mark_resolved(self):
        """Mark a Todo as resolved and set resolved_at timestamp.

        Keep this small piece of domain logic here so views/handlers call a
        single method and tests can verify behaviour deterministically.
        """
        if not self.resolved:
            from django.utils import timezone

            self.resolved = True
            self.resolved_at = timezone.now()
            self.save(update_fields=['resolved', 'resolved_at'])

    @property
    def is_overdue(self):
        """True if the todo has a due_date in the past and is not resolved."""
        from django.utils import timezone

        if self.due_date is None or self.resolved:
            return False
        # compare date to timezone-aware `now` in project timezone
        return self.due_date < timezone.localdate()


    # manager classes are declared earlier in the file


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    def __str__(self):
        return self.name
