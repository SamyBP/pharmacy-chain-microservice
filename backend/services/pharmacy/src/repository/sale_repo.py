from fastdbx import CrudRepository

from src.domain.models import Sale


class SaleRepository(CrudRepository[Sale]):

    def __init__(self):
        super().__init__(Sale)

    def __call__(self, *args, **kwargs):
        return SaleRepository()
