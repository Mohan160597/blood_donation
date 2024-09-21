
from django.contrib import admin
from .models import Hospital

@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('hospital_name', 'staff_name', 'approval_status', 'date_registered')
    actions = ['approve_hospitals', 'reject_hospitals']

    def approve_hospitals(self, request, queryset):
        queryset.update(approval_status='approved')
        self.message_user(request, "Selected hospitals have been approved.")

    def reject_hospitals(self, request, queryset):
        queryset.update(approval_status='rejected')
        self.message_user(request, "Selected hospitals have been rejected.")

    approve_hospitals.short_description = 'Approve selected hospitals'
    reject_hospitals.short_description = 'Reject selected hospitals'
