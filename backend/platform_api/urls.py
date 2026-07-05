from django.urls import path

from . import views

urlpatterns = [
    path("health", views.HealthView.as_view()),
    path("demo-users", views.DemoUsersView.as_view()),
    path("me", views.MeView.as_view()),
    path("users", views.UserListView.as_view()),
    path("projects", views.ProjectListCreateView.as_view()),
    path("projects/<int:pk>", views.ProjectDetailView.as_view()),
    path("projects/<int:pk>/status", views.ProjectStatusTransitionView.as_view()),
    path("projects/<int:pk>/claim", views.ProjectClaimView.as_view()),
    path("companies/submit", views.CompanySubmitView.as_view()),
    path("public/status/<str:token>", views.PublicStatusView.as_view()),
    path("guides", views.GuideListCreateView.as_view()),
    path("guides/<slug:slug>", views.GuideDetailView.as_view()),
    path("applications", views.ApplicationListCreateView.as_view()),
    path("students", views.StudentListView.as_view()),
    path("students/<int:pk>/profile", views.StudentProfileView.as_view()),
    path("audit-log", views.AuditLogView.as_view()),
]
