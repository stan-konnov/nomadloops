from pathlib import Path

from app.settings import PROMPTS_DIR


class PromptReader:
    """A utility class to read prompts from files."""

    @staticmethod
    def read_prompt(file_name: str) -> str:
        """
        Read the content of a prompt file.

        :param file_path: The path to the prompt file.
        :return: The content of the prompt file as a string.
        """

        with Path.open(
            Path(f"{PROMPTS_DIR}/{file_name}.txt"),
            encoding="utf-8",
        ) as file:
            return file.read().strip()
