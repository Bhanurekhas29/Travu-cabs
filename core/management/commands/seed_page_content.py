from django.core.management.base import BaseCommand

from core.models import (
    CTASection,
    FooterLink,
    HeroSection,
    HowItWorksStep,
    JourneyBanner,
    SafetySection,
    SectionHeading,
    SiteSettings,
    WhyChooseUsFeature,
    WhyChooseUsSection,
)

# Text content sourced from the landing page mockup screenshot.
# Images intentionally left blank - client will upload real photos.


class Command(BaseCommand):
    help = "Seeds static page-content sections (text only) from the landing page mockup."

    def handle(self, *args, **options):
        site_settings = SiteSettings.load()
        site_settings.brand_name = "Travu"
        site_settings.tagline = "Every Miles matters"
        site_settings.unit_of_text = "A unit of Blue Holidays"
        site_settings.save()

        hero = HeroSection.load()
        hero.heading_line1 = "Your Ride."
        hero.heading_line2 = "Your Way."
        hero.subtext = "Book your cab quickly, choose your ride and travel comfortably."
        hero.button1_text = "Book a Cab"
        hero.button1_link = "#book"
        hero.button2_text = "View Ride Options"
        hero.button2_link = "#rides"
        hero.save()

        SectionHeading.objects.update_or_create(
            section_key=SectionHeading.SectionKey.CHOOSE_RIDE,
            defaults=dict(
                heading="Choose the Ride That Fits You",
                subtext="From quick city errands to roomier group journeys, travel in a cab chosen for your day.",
            ),
        )
        SectionHeading.objects.update_or_create(
            section_key=SectionHeading.SectionKey.HOW_IT_WORKS,
            defaults=dict(heading="Book Your Ride in 3 Simple Steps", subtext=""),
        )

        steps = [
            (1, "Enter Your Trip", "Tell us where and when you're going."),
            (2, "Choose Your Cab", "Pick the vehicle that fits your journey."),
            (3, "Confirm & Ride", "Meet your verified driver and relax."),
        ]
        for step_number, title, description in steps:
            HowItWorksStep.objects.update_or_create(
                step_number=step_number, defaults=dict(title=title, description=description)
            )

        why_section = WhyChooseUsSection.load()
        why_section.heading = "Every detail, built around your journey."
        why_section.description = (
            "Dependable travel is more than a car - it's the confidence that every "
            "part of your ride is cared for."
        )
        why_section.button_text = "Book with confidence"
        why_section.button_link = "#book"
        why_section.save()

        features = [
            ("bolt", "Fast Booking", "A cab request in under two minutes", 1),
            ("payments", "Transparent Pricing", "Clear fares before you make a choice", 2),
            ("verified_user", "Verified Drivers", "Professionals checked for every journey", 3),
            ("support_agent", "24/7 Availability", "Reliable support wherever you travel", 4),
        ]
        for icon, title, description, order in features:
            WhyChooseUsFeature.objects.update_or_create(
                title=title, defaults=dict(icon=icon, description=description, display_order=order)
            )

        journey = JourneyBanner.load()
        journey.heading = "Wherever You're Going, We'll Get You There."
        journey.save()

        safety = SafetySection.load()
        safety.heading = "Travel with people you can trust."
        safety.description = (
            "From driver checks to real-time visibility, safeguards stay with you, "
            "from pickup to arrival."
        )
        safety.badge_text = "Safety, every mile"
        safety.save()

        cta = CTASection.load()
        cta.heading = "Ready to Ride?"
        cta.description = "Choose your destination, pick your ride and book your journey."
        cta.button_text = "Book Your Cab"
        cta.button_link = "#book"
        cta.save()

        footer_links = [
            ("quick_links", "Home", "#home", 1),
            ("quick_links", "Book a Ride", "#book", 2),
            ("quick_links", "How It Works", "#how-it-works", 3),
            ("ride_options", "Sedan", "#rides", 1),
            ("ride_options", "SUV & MPV", "#rides", 2),
            ("ride_options", "Tempo Traveller", "#rides", 3),
            ("support", "FAQs", "#faqs", 1),
            ("support", "Help Center", "#help", 2),
            ("support", "Contact Us", "#contact", 3),
        ]
        for group_name, label, url, order in footer_links:
            FooterLink.objects.update_or_create(
                group_name=group_name, label=label, defaults=dict(url=url, display_order=order)
            )

        self.stdout.write(self.style.SUCCESS("Page content seeded (text only, images left blank)."))
