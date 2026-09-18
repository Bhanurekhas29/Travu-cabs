from django.contrib import admin

from .models import (
    BookingEnquiry,
    CTASection,
    FooterLink,
    HeroSection,
    HowItWorksStep,
    JourneyBanner,
    SafetySection,
    SectionHeading,
    SiteSettings,
    VehicleType,
    WhyChooseUsFeature,
    WhyChooseUsSection,
)


class SingletonAdmin(admin.ModelAdmin):
    """Hides the add/delete actions for singleton (single-row) content blocks."""

    def has_add_permission(self, request):
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = self.model.load()
        from django.shortcuts import redirect
        from django.urls import reverse

        return redirect(reverse(f"admin:core_{self.model._meta.model_name}_change", args=[obj.pk]))


@admin.register(SiteSettings)
class SiteSettingsAdmin(SingletonAdmin):
    fieldsets = (
        (
            None,
            {
                "description": "General business details used across the whole website - logo, contact "
                "numbers, email, address and social links.",
                "fields": ("brand_name", "tagline", "unit_of_text", "logo"),
            },
        ),
        (
            "Contact details",
            {"fields": ("primary_phone_number", "secondary_phone_number", "whatsapp_number", "email", "address")},
        ),
        ("Social links", {"fields": ("facebook_url", "instagram_url")}),
        ("Booking form note", {"fields": ("extra_luggage_note",)}),
        (
            "Email guidelines",
            {
                "description": "Shown to customers in the booking confirmation email (not on the website).",
                "fields": ("hill_station_note", "travel_guidelines"),
            },
        ),
    )


@admin.register(HeroSection)
class HeroSectionAdmin(SingletonAdmin):
    fieldsets = (
        (
            None,
            {
                "description": "The very first thing visitors see at the top of the website - the big "
                "heading, subtext, background photo and the two main buttons.",
                "fields": ("heading_line1", "heading_line2", "subtext", "background_image", "background_image_2"),
            },
        ),
        ("Buttons", {"fields": ("button1_text", "button1_link", "button2_text", "button2_link")}),
    )


@admin.register(SectionHeading)
class SectionHeadingAdmin(admin.ModelAdmin):
    list_display = ("section_key", "heading", "subtext")
    fieldsets = (
        (
            None,
            {
                "description": "Headings for two sections on the website that don't have their own "
                "dedicated page ('Choose the Ride' and 'How It Works'). Do not add new rows - "
                "only edit the existing ones.",
                "fields": ("section_key", "heading", "subtext"),
            },
        ),
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(VehicleType)
class VehicleTypeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "seating_capacity",
        "badge",
        "is_featured",
        "local_rate",
        "outstation_rate",
        "display_order",
    )
    list_editable = ("is_featured", "display_order")
    list_filter = ("is_featured", "ac_available_in_hills")
    search_fields = ("name", "models_text")
    fieldsets = (
        (
            None,
            {
                "description": (
                    "This is the list of cars/vans customers can choose from on the website "
                    "('Choose the Ride' section). Each row here is one vehicle card. "
                    "You can edit the text, photo and price for any vehicle below, "
                    "or add a brand new vehicle using the 'Add Vehicle Type' button on the list page. "
                    "Do not delete a vehicle that already has bookings against it — ask the developer first."
                ),
                "fields": ("name", "models_text", "seating_capacity", "configuration_note"),
            },
        ),
        (
            "Card description",
            {
                "fields": (
                    "ideal_for",
                    "description",
                    "luggage_capacity",
                    "badge",
                    "availability_text",
                    "rating",
                    "review_count",
                    "has_ac",
                    "has_audio_usb",
                    "image",
                    "image_badge_text",
                )
            },
        ),
        (
            "Pricing",
            {
                "description": "Leave any of these blank if the price hasn't been finalized yet - "
                "the website will simply not show that price until it's filled in.",
                "fields": (
                    "local_rate",
                    "local_rate_note",
                    "outstation_rate",
                    "outstation_rate_note",
                    "per_km_rate",
                    "driver_allowance",
                ),
            },
        ),
        (
            "Display settings",
            {"fields": ("is_featured", "display_order", "ac_available_in_hills")},
        ),
    )


