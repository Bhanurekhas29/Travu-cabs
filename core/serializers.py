from datetime import date

from rest_framework import serializers

from .models import (
    BookingEnquiry,
    CTASection,
    FooterLink,
    HeroSection,
    HowItWorksStep,
    JourneyBanner,
    SafetyPoint,
    SafetySection,
    SectionHeading,
    SiteSettings,
    VehicleType,
    WhyChooseUsFeature,
    WhyChooseUsSection,
)


class SectionHeadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionHeading
        fields = ["section_key", "heading", "subtext"]


class HowItWorksStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowItWorksStep
        fields = ["step_number", "title", "description", "image"]


class JourneyBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = JourneyBanner
        fields = ["heading", "background_image"]


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLink
        fields = ["group_name", "label", "url", "display_order"]


class CTASectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CTASection
        fields = ["heading", "description", "button_text", "button_link", "image"]


class SafetySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetySection
        fields = ["heading", "description", "image", "badge_text"]


class SafetyPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyPoint
        fields = ["id", "title", "display_order"]


class WhyChooseUsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyChooseUsSection
        fields = ["heading", "description", "button_text", "button_link"]


class WhyChooseUsFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyChooseUsFeature
        fields = ["icon", "title", "description", "display_order"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "brand_name",
            "tagline",
            "unit_of_text",
            "logo",
            "primary_phone_number",
            "secondary_phone_number",
            "whatsapp_number",
            "email",
            "address",
            "facebook_url",
            "instagram_url",
            "google_url",
            "extra_luggage_note",
        ]


class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = [
            "heading_line1",
            "heading_line2",
            "subtext",
            "button1_text",
            "button1_link",
            "button2_text",
            "button2_link",
            "background_image",
            "background_image_2",
        ]


class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleType
        fields = [
            "id",
            "vehicle_group",
            "name",
            "models_text",
            "min_seats",
            "max_seats",
            "ideal_for",
            "description",
            "luggage_capacity",
            "configuration_note",
            "image",
            "image_badge_text",
            "badge",
            "availability_text",
            "rating",
            "review_count",
            "has_ac",
            "has_audio_usb",
            "local_rate",
            "local_rate_note",
            "outstation_rate",
            "outstation_rate_note",
            "per_km_rate",
            "driver_allowance",
            "is_featured",
        ]


class BookingEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingEnquiry
        fields = [
            "id",
            "pickup_location",
            "destination",
            "trip_type",
            "pickup_date",
            "pickup_time",
            "passengers",
            "vehicle_type",
            "full_name",
            "mobile_number",
            "email",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_mobile_number(self, value):
        digits = value.strip()
        if not digits.isdigit():
            raise serializers.ValidationError("Mobile number must contain digits only.")
        if len(digits) != 10:
            raise serializers.ValidationError("Mobile number must be exactly 10 digits.")
        return digits

    def validate_full_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters.")
        return value.strip()

    def validate_passengers(self, value):
        if value < 1:
            raise serializers.ValidationError("Passengers must be at least 1.")
        return value

    def validate_pickup_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("Pickup date cannot be in the past.")
        return value
