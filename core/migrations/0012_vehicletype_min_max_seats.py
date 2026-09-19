from django.db import migrations, models


def copy_seating_capacity_forward(apps, schema_editor):
    VehicleType = apps.get_model("core", "VehicleType")
    for vehicle in VehicleType.objects.all():
        vehicle.min_seats = vehicle.seating_capacity
        vehicle.max_seats = vehicle.seating_capacity
        vehicle.save(update_fields=["min_seats", "max_seats"])


def copy_min_seats_backward(apps, schema_editor):
    VehicleType = apps.get_model("core", "VehicleType")
    for vehicle in VehicleType.objects.all():
        vehicle.seating_capacity = vehicle.min_seats
        vehicle.save(update_fields=["seating_capacity"])


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0011_sitesettings_google_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="vehicletype",
            name="min_seats",
            field=models.PositiveIntegerField(
                default=1,
                help_text="Smallest passenger seat count this vehicle category comes in (not counting "
                "the driver). e.g. 3. Use the same value as Maximum seats if this category only comes "
                "in one size.",
                verbose_name="Minimum seats",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="vehicletype",
            name="max_seats",
            field=models.PositiveIntegerField(
                default=1,
                help_text="Largest passenger seat count this vehicle category comes in (not counting "
                "the driver). e.g. 18. Use the same value as Minimum seats if this category only comes "
                "in one size.",
                verbose_name="Maximum seats",
            ),
            preserve_default=False,
        ),
        migrations.RunPython(copy_seating_capacity_forward, copy_min_seats_backward),
        migrations.RemoveField(
            model_name="vehicletype",
            name="seating_capacity",
        ),
    ]
