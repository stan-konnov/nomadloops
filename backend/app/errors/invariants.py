class LoopGenerationProcessAlreadyRunningError(Exception):
    """Raised when a generation process is running and a new one is attempted."""


class LoopGenerationProcessNotFoundError(Exception):
    """Raised when a a status of generation process is not found in the database."""
