from rest_framework import generics

from .models import (
    BookingEnquiry,
    ContactMessage,
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
from .serializers import (
    BookingEnquirySerializer,
    ContactMessageSerializer,
    CTASectionSerializer,
    FooterLinkSerializer,
    HeroSectionSerializer,
    HowItWorksStepSerializer,
    JourneyBannerSerializer,
    SafetyPointSerializer,
    SafetySectionSerializer,
    SectionHeadingSerializer,
    SiteSettingsSerializer,
    VehicleTypeSerializer,
    WhyChooseUsFeatureSerializer,
    WhyChooseUsSectionSerializer,
)


class SiteSettingsView(generics.RetrieveAPIView):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.load()


class HeroSectionView(generics.RetrieveAPIView):
    serializer_class = HeroSectionSerializer

    def get_object(self):
        return HeroSection.load()


class SectionHeadingListView(generics.ListAPIView):
    queryset = SectionHeading.objects.all()
    serializer_class = SectionHeadingSerializer


class HowItWorksStepListView(generics.ListAPIView):
    queryset = HowItWorksStep.objects.all()
    serializer_class = HowItWorksStepSerializer


class JourneyBannerView(generics.RetrieveAPIView):
    serializer_class = JourneyBannerSerializer

    def get_object(self):
        return JourneyBanner.load()


class FooterLinkListView(generics.ListAPIView):
    queryset = FooterLink.objects.all()
    serializer_class = FooterLinkSerializer


class CTASectionView(generics.RetrieveAPIView):
    serializer_class = CTASectionSerializer

    def get_object(self):
        return CTASection.load()


class SafetySectionView(generics.RetrieveAPIView):
    serializer_class = SafetySectionSerializer

    def get_object(self):
        return SafetySection.load()


class SafetyPointListView(generics.ListAPIView):
    queryset = SafetyPoint.objects.all()
    serializer_class = SafetyPointSerializer


class WhyChooseUsSectionView(generics.RetrieveAPIView):
    serializer_class = WhyChooseUsSectionSerializer

    def get_object(self):
        return WhyChooseUsSection.load()


class WhyChooseUsFeatureListView(generics.ListAPIView):
    queryset = WhyChooseUsFeature.objects.all()
    serializer_class = WhyChooseUsFeatureSerializer


class VehicleTypeListView(generics.ListAPIView):
    queryset = VehicleType.objects.all()
    serializer_class = VehicleTypeSerializer


class BookingEnquiryCreateView(generics.CreateAPIView):
    queryset = BookingEnquiry.objects.all()
    serializer_class = BookingEnquirySerializer


class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
