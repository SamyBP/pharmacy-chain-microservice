from typing import Union

from sqlalchemy.orm import Session


class TransactionManager:

    def __init__(
        self,
        session: Session,
        rollback_for: Union[type[Exception], tuple[type[Exception]], None] = None,
    ):
        self.session = session
        self.rollback_for = rollback_for

    def __enter__(self):
        self.session.begin()
        return self.session

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None and self._should_rollback(exc_type):
            self.session.rollback()
        else:
            self.session.commit()

    def _should_rollback(self, exc_type) -> bool:
        if self.rollback_for is None:
            return True

        return issubclass(exc_type, self.rollback_for)
