from django.urls import path

from . import views

urlpatterns = [
    path("site-settings/", views.SiteSettingsView.as_view(), name="site-settings"),
    path("hero-section/", views.HeroSectionView.as_view(), name="hero-section"),
    path("section-headings/", views.SectionHeadingListView.as_view(), name="section-heading-list"),
    path("vehicle-types/", views.VehicleTypeListView.as_view(), name="vehicle-type-list"),
    path("how-it-works-steps/", views.HowItWorksStepListView.as_view(), name="how-it-works-step-list"),
    path("journey-banner/", views.JourneyBannerView.as_view(), name="journey-banner"),
    path("safety-section/", views.SafetySectionView.as_view(), name="safety-section"),
    path("safety-points/", views.SafetyPointListView.as_view(), name="safety-point-list"),
    path("cta-section/", views.CTASectionView.as_view(), name="cta-section"),
    path("footer-links/", views.FooterLinkListView.as_view(), name="footer-link-list"),
    path("why-choose-us-section/", views.WhyChooseUsSectionView.as_view(), name="why-choose-us-section"),
    path("why-choose-us-features/", views.WhyChooseUsFeatureListView.as_view(), name="why-choose-us-feature-list"),
    path("bookings/", views.BookingEnquiryCreateView.as_view(), name="booking-create"),
    path("contact-messages/", views.ContactMessageCreateView.as_view(), name="contact-message-create"),
    path("faqs/", views.FAQListView.as_view(), name="faq-list"),
]
