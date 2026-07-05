from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Application,
    AuditLogEntry,
    Company,
    Guide,
    Project,
    StudentProfile,
    User,
)
from .permissions import IsAnyRole, IsOrganizer, IsOrganizerOrProfessor, IsProfessor, IsStudent
from .serializers import (
    ApplicationSerializer,
    AuditLogEntrySerializer,
    GuideSerializer,
    ProjectCreateSerializer,
    ProjectSerializer,
    StudentProfileSerializer,
    UserSerializer,
    UserSummarySerializer,
)


def record_audit(actor, entity, entity_id, action):
    AuditLogEntry.objects.create(
        actor=actor if actor and actor.is_authenticated else None,
        entity=entity,
        entity_id=str(entity_id),
        action=action,
    )


class HealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"ok": True})


class DemoUsersView(APIView):
    """Public: powers the frontend's demo role switcher. Not real auth."""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response(UserSummarySerializer(User.objects.all(), many=True).data)


class MeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"error": "No demo user selected"}, status=401)
        return Response(UserSerializer(request.user).data)


class UserListView(APIView):
    permission_classes = [IsOrganizer]

    def get(self, request):
        return Response(UserSerializer(User.objects.all(), many=True).data)


INTAKE_STATUSES = ["submitted", "under_review"]


class ProjectListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Project.objects.select_related("company", "assigned_professor")

        status_param = request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)

        source_param = request.query_params.get("source")
        if source_param:
            qs = qs.filter(source=source_param)

        if request.query_params.get("unassigned") == "true":
            qs = qs.filter(status="approved", assigned_professor__isnull=True)

        q = request.query_params.get("q")
        if q:
            from django.db.models import Q

            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))

        user = request.user if request.user.is_authenticated else None
        if not user or user.role == User.Role.STUDENT:
            qs = qs.exclude(status__in=INTAKE_STATUSES)
        elif user.role == User.Role.PROFESSOR:
            from django.db.models import Q

            qs = qs.exclude(Q(status__in=INTAKE_STATUSES) & ~Q(assigned_professor=user))

        return Response(ProjectSerializer(qs, many=True).data)

    def post(self, request):
        if not request.user.is_authenticated or request.user.role != User.Role.ORGANIZER:
            return Response({"error": "Forbidden for this role"}, status=403)
        serializer = ProjectCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save(source=Project.Source.INTERNAL, status=Project.Status.SUBMITTED)
        record_audit(request.user, "project", project.id, "created (internal)")
        return Response(ProjectSerializer(project).data, status=201)


class ProjectDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        return Response(ProjectSerializer(project).data)


