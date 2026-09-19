from django.db import migrations, models

GROUP_BY_NAME = {
    "Sedan": "sedan",
    "Fortuner": "suv",
    "Innova Crysta": "premium",
    "Innova Hycross": "premium",
    "Ertiga": "van",
    "Regular Innova": "van",
    "Tempo Traveller": "van",
    "Urbania": "van",
    "Coach Van": "van",
}


def set_vehicle_groups_forward(apps, schema_editor):
    VehicleType = apps.get_model("core", "VehicleType")
    for vehicle in VehicleType.objects.all():
        vehicle.vehicle_group = GROUP_BY_NAME.get(vehicle.name, "van")
        vehicle.save(update_fields=["vehicle_group"])


def noop_backward(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0012_vehicletype_min_max_seats"),
    ]

    operations = [
        migrations.AddField(
            model_name="vehicletype",
            name="vehicle_group",
            field=models.CharField(
                choices=[("sedan", "Sedan"), ("suv", "SUV"), ("premium", "Premium"), ("van", "Van")],
                default="van",
                help_text="Which broad group this vehicle category belongs to. Used to "
                "organise/filter vehicles on the website.",
                max_length=20,
            ),
            preserve_default=False,
        ),
        migrations.RunPython(set_vehicle_groups_forward, noop_backward),
    ]
