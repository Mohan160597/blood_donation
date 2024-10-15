from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Donor, DeliveryStaff, Hospital, BloodRequest, BloodUnit
from django.utils import timezone
from datetime import timedelta

class DonorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    device_token = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Donor
        fields = ['id', 'firstname', 'lastname', 'dob', 'gender', 'email', 'blood_type', 'phone_number', 'password', 'device_token']
        read_only_fields = ['id', 'password', 'device_token']

    def create(self, validated_data):
        donor = Donor.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            firstname=validated_data['firstname'],
            lastname=validated_data['lastname'],
            dob=validated_data['dob'],
            gender=validated_data['gender'],
            blood_type=validated_data['blood_type'],
            phone_number=validated_data['phone_number'],
            device_token=validated_data.get('device_token')
        )
        return donor

    def update(self, instance, validated_data):
        instance.firstname = validated_data.get('firstname', instance.firstname)
        instance.lastname = validated_data.get('lastname', instance.lastname)
        instance.dob = validated_data.get('dob', instance.dob)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.blood_type = validated_data.get('blood_type', instance.blood_type)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.device_token = validated_data.get('device_token', instance.device_token)
        instance.save()
        return instance


# Serializers for Delivery staff authentication and registration
class DeliveryStaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = DeliveryStaff
        fields = ['id', 'firstname', 'lastname', 'gender', 'email', 'license_number', 'vehicle_type', 'password']

    def create(self, validated_data):
        # Create delivery staff with hashed password
        staff = DeliveryStaff.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            firstname=validated_data['firstname'],
            lastname=validated_data['lastname'],
            gender=validated_data['gender'],
            license_number=validated_data['license_number'],
            vehicle_type=validated_data['vehicle_type']
        )
        return staff


# Donor Login Serializer (authentication handled in views)
class DonorLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Just validate that email and password are provided; actual authentication is handled in the view
        if not data.get('email') or not data.get('password'):
            raise serializers.ValidationError('Email and password are required.')
        return data


# Delivery Staff Login Serializer (authentication handled in views)
class DeliveryStaffLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if not data.get('email') or not data.get('password'):
            raise serializers.ValidationError('Email and password are required.')
        return data


# Serializer for Hospital registration and authentication
class HospitalSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = Hospital
        fields = ['hospital_name', 'staff_name', 'staff_id', 'email', 'contact_info', 'address', 'documents', 'password']

    def create(self, validated_data):
        # Create hospital with hashed password
        hospital = Hospital.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            hospital_name=validated_data['hospital_name'],
            staff_name=validated_data['staff_name'],
            staff_id=validated_data['staff_id'],
            contact_info=validated_data['contact_info'],
            address=validated_data['address'],
            documents=validated_data['documents'],
        )
        return hospital


# Hospital Login Serializer (authentication handled in views)
class HospitalLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if not data.get('email') or not data.get('password'):
            raise serializers.ValidationError('Email and password are required.')
        return data


# Serializer for Hospital to make a blood request
class BloodRequestSerializer(serializers.ModelSerializer):
    hospital_name = serializers.ReadOnlyField(source='hospital.hospital_name')
    contact_info = serializers.ReadOnlyField(source='hospital.contact_info')  # for push notifications

    class Meta:
        model = BloodRequest
        fields = ['id', 'hospital_name', 'blood_type', 'quantity', 'priority_level', 'contact_info', 'status', 'created_at', 'fulfilled_at']
        read_only_fields = ['id', 'hospital_name', 'contact_info', 'created_at', 'fulfilled_at']

    
    def create(self, validated_data):
        request = self.context.get('request')
        # Set the hospital automatically from the user's context
       
        return super().create(validated_data)

    def validate(self, data):
        if self.instance is None and data.get('status') and data['status'] != 'pending':
            raise serializers.ValidationError("New blood requests must start with status 'pending'.")
        if data['quantity'] <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return data
    
    def validate_blood_type(self, value):
        valid_blood_types = [choice[0] for choice in Donor.BLOOD_TYPE_CHOICES]
        if value not in valid_blood_types:
            raise serializers.ValidationError("Invalid blood type.")
        return value






# Serializer for blood units at hospitals
class BloodUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodUnit
        fields = ['id', 'blood_type', 'quantity', 'hospital', 'expiration_date', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']
        extra_kwargs = {
            'hospital': {'required': False},  # Mark hospital as not required
            'expiration_date': {'required': False}  # Mark expiration_date as not required
        }

    def create(self, validated_data):
        """
        Override the create method to automatically assign an expiration date and hospital.
        """
        # Define the shelf life for blood units (e.g., 42 days)
        shelf_life = timedelta(days=42)

        # Automatically set the expiration date based on the current date and shelf life
        validated_data['expiration_date'] = timezone.now().date() + shelf_life

        return super().create(validated_data)

    def validate(self, data):
        """
        Custom validation to ensure the quantity is valid.
        """
        if data['quantity'] <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        
        return data