@admin.register(BookingEnquiry)
class BookingEnquiryAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "mobile_number",
        "pickup_location",
        "destination",
        "trip_type",
        "pickup_date",
        "vehicle_type",
        "created_at",
    )
    list_filter = ("trip_type", "vehicle_type", "pickup_date")
    search_fields = ("full_name", "mobile_number", "email", "pickup_location", "destination")
    readonly_fields = [f.name for f in BookingEnquiry._meta.fields]
    fieldsets = (
        (
            None,
            {
                "description": "These are booking requests submitted by customers through the website. "
                "This list is read-only - it's just a record of enquiries, nothing here can be edited.",
                "fields": [f.name for f in BookingEnquiry._meta.fields],
            },
        ),
    )

    def has_add_permission(self, request):
        return False


@admin.register(HowItWorksStep)
class HowItWorksStepAdmin(admin.ModelAdmin):
    list_display = ("step_number", "title")
    ordering = ("step_number",)
    fieldsets = (
        (
            None,
            {
                "description": "The 3 steps shown in the 'Book Your Ride in 3 Simple Steps' section. "
                "There should normally only be 3 rows here (one per step).",
                "fields": ("step_number", "title", "description", "image"),
            },
        ),
    )


@admin.register(WhyChooseUsSection)
class WhyChooseUsSectionAdmin(SingletonAdmin):
    fieldsets = (
        (
            None,
            {
                "description": "Heading, description and button for the 'Why Choose Us' section. "
                "The 4 feature tiles under it (Fast Booking, Transparent Pricing, etc.) are managed "
                "separately under 'Why Choose Us Features'.",
                "fields": ("heading", "description", "button_text", "button_link"),
            },
        ),
    )


@admin.register(WhyChooseUsFeature)
class WhyChooseUsFeatureAdmin(admin.ModelAdmin):
    list_display = ("title", "icon", "display_order")
    list_editable = ("display_order",)
    fieldsets = (
        (
            None,
            {
                "description": "The small feature tiles shown in the 'Why Choose Us' section "
                "(e.g. Fast Booking, Transparent Pricing, Verified Drivers, 24/7 Availability).",
                "fields": ("title", "description", "icon", "display_order"),
            },
        ),
    )


@admin.register(JourneyBanner)
class JourneyBannerAdmin(SingletonAdmin):
    fieldsets = (
        (
            None,
            {
                "description": "The wide banner section with the heading 'Wherever You're Going, "
                "We'll Get You There.' and its background photo.",
                "fields": ("heading", "background_image"),
            },
        ),
    )


@admin.register(SafetySection)
class SafetySectionAdmin(SingletonAdmin):
    fieldsets = (
        (
            None,
            {
                "description": "The section that reassures customers about safety - heading, "
                "description, photo and the small badge text shown on the photo.",
                "fields": ("heading", "description", "image", "badge_text"),
            },
        ),
    )


@admin.register(CTASection)
class CTASectionAdmin(SingletonAdmin):
    fieldsets = (
        (
            None,
            {
                "description": "The final 'Ready to Ride?' section near the bottom of the website, "
                "with its own heading, description, button and photo.",
                "fields": ("heading", "description", "button_text", "button_link", "image"),
            },
        ),
    )


@admin.register(FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    list_display = ("group_name", "label", "url", "display_order")
    list_filter = ("group_name",)
    list_editable = ("display_order",)
    fieldsets = (
        (
            None,
            {
                "description": "Links shown in the website footer, grouped into columns "
                "(Quick Links, Ride Options, Support).",
                "fields": ("group_name", "label", "url", "display_order"),
            },
        ),
    )
