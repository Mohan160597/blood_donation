from django.urls import path
from .views import (
    DeliveryStaffLoginView, 
    DonorCreateView, 
    DeliveryStaffCreateView, 
    DonorLoginView, 
    HospitalCreateView, 
    HospitalLoginView, 
    BloodRequestListCreateView, 
    BloodRequestDetailView,  # Blood request management views (CRUD)
    DonorDetailView,  # Donor detail view
)


urlpatterns = [




    # Donor registration and login
    path('register/donor/', DonorCreateView.as_view(), name='register_donor'),
    path('login/donor/', DonorLoginView.as_view(), name='login_donor'),

    # Delivery staff registration and login
    path('register/deliverystaff/', DeliveryStaffCreateView.as_view(), name='register_delivery_staff'),
    path('login/deliverystaff/', DeliveryStaffLoginView.as_view(), name='login_delivery_staff'),

    # Hospital registration and login
    path('register/hospital/', HospitalCreateView.as_view(), name='register_hospital'),
    path('login/hospital/', HospitalLoginView.as_view(), name='login_hospital'),

    # Blood request management
    path('blood-requests/', BloodRequestListCreateView.as_view(), name='blood-request-list-create'),
    path('blood-requests/<int:pk>/', BloodRequestDetailView.as_view(), name='blood-request-detail'),


    path('donors/<int:id>/', DonorDetailView.as_view(), name='donor-detail'),
]
