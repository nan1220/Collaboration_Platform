from django.core.management.base import BaseCommand

from platform_api.models import Application, Company, Guide, Project, StudentProfile, User


class Command(BaseCommand):
    help = "Wipes and reseeds a handful of demo users/projects/guides for local development."

    def handle(self, *args, **options):
        Application.objects.all().delete()
        Project.objects.all().delete()
        Company.objects.all().delete()
        Guide.objects.all().delete()
        StudentProfile.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        # Demo accounts are anonymized (S = student, P = professor, C = company,
        # U = university staff) - no real names, for the privacy of the people
        # who actually gave interviews for the SRS this prototype is based on.
        organizer = User.objects.create_user("u1", role=User.Role.ORGANIZER, first_name="Staff", last_name="U1")
        prof_mgmt = User.objects.create_user(
            "p1", role=User.Role.PROFESSOR, department="School of Management",
            first_name="Professor", last_name="P1",
        )
        prof_cs = User.objects.create_user(
            "p2", role=User.Role.PROFESSOR, department="Informatics",
            first_name="Professor", last_name="P2",
        )
        student1 = User.objects.create_user("s1", role=User.Role.STUDENT, first_name="Student", last_name="S1")
        student2 = User.objects.create_user("s2", role=User.Role.STUDENT, first_name="Student", last_name="S2")

        company = Company.objects.create(
            name="Company C1", contact_name="Contact Person C1",
            contact_email="contact@companyc1.example",
        )
        p1 = Project.objects.create(
            title="Demand forecasting for regional retail chain",
            description="Forecasting model for weekly demand across 40 stores using two years of POS data.",
            source=Project.Source.COMPANY, status=Project.Status.IN_PROGRESS,
            company=company, assigned_professor=prof_mgmt, required_department="School of Management",
        )
        Project.objects.create(
            title="Customer churn analysis for SaaS product",
            description="Root cause analysis of trial-to-paid churn for a B2B SaaS company.",
            source=Project.Source.COMPANY, status=Project.Status.APPROVED,
            company=company, required_department="School of Management",
        )
        Project.objects.create(
            title="Open-source contribution tracking dashboard",
            description="Internal research topic: dashboard summarizing contribution patterns across OSS repos.",
            source=Project.Source.INTERNAL, status=Project.Status.SUBMITTED,
            required_department="Informatics",
        )
        Application.objects.create(student=student1, project=p1, status=Application.Status.ACCEPTED)
        StudentProfile.objects.create(
            student=student2, looking_for_team=True,
            interests="Data analysis, market research", bio="Looking for a teammate for an analytics project.",
        )

        Guide.objects.create(
            slug="finding-a-supervisor-for-company-topics",
            title="Finding a supervisor for a company-submitted topic",
            category="Company projects", audience=Guide.Audience.STUDENT,
            body=(
                "Company-submitted topics need a supervisor from the department the topic is tagged "
                "with (usually School of Management for business topics) - a professor who has taught "
                "you in an unrelated department may not be eligible, even if you know them. Check the "
                "required department on the project page, then browse eligible professors."
            ),
            updated_by=organizer,
        )
        Guide.objects.create(
            slug="how-project-status-works",
            title="What the project status labels mean",
            category="General", audience=Guide.Audience.ALL,
            body=(
                "Projects move through submitted, under review, approved, assigned, in progress, "
                "completed (or rejected). Every change is logged so organizers and students can see "
                "the real state of a project."
            ),
            updated_by=organizer,
        )

        self.stdout.write(self.style.SUCCESS("Seeded demo data."))
