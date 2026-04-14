Task 1: Default Address Management
 
Requirement:
 
A customer can have multiple addresses.
 
Only one address can be isDefault = true.
 
If a new address is set as default, the old default should be automatically unset.
 
Implementation Hint:
 
Table: CustomerAddress
 
Hook/Event: after CREATE or before UPDATE
 
Test: Update Arun’s second address to isDefault = true → the first address should become false.
 
Task 2: Prevent Deleting Customers with Orders
 
Requirement:
 
Customers with active orders (Pending, Paid, Shipped) cannot be deleted.
 
Deletion should only be allowed if no orders exist.
 
Implementation Hint:
 
Table: Customer
 
Hook/Event: before DELETE
 
Test: Try deleting Arun → should fail because he has orders.
 
Task 3: Validate Order Creation
 
Requirement:
 
Orders must have totalAmount > 0.
 
Orders must reference an existing customer and a valid shipping address.
 
Implementation Hint:
 
Table: OrderHeader
 
Hook/Event: before CREATE
 
Test: Create a new order with totalAmount = 0 → should throw an error.
 

Task 5: Payment Validation
 
Requirement:
 
Payment amount cannot exceed the remaining amount of the order.
 
Paid amount in order should automatically update after payment.
 
Implementation Hint:
 
Table: Payment
 
Hook/Event: before CREATE → validate amount ≤ order.totalAmount - order.paidAmount
 
Hook/Event: after CREATE → update Order.paidAmount
 
Test: Create a payment higher than remaining → should fail
 
Task 6: Shipment Eligibility
 
Requirement:
 
Shipment can only be created if order is fully paid.
 
Shipment should store the shipping address and update status: Pending → In Transit → Delivered.
 
Implementation Hint:
 
Table: Shipment
 
Hook/Event: before CREATE → validate order.paidAmount >= order.totalAmount
 
Hook/Event: after CREATE → log shipment creation / send notification
 
Test: Try to create shipment for an unpaid order → should fail