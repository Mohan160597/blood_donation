from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.utils import timezone

# Custom user manager
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


# Model for Donor
class Donor(AbstractBaseUser, PermissionsMixin):
    BLOOD_TYPE_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    dob = models.DateField()
    gender = models.CharField(max_length=7, choices=GENDER_CHOICES)
    email = models.EmailField(unique=True)
    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPE_CHOICES)
    phone_number = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    device_token = models.CharField(max_length=255, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['firstname', 'lastname', 'dob', 'gender', 'blood_type', 'phone_number']

    objects = UserManager()

    # Adding related_name to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='donor_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='donor_permissions',
        blank=True
    )

    def __str__(self):
        return f"{self.firstname} {self.lastname}"


# Model for Delivery Staff
class DeliveryStaff(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=7, choices=GENDER_CHOICES)
    license_number = models.CharField(max_length=50, unique=True)
    vehicle_type = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['firstname', 'lastname', 'gender', 'license_number', 'vehicle_type']

    objects = UserManager()

    # Adding related_name to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='delivery_staff_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='delivery_staff_permissions',
        blank=True
    )

    def __str__(self):
        return f"{self.firstname} {self.lastname}"


    
class Hospital(AbstractBaseUser, PermissionsMixin):
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    hospital_name = models.CharField(max_length=255)
    staff_name = models.CharField(max_length=255)
    staff_id = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)  # Hospital-specific email for login
    contact_info = models.CharField(max_length=100)
    address = models.TextField()
    documents = models.FileField(upload_to='hospital_documents/')
    approval_status = models.CharField(max_length=10, choices=APPROVAL_STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Hospital admin users
    date_registered = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'  # Use email for login
    REQUIRED_FIELDS = ['hospital_name', 'staff_name', 'staff_id']

    # Reuse the existing UserManager
    objects = UserManager()

    # Related name arguments to avoid clashes with auth.User
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='hospital_groups',  # Custom related_name to avoid conflicts with auth.User.groups
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='hospital_permissions',  # Custom related_name to avoid conflicts with auth.User.user_permissions
        blank=True
    )

    def __str__(self):
        return self.hospital_name


# Model for Blood Request
class BloodRequest(models.Model):
    PRIORITY_LEVEL_CHOICES = [
        ('urgent', 'Urgent'),
        ('normal', 'Normal'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
        ('canceled', 'Canceled'),
    ]

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='blood_requests')
    blood_type = models.CharField(max_length=3, choices=Donor.BLOOD_TYPE_CHOICES)
    quantity = models.IntegerField()
    priority_level = models.CharField(max_length=10, choices=PRIORITY_LEVEL_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    fulfilled_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Request {self.id} by {self.hospital.hospital_name} for {self.blood_type}"

    def mark_fulfilled(self):
    
        self.status = 'fulfilled'
        self.fulfilled_at = timezone.now()
        self.save()


