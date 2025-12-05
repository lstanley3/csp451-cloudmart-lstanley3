from typing import List
from pydantic import BaseModel

class CartItem(BaseModel):
    product_id: int
    quantity: int = 1

class CartResponse(BaseModel):
    items: List[CartItem]

