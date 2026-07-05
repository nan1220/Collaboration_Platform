from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    Application,
    AuditLogEntry,
    Company,
    Guide,
    Project,
    StudentProfile,
    User,
)


@admin.register(User)
class PlatformUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Platform role", {"fields": ("role", "department")}),)
    list_display = ("username", "first_name", "last_name", "role", "department", "is_staff")
    list_filter = ("role", "department", "is_staff")


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "contact_name", "contact_email")
    search_fields = ("name", "contact_name", "contact_email")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "source", "status", "company", "assigned_professor", "updated_at")
    list_filter = ("status", "source", "required_department")
    search_fields = ("title", "description")
    readonly_fields = ("status_token", "created_at", "updated_at")


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("student", "project", "status", "created_at")
    list_filter = ("status",)


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "category", "audience", "updated_at")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ("student", "looking_for_team")


@admin.register(AuditLogEntry)
class AuditLogEntryAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "actor", "entity", "entity_id", "action")
    list_filter = ("entity",)
    readonly_fields = [f.name for f in AuditLogEntry._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
