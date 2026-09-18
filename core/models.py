from django.core.exceptions import ValidationError
from django.db import models

from .validators import validate_image_max_size


class SingletonModel(models.Model):
    """Base for tables that must only ever hold a single row (page-level content blocks)."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class SiteSettings(SingletonModel):
    brand_name = models.CharField(
        max_length=100, default="Travu", help_text="Your business name as shown across the website. e.g. Travu"
    )
    tagline = models.CharField(
        max_length=150, blank=True, help_text="Short slogan shown near the logo. e.g. Every Miles matters"
    )
    unit_of_text = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Parent company line",
        help_text="Small text under the brand name. e.g. A unit of Blue Holidays",
    )
    logo = models.ImageField(
        upload_to="site/",
        blank=True,
        null=True,
        validators=[validate_image_max_size],
        help_text="Upload your logo image (max 20MB). Use a transparent PNG for best results.",
    )

    primary_phone_number = models.CharField(
        max_length=20,
        help_text="Main phone number. Customers can tap this on the website to call you directly.",
    )
    secondary_phone_number = models.CharField(
        max_length=20, blank=True, help_text="Optional second phone number. Leave blank if not needed."
    )
    whatsapp_number = models.CharField(
        max_length=20,
        help_text="WhatsApp number including country code, no spaces or symbols. e.g. 918148664196",
    )
    email = models.EmailField(
        help_text="Business email shown on the website and used as the contact address."
    )

    address = models.TextField(blank=True, help_text="Full business address, shown in the footer.")
    facebook_url = models.URLField(blank=True, help_text="Link to your Facebook page. Leave blank to hide the icon.")
    instagram_url = models.URLField(
        blank=True, help_text="Link to your Instagram page. Leave blank to hide the icon."
    )

    extra_luggage_note = models.TextField(
        blank=True,
        help_text="A short note shown under the booking form on every booking, reminding customers to "
        "mention extra luggage. e.g. 'Travelling with extra luggage? Let us know in advance.'",
    )
    hill_station_note = models.TextField(
        blank=True,
        verbose_name="Hill station AC note",
        help_text="Note about AC availability on hill station routes. Shown in the booking confirmation email. "
        "Leave blank to hide.",
    )
    travel_guidelines = models.TextField(
        blank=True,
        help_text="Travel & driver guidelines (KM/time calculation, driver duty, hill station timing, etc). "
        "One point per line. Shown in the booking confirmation email. Leave blank to hide.",
    )

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.brand_name


class HeroSection(SingletonModel):
    heading_line1 = models.CharField(
        max_length=100, help_text="First line of the big heading at the top of the website. e.g. Your Ride."
    )
    heading_line2 = models.CharField(
        max_length=100,
        help_text="Second line of the heading, shown in the highlight colour. e.g. Your Way.",
    )
    subtext = models.TextField(
        blank=True, help_text="Short paragraph under the heading explaining what you offer."
    )
    button1_text = models.CharField(
        max_length=50, blank=True, help_text="Text on the first button. e.g. Book a Cab"
    )
    button1_link = models.CharField(
        max_length=200, blank=True, help_text="Where the first button goes to. Ask the developer if unsure."
    )
    button2_text = models.CharField(
        max_length=50, blank=True, help_text="Text on the second button. e.g. View Ride Options"
    )
    button2_link = models.CharField(
        max_length=200, blank=True, help_text="Where the second button goes to. Ask the developer if unsure."
    )
    background_image = models.ImageField(
        upload_to="hero/",
        blank=True,
        null=True,
        validators=[validate_image_max_size],
        help_text="Large background photo behind the heading (max 20MB). Use a wide, high-quality photo.",
    )
    background_image_2 = models.ImageField(
        upload_to="hero/",
        blank=True,
        null=True,
        validators=[validate_image_max_size],
        verbose_name="Second background photo",
        help_text="Optional second photo (max 20MB). If set, the background slowly crossfades between the two "
        "photos. Leave blank to show only the first photo.",
    )

    class Meta:
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Section"

    def __str__(self):
        return "Hero Section"


class SectionHeading(models.Model):
    class SectionKey(models.TextChoices):
        CHOOSE_RIDE = "choose_ride", "Choose the Ride"
        HOW_IT_WORKS = "how_it_works", "How It Works"

    section_key = models.CharField(
        max_length=30,
        choices=SectionKey.choices,
        unique=True,
        help_text="Which section on the website this heading belongs to.",
    )
    heading = models.CharField(max_length=150, help_text="The heading text shown above this section.")
    subtext = models.CharField(
        max_length=250, blank=True, help_text="Optional short line shown under the heading."
    )

    class Meta:
        verbose_name = "Section Heading"
        verbose_name_plural = "Section Headings"

    def __str__(self):
        return self.get_section_key_display()


class VehicleType(models.Model):
    name = models.CharField(
        max_length=100,
        help_text="This is the vehicle's title shown to customers on the website. "
        "e.g. Sedan, Tempo Traveller 12 Seater",
    )
    models_text = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Car models",
        help_text="List the actual car model names for this vehicle type, separated by commas. "
        "e.g. Swift Dzire, Honda Amaze, Toyota Etios. Leave blank if not applicable.",
    )
    seating_capacity = models.PositiveIntegerField(
        help_text="Number of passenger seats (not counting the driver). e.g. 4"
    )
    ideal_for = models.CharField(
        max_length=150,
        blank=True,
        help_text="A short line telling customers who this vehicle suits, shown next to the badge at "
        "the top of the card. e.g. Small family / 2-3 guests",
    )
    description = models.TextField(
        blank=True,
        help_text="A longer sentence or two describing this vehicle, shown in the card body. "
        "e.g. Air-conditioned 4+1 seater with superior boot space, perfect for local sunset points...",
    )
    luggage_capacity = models.CharField(
        max_length=150,
        blank=True,
        help_text="A short line describing how much luggage fits. e.g. Approx. 2-3 medium bags",
    )
    configuration_note = models.CharField(
        max_length=200,
        blank=True,
        help_text="Optional extra seating detail, only needed for a few vehicles. "
        "e.g. Captain seats in middle row. Leave blank if not applicable.",
    )
    ac_available_in_hills = models.BooleanField(
        default=False,
        verbose_name="AC available in hill stations",
        help_text="Tick this ONLY if this vehicle has AC running even on hill station routes. "
        "Leave unticked for regular routes/rules (ask the developer if unsure).",
    )
    image = models.ImageField(
        upload_to="vehicles/",
        blank=True,
        null=True,
        validators=[validate_image_max_size],
        help_text="Upload a clear photo of this vehicle. Recommended: landscape photo, "
        "under 20MB, JPG or PNG.",
    )
    badge = models.CharField(
        max_length=50,
        blank=True,
        help_text="Small highlight label shown on the card, e.g. Most Popular, Best Value. "
        "Leave blank to show no badge.",
    )
    image_badge_text = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Photo label",
        help_text="Small label shown on top of the vehicle photo, e.g. Sedan AC. Leave blank for none.",
    )
    availability_text = models.CharField(
        max_length=100,
        blank=True,
        help_text="Small availability note shown top-right of the card, e.g. Available Now in Kanyakumari. "
        "Leave blank to hide.",
    )
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        blank=True,
        null=True,
        help_text="Star rating out of 5, e.g. 4.9. Leave blank to hide the rating.",
    )
    review_count = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Number of reviews behind the rating, e.g. 420. Leave blank to hide.",
    )
    has_ac = models.BooleanField(
        default=True,
        verbose_name="Has climate AC",
        help_text="Tick to show a 'Climate AC' tag on the card.",
    )
    has_audio_usb = models.BooleanField(
        default=True,
        verbose_name="Has audio & USB",
        help_text="Tick to show an 'Audio & USB' tag on the card.",
    )

    local_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="Local / half day rate",
        help_text="Price (in Rs.) for a local/half-day booking of this vehicle. Leave blank if not decided yet.",
    )
    local_rate_note = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Local / half day note",
        help_text="Small note shown under the local rate, e.g. 4 hrs / 40 km. Leave blank for none.",
    )
    outstation_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="Full day / sightseeing rate",
        help_text="Price (in Rs.) for a full-day sightseeing booking of this vehicle. Leave blank if not decided yet.",
    )
    outstation_rate_note = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Full day / sightseeing note",
        help_text="Small note shown under the full day rate, e.g. 8 hrs / 80 km. Leave blank for none.",
    )
    per_km_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Price (in Rs.) charged per kilometre travelled. Leave blank if not decided yet.",
    )
    driver_allowance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Daily driver allowance/bata (in Rs.) for outstation trips. Leave blank if not decided yet.",
    )

    is_featured = models.BooleanField(
        default=False,
        verbose_name="Show by default on website",
        help_text="Tick this to show this vehicle immediately in the 'Choose the Ride' section. "
        "Untick to hide it behind the 'View All' button instead.",
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Controls the order vehicles appear in on the website. Lower numbers show first "
        "(e.g. 1 appears before 2).",
    )

    class Meta:
        verbose_name = "Vehicle Type"
        verbose_name_plural = "Vehicle Types"
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name


class BookingEnquiry(models.Model):
    class TripType(models.TextChoices):
        ONE_WAY = "one_way", "One Way"
        ROUND_TRIP = "round_trip", "Round Trip"

    pickup_location = models.CharField(max_length=255, help_text="Where the customer wants to be picked up.")
    destination = models.CharField(max_length=255, help_text="Where the customer wants to go.")
    trip_type = models.CharField(
        max_length=20, choices=TripType.choices, default=TripType.ONE_WAY, help_text="One way or round trip."
    )
    pickup_date = models.DateField(help_text="Date the customer wants to travel.")
    pickup_time = models.TimeField(help_text="Time the customer wants to be picked up.")
    passengers = models.PositiveIntegerField(default=1, help_text="Number of passengers travelling.")
    vehicle_type = models.ForeignKey(
        VehicleType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="enquiries",
        help_text="Vehicle the customer selected, if any.",
    )

    full_name = models.CharField(max_length=100, help_text="Customer's name.")
    mobile_number = models.CharField(max_length=15, help_text="Customer's mobile number.")
    email = models.EmailField(blank=True, help_text="Customer's email, if provided.")

    created_at = models.DateTimeField(auto_now_add=True, help_text="When this enquiry was submitted.")

    class Meta:
        verbose_name = "Booking Enquiry"
        verbose_name_plural = "Booking Enquiries"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} - {self.pickup_location} to {self.destination}"


class HowItWorksStep(models.Model):
    step_number = models.PositiveIntegerField(help_text="Order this step appears in. e.g. 1, 2, 3")
    title = models.CharField(max_length=100, help_text="Short title for this step. e.g. Enter Your Trip")
    description = models.TextField(blank=True, help_text="One line explaining this step to the customer.")
    image = models.ImageField(
        upload_to="how_it_works/",
        blank=True,
        null=True,
        validators=[validate_image_max_size],
        help_text="Photo shown alongside this step (max 20MB).",
    )

    class Meta:
        verbose_name = "How It Works Step"
        verbose_name_plural = "How It Works Steps"
        ordering = ["step_number"]

    def __str__(self):
        return f"Step {self.step_number}: {self.title}"


class WhyChooseUsSection(SingletonModel):
    heading = models.CharField(
        max_length=150, blank=True, help_text="Heading for the 'why choose us' section."
    )
    description = models.TextField(blank=True, help_text="Short paragraph under the heading.")
    button_text = models.CharField(max_length=50, blank=True, help_text="Text on the button in this section.")
    button_link = models.CharField(
        max_length=200, blank=True, help_text="Where the button goes to. Ask the developer if unsure."
    )

    class Meta:
        verbose_name = "Why Choose Us Section"
        verbose_name_plural = "Why Choose Us Section"

    def __str__(self):
        return "Why Choose Us Section"


class WhyChooseUsFeature(models.Model):
    icon = models.CharField(
        max_length=50,
        help_text="Google Material Icon name (ask the developer for the exact name to use). "
        "e.g. bolt, payments, verified_user, support_agent",
    )
    title = models.CharField(max_length=100, help_text="Short title for this feature. e.g. Fast Booking")
    description = models.TextField(blank=True, help_text="One line explaining this feature.")
    display_order = models.PositiveIntegerField(
        default=0, help_text="Controls the order these show in. Lower numbers show first."
    )

    class Meta:
        verbose_name = "Why Choose Us Feature"
        verbose_name_plural = "Why Choose Us Features"
        ordering = ["display_order"]

    def __str__(self):
        return self.title


class JourneyBanner(SingletonModel):
    heading = models.CharField(
        max_length=150, blank=True, help_text="Heading shown over the journey banner photo."
    )
    background_image = models.ImageField(
        upload_to="journey_banner/",
        blank=True,
        null=True,
        validators=[validate_image_max_size],
        help_text="Large background photo for this banner (max 20MB). Use a wide, high-quality photo.",
    )

    class Meta:
        verbose_name = "Journey Banner"
        verbose_name_plural = "Journey Banner"

    def __str__(self):
        return "Journey Banner"


class SafetySection(SingletonModel):
    heading = models.CharField(max_length=150, blank=True, help_text="Heading for the safety section.")
    description = models.TextField(blank=True, help_text="Short paragraph describing your safety measures.")
    image = models.ImageField(
        upload_to="safety/",
        blank=True,
        null=True,
        validators=[validate_image_max_size],
        help_text="Photo shown alongside this section (max 20MB).",
    )
    badge_text = models.CharField(
        max_length=50, blank=True, help_text="Small highlight label shown on the photo. e.g. Safety, every mile"
    )

    class Meta:
        verbose_name = "Safety Section"
        verbose_name_plural = "Safety Section"

    def __str__(self):
        return "Safety Section"


class CTASection(SingletonModel):
    heading = models.CharField(
        max_length=150, blank=True, help_text="Heading for the closing call-to-action section. e.g. Ready to Ride?"
    )
    description = models.TextField(blank=True, help_text="Short paragraph under the heading.")
    button_text = models.CharField(max_length=50, blank=True, help_text="Text on the button. e.g. Book Your Cab")
    button_link = models.CharField(
        max_length=200, blank=True, help_text="Where the button goes to. Ask the developer if unsure."
    )
    image = models.ImageField(
        upload_to="cta/",
        blank=True,
        null=True,
        validators=[validate_image_max_size],
        help_text="Photo shown alongside this section (max 20MB).",
    )

    class Meta:
        verbose_name = "CTA Section"
        verbose_name_plural = "CTA Section"

    def __str__(self):
        return "CTA Section"


class FooterLink(models.Model):
    class GroupName(models.TextChoices):
        QUICK_LINKS = "quick_links", "Quick Links"
        RIDE_OPTIONS = "ride_options", "Ride Options"
        SUPPORT = "support", "Support"

    group_name = models.CharField(
        max_length=30, choices=GroupName.choices, help_text="Which footer column this link appears under."
    )
    label = models.CharField(max_length=100, help_text="The link text customers see. e.g. Contact Us")
    url = models.CharField(max_length=200, help_text="Where this link goes to. Ask the developer if unsure.")
    display_order = models.PositiveIntegerField(
        default=0, help_text="Controls the order links appear in within their column. Lower numbers show first."
    )

    class Meta:
        verbose_name = "Footer Link"
        verbose_name_plural = "Footer Links"
        ordering = ["group_name", "display_order"]

    def __str__(self):
        return f"[{self.get_group_name_display()}] {self.label}"
