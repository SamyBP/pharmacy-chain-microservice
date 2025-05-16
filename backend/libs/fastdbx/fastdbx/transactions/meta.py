from functools import wraps
from typing import Any, Type, Union, Callable

from fastdbx import Datasource
from fastdbx.transactions.manager import TransactionManager

_transactional_method_prefixes = ("save", "update", "delete")


def _should_decorate_transactional(name: str, prefixes=_transactional_method_prefixes) -> bool:
    return any(name.startswith(p) for p in prefixes)


def transactional(rollback_for: Union[type[Exception], tuple[type[Exception]], None] = None):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            print(args, kwargs)
            datasource = Datasource.instance()
            with datasource.session() as session:
                with TransactionManager(session, rollback_for):
                    return func(*args, **kwargs)

        return wrapper

    return decorator


class TransactionalMetaclass(type):
    def __new__(cls, name: str, bases: tuple, attrs: dict[str, Any]) -> Type:
        cls.apply_transactional(attrs)
        return super().__new__(cls, name, bases, attrs)

    @classmethod
    def apply_transactional(cls, attrs: dict[str, Any]) -> None:
        for attr_name, attr_value in attrs.items():
            if callable(attr_value) and _should_decorate_transactional(name=attr_name):
                attrs[attr_name] = transactional(attr_value)
