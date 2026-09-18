from django.core.management.base import BaseCommand

from core.models import VehicleType

# Source: Blue Holidays Vehicle Fleet Guide (HTML), seat variants split into
# separate rows per client decision so each can carry its own rates later.
VEHICLE_TYPES = [
    dict(
        name="Sedan",
        models_text="Swift Dzire, Honda Amaze, Toyota Etios",
        seating_capacity=3,
        ideal_for="Small family / 2-3 guests",
        luggage_capacity="Approx. 2-3 medium bags",
        display_order=1,
        is_featured=True,
    ),
    dict(
        name="Ertiga",
        models_text="Family MPV",
        seating_capacity=6,
        ideal_for="4-6 guests / families",
        luggage_capacity="Approx. 3-4 medium bags",
        display_order=2,
        is_featured=True,
    ),
    dict(
        name="Regular Innova",
        models_text="Comfortable family travel",
        seating_capacity=7,
        ideal_for="5-7 guests / longer trips",
        luggage_capacity="Approx. 4-5 medium bags",
        display_order=3,
        is_featured=True,
    ),
    dict(
        name="Innova Crysta 6+1",
        models_text="Premium comfort",
        seating_capacity=7,
        ideal_for="5-7 guests / premium travel",
        luggage_capacity="Approx. 4-5 medium/large bags",
        configuration_note="Captain seats in middle row",
        display_order=4,
    ),
    dict(
        name="Innova Crysta 7+1",
        models_text="Premium comfort",
        seating_capacity=8,
        ideal_for="5-7 guests / premium travel",
        luggage_capacity="Approx. 4-5 medium/large bags",
        configuration_note="Bench seat in middle row",
        display_order=5,
    ),
    dict(
        name="Innova Hycross 6+1",
        models_text="Premium comfort & long journeys",
        seating_capacity=7,
        ideal_for="5-7 guests / premium travel",
        luggage_capacity="Approx. 4-5 medium/large bags",
        configuration_note="Captain seats in middle row",
        display_order=6,
    ),
    dict(
        name="Innova Hycross 7+1",
        models_text="Premium comfort & long journeys",
        seating_capacity=8,
        ideal_for="5-7 guests / premium travel",
        luggage_capacity="Approx. 4-5 medium/large bags",
        configuration_note="Bench seat in middle row",
        display_order=7,
    ),
    dict(
        name="Fortuner",
        models_text="Premium SUV",
        seating_capacity=8,
        ideal_for="5-7 guests / premium SUV travel",
        luggage_capacity="Best with moderate luggage",
        configuration_note="7+1",
        ac_available_in_hills=True,
        display_order=8,
    ),
    *[
        dict(
            name=f"Tempo Traveller {seats} Seater",
            models_text="Tempo Traveller",
            seating_capacity=seats,
            ideal_for="8-18 guests / group tours",
            luggage_capacity="Approx. 1 bag per guest*",
            display_order=9,
        )
        for seats in [10, 12, 14, 17, 18]
    ],
    *[
        dict(
            name=f"Urbania {seats} Seater",
            models_text="Urbania",
            seating_capacity=seats,
            ideal_for="Small to medium groups",
            luggage_capacity="Varies by seating configuration*",
            ac_available_in_hills=True,
            display_order=10,
        )
        for seats in [5, 6, 7, 8, 10, 12, 16]
    ],
    *[
        dict(
            name=f"Coach Van {seats} Seater",
            models_text="Coach Van",
            seating_capacity=seats,
            ideal_for="18-24 guests / large groups",
            luggage_capacity="Dedicated luggage space*",
            display_order=11,
        )
        for seats in [21, 24]
    ],
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
