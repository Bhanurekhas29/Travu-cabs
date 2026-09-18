import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from .models import BookingEnquiry, SiteSettings

logger = logging.getLogger(__name__)


def _booking_context(instance):
    return {
        "full_name": instance.full_name,
        "mobile_number": instance.mobile_number,
        "email": instance.email,
        "pickup_location": instance.pickup_location,
        "destination": instance.destination,
        "trip_type": instance.get_trip_type_display(),
        "pickup_date": instance.pickup_date,
        "pickup_time": instance.pickup_time,
        "passengers": instance.passengers,
        "vehicle_type": instance.vehicle_type,
    }


def _send_html_email(subject, template_name, context, to_address):
    html_body = render_to_string(template_name, context)
    text_body = strip_tags(html_body)
    email = EmailMultiAlternatives(subject, text_body, settings.DEFAULT_FROM_EMAIL, [to_address])
    email.attach_alternative(html_body, "text/html")
    email.send()


@receiver(post_save, sender=BookingEnquiry)
def notify_new_booking_enquiry(sender, instance, created, **kwargs):
    if not created:
        return

    context = _booking_context(instance)

    try:
        _send_html_email(
            f"New Booking Enquiry - {instance.full_name}",
            "emails/booking_notification.html",
            context,
            settings.BOOKING_NOTIFICATION_EMAIL,
        )
    except Exception:
        # A booking must be saved successfully for the customer even if the
        # notification email fails (bad SMTP creds, network issue, etc.).
        logger.exception("Failed to send booking enquiry notification email for enquiry id=%s", instance.pk)

    if instance.email:
        try:
            site_settings = SiteSettings.load()
            guideline_lines = [
                line.strip() for line in site_settings.travel_guidelines.splitlines() if line.strip()
            ]
            guidelines = []
            for line in guideline_lines:
                if ":" in line:
                    label, text = line.split(":", 1)
                    guidelines.append({"label": label.strip(), "text": text.strip()})
                else:
                    guidelines.append({"label": "", "text": line})

            customer_context = {
                **context,
                "brand_name": site_settings.brand_name,
                "tagline": site_settings.tagline,
                "unit_of_text": site_settings.unit_of_text,
                "primary_phone_number": site_settings.primary_phone_number,
                "extra_luggage_note": site_settings.extra_luggage_note,
                "hill_station_note": site_settings.hill_station_note,
                "guidelines": guidelines,
            }
            _send_html_email(
                f"We've received your booking request - {site_settings.brand_name}",
                "emails/booking_confirmation.html",
                customer_context,
                instance.email,
            )
        except Exception:
            logger.exception("Failed to send booking confirmation email for enquiry id=%s", instance.pk)
