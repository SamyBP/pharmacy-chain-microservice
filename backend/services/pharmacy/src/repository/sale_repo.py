from datetime import datetime, timedelta

from fastdbx import CrudRepository
from sqlalchemy import select, func, desc

from src.domain.internal.abstracts import AbstractSaleRepository
from src.domain.models import Sale, SaleItem, Pharmacy


class SaleRepository(AbstractSaleRepository, CrudRepository[Sale]):

    def __init__(self):
        super().__init__(Sale)

    def __call__(self, *args, **kwargs):
        return SaleRepository()

    def find_medication_qsum_by_manager_id_limit(self, manager_id: int, limit: int):
        statement = (
            select(SaleItem.medication_id, func.sum(SaleItem.quantity).label("q"))
            .join(Sale, SaleItem.sale_id == Sale.id)
            .join(Pharmacy, Sale.pharmacy_id == Pharmacy.id)
            .where(Pharmacy.manager_id == manager_id)
            .group_by(SaleItem.medication_id)
            .order_by(desc("q"))
            .limit(limit)
        )

        return self.session.execute(statement).all()

    def find_date_scount_tsum_by_manager_id_days(self, manager_id, days: int):
        start_date = datetime.now() - timedelta(days=days)

        statement = (
            select(
                func.date(Sale.created_at).label("sale_date"),
                func.sum(Sale.total_amount).label("total_sales_amount"),
                func.count(Sale.id).label("number_of_sales"),
            )
            .join(Pharmacy, Sale.pharmacy_id == Pharmacy.id)
            .where(Sale.created_at >= start_date, Pharmacy.manager_id == manager_id)
            .group_by("sale_date")
            .order_by("sale_date")
        )

        return self.session.execute(statement).mappings().all()
