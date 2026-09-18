from django.core.exceptions import ValidationError

MAX_IMAGE_SIZE_MB = 20
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024


def validate_image_max_size(file):
    if file.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError(f"Image file is too large. Maximum allowed size is {MAX_IMAGE_SIZE_MB}MB.")
