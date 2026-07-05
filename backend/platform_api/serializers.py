from rest_framework import serializers

from .models import (
    Application,
    AuditLogEntry,
    Company,
    Guide,
    Project,
    StudentProfile,
    User,
)


class UserSummarySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "role", "name", "department"]

    def get_name(self, obj):
        return obj.get_full_name() or obj.username


class UserSerializer(UserSummarySerializer):
    class Meta(UserSummarySerializer.Meta):
        fields = UserSummarySerializer.Meta.fields + ["email"]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name", "contact_name", "contact_email"]


class ProjectSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    assigned_professor = UserSummarySerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "source",
            "status",
            "company",
            "assigned_professor",
            "required_department",
            "status_token",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "source", "status_token", "created_at", "updated_at"]


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["title", "description", "required_department"]


class ApplicationSerializer(serializers.ModelSerializer):
    student = UserSummarySerializer(read_only=True)
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ["id", "student", "project", "status", "created_at"]


class GuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guide
        fields = [
            "slug",
            "title",
            "category",
            "audience",
            "body",
            "updated_by",
            "updated_at",
        ]
        read_only_fields = ["updated_by", "updated_at"]


class StudentProfileSerializer(serializers.ModelSerializer):
    student = UserSummarySerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = ["student", "looking_for_team", "interests", "bio"]


class AuditLogEntrySerializer(serializers.ModelSerializer):
    actor = UserSummarySerializer(read_only=True)

    class Meta:
        model = AuditLogEntry
        fields = ["id", "actor", "entity", "entity_id", "action", "timestamp"]
