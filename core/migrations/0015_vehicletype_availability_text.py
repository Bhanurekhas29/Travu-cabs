from django.db import migrations, models


def copy_availability_forward(apps, schema_editor):
    VehicleType = apps.get_model("core", "VehicleType")
    for vehicle in VehicleType.objects.all():
        vehicle.availability_text = "Available Now" if vehicle.is_available_now else ""
        vehicle.save(update_fields=["availability_text"])


def noop_backward(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0014_vehicletype_is_available_now"),
    ]

    operations = [
        migrations.AddField(
            model_name="vehicletype",
            name="availability_text",
            field=models.CharField(
                blank=True,
                default="",
                help_text="Small availability note shown top-right of the card, e.g. Available Now "
                "in Trichy. Leave blank to hide.",
                max_length=100,
            ),
            preserve_default=False,
        ),
        migrations.RunPython(copy_availability_forward, noop_backward),
        migrations.RemoveField(
            model_name="vehicletype",
            name="is_available_now",
        ),
    ]
