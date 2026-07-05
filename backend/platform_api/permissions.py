from rest_framework.permissions import BasePermission

from .models import User


def role_permission(*roles: str):
    """Build a DRF permission class restricting a view to the given demo-user roles."""

    class _RolePermission(BasePermission):
        def has_permission(self, request, view):
            user = request.user
            return bool(user and user.is_authenticated and user.role in roles)

    return _RolePermission


IsOrganizer = role_permission(User.Role.ORGANIZER)
IsProfessor = role_permission(User.Role.PROFESSOR)
IsStudent = role_permission(User.Role.STUDENT)
IsOrganizerOrProfessor = role_permission(User.Role.ORGANIZER, User.Role.PROFESSOR)
IsAnyRole = role_permission(User.Role.ORGANIZER, User.Role.PROFESSOR, User.Role.STUDENT)
