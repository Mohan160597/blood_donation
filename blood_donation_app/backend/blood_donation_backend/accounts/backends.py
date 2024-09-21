from django.contrib.auth.backends import BaseBackend
from .models import Donor, DeliveryStaff, Hospital
from django.contrib.auth.backends import ModelBackend


class DonorBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            donor = Donor.objects.get(email=email)
            if donor.check_password(password):  # Password is hashed and checked using Django's method
                return donor
        except Donor.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return Donor.objects.get(pk=user_id)
        except Donor.DoesNotExist:
            return None


class DeliveryStaffBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            staff = DeliveryStaff.objects.get(email=email)
            if staff.check_password(password):
                return staff
        except DeliveryStaff.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return DeliveryStaff.objects.get(pk=user_id)
        except DeliveryStaff.DoesNotExist:
            return None


class HospitalBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            hospital = Hospital.objects.get(email=email)
        except Hospital.DoesNotExist:
            return None
        if hospital.check_password(password) and self.user_can_authenticate(hospital):
            return hospital
        return None
