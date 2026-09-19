from django.core.management.base import BaseCommand

from core.models import VehicleType

# Source: Blue Holidays Vehicle Fleet Guide (HTML) - 9 vehicle categories,
# each with a min/max seat range instead of one row per seat variant.
VEHICLE_TYPES = [
    dict(
        vehicle_group=VehicleType.VehicleGroup.SEDAN,
        name="Sedan",
        models_text="Swift Dzire, Honda Amaze, Toyota Etios",
        min_seats=3,
        max_seats=3,
        ideal_for="Small family / 2-3 guests",
        luggage_capacity="Approx. 2-3 medium bags",
        display_order=1,
        is_featured=True,
    ),
    dict(
        vehicle_group=VehicleType.VehicleGroup.VAN,
        name="Ertiga",
        models_text="Family MPV",
        min_seats=6,
        max_seats=6,
        ideal_for="4-6 guests / families",
        luggage_capacity="Approx. 3-4 medium bags",
        display_order=2,
        is_featured=True,
    ),
    dict(
        vehicle_group=VehicleType.VehicleGroup.VAN,
        name="Regular Innova",
        models_text="Comfortable family travel",
        min_seats=7,
        max_seats=7,
        ideal_for="5-7 guests / longer trips",
        luggage_capacity="Approx. 4-5 medium bags",
        display_order=3,
        is_featured=True,
    ),
    dict(
        vehicle_group=VehicleType.VehicleGroup.PREMIUM,
        name="Innova Crysta",
        models_text="Premium comfort",
        min_seats=6,
        max_seats=7,
        ideal_for="5-7 guests / premium travel",
        luggage_capacity="Approx. 4-5 medium/large bags",
        configuration_note="6+1: Captain seats in middle row. 7+1: Bench seat in middle row.",
        display_order=4,
    ),
    dict(
        vehicle_group=VehicleType.VehicleGroup.PREMIUM,
        name="Innova Hycross",
        models_text="Premium comfort & long journeys",
        min_seats=6,
        max_seats=7,
        ideal_for="5-7 guests / premium travel",
        luggage_capacity="Approx. 4-5 medium/large bags",
        configuration_note="6+1: Captain seats in middle row. 7+1: Bench seat in middle row.",
        display_order=5,
    ),
    dict(
        vehicle_group=VehicleType.VehicleGroup.SUV,
        name="Fortuner",
        models_text="Premium SUV",
        min_seats=7,
        max_seats=7,
        ideal_for="5-7 guests / premium SUV travel",
        luggage_capacity="Best with moderate luggage",
        configuration_note="7+1",
        ac_available_in_hills=True,
        display_order=6,
    ),
    dict(
        vehicle_group=VehicleType.VehicleGroup.VAN,
        name="Tempo Traveller",
        models_text="10, 12, 14, 17, 18 Seater",
        min_seats=10,
        max_seats=18,
        ideal_for="8-18 guests / group tours",
        luggage_capacity="Approx. 1 bag per guest*",
        display_order=7,
    ),
    dict(
        vehicle_group=VehicleType.VehicleGroup.VAN,
        name="Urbania",
        models_text="5, 6, 7, 8, 10, 12, 16 Seater",
        min_seats=5,
        max_seats=16,
        ideal_for="Small to medium groups",
        luggage_capacity="Varies by seating configuration*",
        ac_available_in_hills=True,
        display_order=8,
    ),
    dict(
        vehicle_group=VehicleType.VehicleGroup.VAN,
        name="Coach Van",
        models_text="21, 24 Seater",
        min_seats=21,
        max_seats=24,
        ideal_for="18-24 guests / large groups",
        luggage_capacity="Dedicated luggage space*",
        display_order=9,
    ),
]


class Command(BaseCommand):
    help = "Seeds VehicleType rows from the Blue Holidays Vehicle Fleet Guide."

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0
        for data in VEHICLE_TYPES:
            obj, created = VehicleType.objects.update_or_create(
                name=data["name"], defaults={k: v for k, v in data.items() if k != "name"}
            )
            created_count += created
            updated_count += not created

        self.stdout.write(
            self.style.SUCCESS(
                f"Vehicle types seeded: {created_count} created, {updated_count} updated. "
                f"Total in DB: {VehicleType.objects.count()}"
            )
        )