class ProjectStatusTransitionView(APIView):
    permission_classes = [IsOrganizerOrProfessor]

    def patch(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        new_status = request.data.get("status")
        if not new_status or not project.can_transition_to(new_status):
            return Response(
                {
                    "error": f"Cannot transition from {project.status} to {new_status}",
                    "allowed": sorted(project.ALLOWED_TRANSITIONS.get(project.status, [])),
                },
                status=400,
            )
        project.status = new_status
        project.save()
        record_audit(request.user, "project", project.id, f"status -> {new_status}")
        return Response(ProjectSerializer(project).data)


class ProjectClaimView(APIView):
    permission_classes = [IsProfessor]

    def post(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        user = request.user
        if project.status != Project.Status.APPROVED:
            return Response({"error": "Only approved, unassigned projects can be claimed"}, status=400)
        if project.required_department and project.required_department != user.department:
            return Response(
                {"error": f"This topic requires a supervisor from {project.required_department}"},
                status=403,
            )
        project.assigned_professor = user
        project.status = Project.Status.ASSIGNED
        project.save()
        record_audit(user, "project", project.id, "claimed (assigned professor)")
        return Response(ProjectSerializer(project).data)


class CompanySubmitView(APIView):
    """Public, unauthenticated: mirrors the organizers' existing intake form."""

    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        required = ["companyName", "contactName", "contactEmail", "title", "description"]
        if any(not data.get(f) for f in required):
            return Response({"error": "All fields are required"}, status=400)

        company, _ = Company.objects.get_or_create(
            name=data["companyName"],
            defaults={
                "contact_name": data["contactName"],
                "contact_email": data["contactEmail"],
            },
        )
        project = Project.objects.create(
            title=data["title"],
            description=data["description"],
            source=Project.Source.COMPANY,
            status=Project.Status.SUBMITTED,
            company=company,
            required_department="School of Management",
        )
        record_audit(None, "project", project.id, "submitted by company")
        return Response({"statusToken": project.status_token, "projectId": project.id}, status=201)


class PublicStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        project = get_object_or_404(Project, status_token=token)
        return Response(
            {"title": project.title, "status": project.status, "updatedAt": project.updated_at}
        )


class GuideListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(GuideSerializer(Guide.objects.all(), many=True).data)

    def post(self, request):
        if not request.user.is_authenticated or request.user.role != User.Role.ORGANIZER:
            return Response({"error": "Forbidden for this role"}, status=403)
        if Guide.objects.filter(slug=request.data.get("slug")).exists():
            return Response({"error": "A guide with this slug already exists"}, status=409)
        serializer = GuideSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        guide = serializer.save(updated_by=request.user)
        record_audit(request.user, "guide", guide.slug, "created")
        return Response(GuideSerializer(guide).data, status=201)


class GuideDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        guide = get_object_or_404(Guide, slug=slug)
        return Response(GuideSerializer(guide).data)

    def patch(self, request, slug):
        if not request.user.is_authenticated or request.user.role != User.Role.ORGANIZER:
            return Response({"error": "Forbidden for this role"}, status=403)
        guide = get_object_or_404(Guide, slug=slug)
        serializer = GuideSerializer(guide, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        record_audit(request.user, "guide", guide.slug, "updated")
        return Response(GuideSerializer(guide).data)

    def delete(self, request, slug):
        if not request.user.is_authenticated or request.user.role != User.Role.ORGANIZER:
            return Response({"error": "Forbidden for this role"}, status=403)
        guide = get_object_or_404(Guide, slug=slug)
        record_audit(request.user, "guide", guide.slug, "deleted")
        guide.delete()
        return Response(status=204)


class ApplicationListCreateView(APIView):
    permission_classes = [IsAnyRole]

    def get(self, request):
        qs = Application.objects.select_related("student", "project")
        if request.user.role == User.Role.STUDENT:
            qs = qs.filter(student=request.user)
        project_id = request.query_params.get("projectId")
        if project_id:
            qs = qs.filter(project_id=project_id)
        return Response(ApplicationSerializer(qs, many=True).data)

    def post(self, request):
        if request.user.role != User.Role.STUDENT:
            return Response({"error": "Forbidden for this role"}, status=403)
        project = get_object_or_404(Project, pk=request.data.get("projectId"))
        if Application.objects.filter(student=request.user, project=project).exists():
            return Response({"error": "Already applied to this project"}, status=409)
        application = Application.objects.create(student=request.user, project=project)
        record_audit(request.user, "application", application.id, "created (interested)")
        return Response(ApplicationSerializer(application).data, status=201)


class StudentListView(APIView):
    """Optional teammate finder (req #3): opt-in, browsable list of students looking for a team."""

    permission_classes = [AllowAny]

    def get(self, request):
        qs = StudentProfile.objects.select_related("student")
        if request.query_params.get("lookingForTeam") == "true":
            qs = qs.filter(looking_for_team=True)
        return Response(StudentProfileSerializer(qs, many=True).data)


class StudentProfileView(APIView):
    permission_classes = [IsStudent]

    def put(self, request, pk):
        if str(request.user.pk) != str(pk):
            return Response({"error": "Cannot edit another student's profile"}, status=403)
        profile, _ = StudentProfile.objects.get_or_create(student=request.user)
        profile.looking_for_team = bool(request.data.get("lookingForTeam"))
        profile.interests = request.data.get("interests", profile.interests)
        profile.bio = request.data.get("bio", profile.bio)
        profile.save()
        return Response(StudentProfileSerializer(profile).data)


class AuditLogView(APIView):
    permission_classes = [IsOrganizer]

    def get(self, request):
        qs = AuditLogEntry.objects.select_related("actor")
        project_id = request.query_params.get("projectId")
        if project_id:
            qs = qs.filter(entity_id=str(project_id))
        return Response(AuditLogEntrySerializer(qs, many=True).data)
