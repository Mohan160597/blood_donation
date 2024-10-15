from django.urls import path
from .views import (
    DeliveryStaffLoginView,
    DonorCreateView,
    DeliveryStaffCreateView,
    DonorLoginView,
    HospitalCreateView,
    HospitalLoginView,
    BloodRequestListCreateView,
    BloodRequestDetailView,
    DonorDetailView,
    BloodUnitSummaryView,
    BloodUnitByTypeView,
    BloodUnitCRUDView,
    HospitalDetailView,
)

urlpatterns = [

    # Donor registration and login
    path('register/donor/', DonorCreateView.as_view(), name='register_donor'),
    path('login/donor/', DonorLoginView.as_view(), name='login_donor'),

    
    # Donor details (for logged-in donors)
    path('donor/', DonorDetailView.as_view(), name='donor_detail'),

    # Delivery staff registration and login
    path('register/deliverystaff/', DeliveryStaffCreateView.as_view(), name='register_delivery_staff'),
    path('login/deliverystaff/', DeliveryStaffLoginView.as_view(), name='login_delivery_staff'),

    # Hospital registration and login
    path('register/hospital/', HospitalCreateView.as_view(), name='register_hospital'),
    path('login/hospital/', HospitalLoginView.as_view(), name='login_hospital'),

    path('hospital/details/', HospitalDetailView.as_view(), name='hospital-detail'),



    # Blood request management
    path('blood-requests/', BloodRequestListCreateView.as_view(), name='blood_request_list_create'),
    path('blood-requests/<int:pk>/', BloodRequestDetailView.as_view(), name='blood_request_detail'),


    # Blood Unit CRUD operations
    path('blood-units/', BloodUnitCRUDView.as_view(), name='blood_unit_crud_list'),
    path('blood-units/<int:pk>/', BloodUnitCRUDView.as_view(), name='blood_unit_crud_detail'),

    # Blood Unit Summary with Low Stock Alert
    path('blood-units/summary/', BloodUnitSummaryView.as_view(), name='blood_unit_summary'),

    # Blood Units by Type with Expiration Details
    path('blood-units/type/<str:blood_type>/', BloodUnitByTypeView.as_view(), name='blood_unit_by_type'),

    # Cross-hospital donation and settlement (if applicable, add here)
]
