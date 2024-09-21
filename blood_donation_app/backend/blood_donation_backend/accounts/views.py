from rest_framework import status, generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import (
    DonorSerializer, 
    DeliveryStaffSerializer, 
    DonorLoginSerializer, 
    DeliveryStaffLoginSerializer, 
    HospitalSerializer, 
    HospitalLoginSerializer, 
    BloodRequestSerializer,
)
from .models import Donor, DeliveryStaff, Hospital, BloodRequest
from django.utils import timezone
from firebase_admin import messaging



# Donor registration view
class DonorCreateView(generics.CreateAPIView):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer
    permission_classes = [AllowAny]  # Anyone can register


# Delivery staff registration view
class DeliveryStaffCreateView(generics.CreateAPIView):
    queryset = DeliveryStaff.objects.all()
    serializer_class = DeliveryStaffSerializer
    permission_classes = [AllowAny]  # Anyone can register


# Donor login view
class DonorLoginView(APIView):
    permission_classes = [AllowAny]  # Anyone can login

    def post(self, request):
        serializer = DonorLoginSerializer(data=request.data)
        if serializer.is_valid():
            # Authenticate using the custom Donor backend
            donor = authenticate(
                request,
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            
            if donor is not None:
                # Generate JWT tokens for the donor
                refresh = RefreshToken.for_user(donor)
                return Response({
                    'success': True,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid login credentials."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Delivery staff login view
class DeliveryStaffLoginView(APIView):
    permission_classes = [AllowAny]  # Anyone can login

    def post(self, request):
        serializer = DeliveryStaffLoginSerializer(data=request.data)
        if serializer.is_valid():
            # Authenticate using the custom DeliveryStaff backend
            staff = authenticate(
                request,
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            
            if staff is not None:
                # Generate JWT tokens for the delivery staff
                refresh = RefreshToken.for_user(staff)
                return Response({
                    'success': True,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid login credentials."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Hospital registration view
class HospitalCreateView(generics.CreateAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [AllowAny]  # Anyone can register

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = "Hospital registered successfully, pending admin approval."
        return response


# Hospital login view
class HospitalLoginView(APIView):
    permission_classes = [AllowAny]  # Anyone can attempt login

    def post(self, request):
        serializer = HospitalLoginSerializer(data=request.data)
        if serializer.is_valid():
            # Authenticate using the custom Hospital backend
            hospital = authenticate(
                request,
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            
            if hospital is not None:
                #print(f"Authenticated user: {hospital} (type: {type(hospital)})")
                # Generate JWT tokens for the hospital user
                refresh = RefreshToken.for_user(hospital)
                return Response({
                    'status': True,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid login credentials."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for listing and creating blood requests (only for hospitals)
class BloodRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can view and create blood requests
    authentication_classes = [JWTAuthentication] 

    def get_queryset(self):
        user = self.request.user        
        if isinstance(user, Hospital):  # Check if the user is a Hospital instance
            return BloodRequest.objects.filter(hospital=user)
        raise PermissionDenied("You do not have access to this resource.")

    def perform_create(self, serializer):
        user = self.request.user
        if isinstance(user, Hospital) and user.approval_status == 'approved':
            blood_request = serializer.save(hospital=user)

            # Send notifications to eligible donors
            self.send_donor_notifications(blood_request)
        else:
            raise PermissionDenied("Only approved hospitals can create blood requests.")

    def send_donor_notifications(self, blood_request):
        print("Preparing to send notifications...")  # Add log to confirm function execution
        # Get donors with the matching blood type
        eligible_donors = Donor.objects.filter(blood_type=blood_request.blood_type, is_active=True)
        print(f"Found {eligible_donors.count()} eligible donors")  # Add log to track how many donors are found
    
        # Access hospital details from the related Hospital object
        hospital = blood_request.hospital  # Get the hospital associated with the request

        # Prepare notification details
        message_title = "Urgent Blood Donation Request!"
        message_body = (
            f"{hospital.hospital_name} needs {blood_request.quantity} units of {blood_request.blood_type} blood. "
            f"Contact: {hospital.contact_info}. Location: {hospital.address if hospital.address else 'N/A'}."
        )

        # Send notifications via Firebase Admin SDK
        for donor in eligible_donors:
            if donor.device_token:  # Assuming donors have device tokens stored in the database
              print(f"Donor {donor.email} has a valid device token: {donor.device_token}")
            else:
              print(f"Donor {donor.email} does not have a valid device token.")  # Log if no device token is found
              try:  # Wrap the notification sending in a try-except block to handle any errors that may occur
                print(f"Sending notification to {donor.email} with token {donor.device_token}")  # Log before sending
                message = messaging.Message(
                    notification=messaging.Notification(
                        title=message_title,
                        body=message_body,
                    ),
                    token=donor.device_token,
                )
                response = messaging.send(message)
                print(f"Notification sent to {donor.email}: {response}")
              except Exception as e:
                print(f"Failed to send notification to {donor.email}: {e}")

# View for retrieving, updating, and deleting blood requests
class BloodRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        # Only allow hospitals to manage their own requests
        user = self.request.user
        if isinstance(user, Hospital):
            return BloodRequest.objects.filter(hospital=user)
        raise PermissionDenied("You do not have access to this resource.")

    def perform_update(self, serializer):
        user = self.request.user
        instance = self.get_object()

        # Only approved hospitals can update their requests
        if isinstance(user, Hospital) and user.approval_status == 'approved':
            # Check if the status is changing to fulfilled
            if serializer.validated_data.get('status') == 'fulfilled' and instance.status != 'fulfilled':
                serializer.save(fulfilled_at=timezone.now())  # Set fulfilled_at when request is fulfilled
            else:
                serializer.save()
        else:
            raise PermissionDenied("Only approved hospitals can update blood requests.")



class DonorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer
    lookup_field = 'id'
