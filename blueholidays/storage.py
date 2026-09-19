from whitenoise.storage import CompressedManifestStaticFilesStorage


class LenientManifestStaticFilesStorage(CompressedManifestStaticFilesStorage):
    """Jazzmin's base.html resolves {% static 'vendor/bootswatch' %} as a URL
    prefix for a directory (not an actual file), which has no manifest entry.
    Falling back to the unhashed path instead of raising keeps admin pages working."""

    manifest_strict = False
