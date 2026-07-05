import secrets

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ORGANIZER = "organizer", "Organizer"
        PROFESSOR = "professor", "Professor"
        STUDENT = "student", "Student"

    role = models.CharField(max_length=20, choices=Role.choices)
    department = models.CharField(max_length=120, blank=True, default="")

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"


class Company(models.Model):
    name = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=200)
    contact_email = models.EmailField()

    def __str__(self):
        return self.name


def generate_status_token():
    return secrets.token_urlsafe(9)


class Project(models.Model):
    class Source(models.TextChoices):
        COMPANY = "company", "Company"
        INTERNAL = "internal", "Internal"

    class Status(models.TextChoices):
        SUBMITTED = "submitted", "Submitted"
        UNDER_REVIEW = "under_review", "Under review"
        APPROVED = "approved", "Approved"
        ASSIGNED = "assigned", "Assigned"
        IN_PROGRESS = "in_progress", "In progress"
        COMPLETED = "completed", "Completed"
        REJECTED = "rejected", "Rejected"

    ALLOWED_TRANSITIONS = {
        Status.SUBMITTED: {Status.UNDER_REVIEW, Status.REJECTED},
        Status.UNDER_REVIEW: {Status.APPROVED, Status.REJECTED},
        Status.APPROVED: {Status.ASSIGNED, Status.REJECTED},
        Status.ASSIGNED: {Status.IN_PROGRESS, Status.APPROVED},
        Status.IN_PROGRESS: {Status.COMPLETED},
        Status.COMPLETED: set(),
        Status.REJECTED: set(),
    }

    title = models.CharField(max_length=250)
    description = models.TextField()
    source = models.CharField(max_length=20, choices=Source.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    company = models.ForeignKey(
        Company, null=True, blank=True, on_delete=models.SET_NULL, related_name="projects"
    )
    assigned_professor = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="supervised_projects",
        limit_choices_to={"role": User.Role.PROFESSOR},
    )
    required_department = models.CharField(max_length=120, blank=True, default="")
    status_token = models.CharField(max_length=32, unique=True, default=generate_status_token)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def can_transition_to(self, new_status: str) -> bool:
        return new_status in self.ALLOWED_TRANSITIONS.get(self.status, set())

    def __str__(self):
        return self.title


class Application(models.Model):
    class Status(models.TextChoices):
        INTERESTED = "interested", "Interested"
        ACCEPTED = "accepted", "Accepted"
        DECLINED = "declined", "Declined"

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="applications")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="applications")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INTERESTED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "project")


class Guide(models.Model):
    class Audience(models.TextChoices):
        ALL = "all", "All"
        ORGANIZER = "organizer", "Organizer"
        PROFESSOR = "professor", "Professor"
        STUDENT = "student", "Student"

    slug = models.SlugField(max_length=120, unique=True)
    title = models.CharField(max_length=250)
    category = models.CharField(max_length=120, default="General")
    audience = models.CharField(max_length=20, choices=Audience.choices, default=Audience.ALL)
    body = models.TextField()
    updated_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class StudentProfile(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    looking_for_team = models.BooleanField(default=False)
    interests = models.CharField(max_length=300, blank=True, default="")
    bio = models.TextField(blank=True, default="")


class AuditLogEntry(models.Model):
    class Entity(models.TextChoices):
        PROJECT = "project", "Project"
        GUIDE = "guide", "Guide"
        APPLICATION = "application", "Application"

    actor = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    entity = models.CharField(max_length=20, choices=Entity.choices)
    entity_id = models.CharField(max_length=20)
    action = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
