namespace my.app;

entity Books {
  key ID        : UUID;
      title     : String(100);
      author    : String(100);
      price     : Decimal(9,2);Practice Tasks — before Handler
🔹 Task 1 — Mandatory Field Validation

👉 Before CREATE:

If title is empty → throw error.

If price <= 0 → throw error.

      stock     : Integer;
      createdAt : Timestamp;
      modifiedAt: Timestamp;
}