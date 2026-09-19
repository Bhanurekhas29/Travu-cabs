from django.db import migrations, models


def copy_availability_forward(apps, schema_editor):
    VehicleType = apps.get_model("core", "VehicleType")
    for vehicle in VehicleType.objects.all():
        vehicle.is_available_now = bool(vehicle.availability_text.strip())
        vehicle.save(update_fields=["is_available_now"])


def noop_backward(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0013_vehicletype_vehicle_group"),
    ]

    operations = [
        migrations.AddField(
            model_name="vehicletype",
            name="is_available_now",
            field=models.BooleanField(
                default=False,
                help_text="Tick to show an 'Available Now' badge top-right of the card. Leave "
                "unticked to hide it.",
                verbose_name="Available now",
            ),
        ),
        migrations.RunPython(copy_availability_forward, noop_backward),
        migrations.RemoveField(
            model_name="vehicletype",
            name="availability_text",
        ),
    ]
