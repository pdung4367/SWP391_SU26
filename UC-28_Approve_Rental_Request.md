# Use Case Specification: UC-28_Approve Rental Request

This document describes the Use Case **UC-28_Approve Rental Request** based on the project templates and the actual implementation in the project codebase (matching client-side [RentalRequestsPage.jsx](file:///d:/FPT/SU2026/SWP391/SWP391_SU26/client/src/features/landlord/pages/RentalRequestsPage.jsx) and server-side [rentalRequestController.js](file:///d:/FPT/SU2026/SWP391/SWP391_SU26/server/src/controllers/rentalRequestController.js#L125)).

---

## 2.5 UC-28_Approve Rental Request

### a. Functionalities

| Field | Description / Value |
| :--- | :--- |
| **UC ID and Name:** | **UC-28_Approve Rental Request** |
| **Created By:** | KhoiNTN |
| **Date Created:** | 10/06/2026 |
| **Primary Actor:** | Landlord |
| **Secondary Actors:** | None |
| **Trigger:** | Landlord clicks the "Approve Request" button in the Rental Request Details modal. |
| **Description:** | Allows a Landlord to approve a pending rental request submitted by a Tenant for an available room. Approving the request updates the room status to rented and triggers a notification to the tenant. |
| **Preconditions:** | - Landlord is logged into the system.<br>- The rental request exists and has status = `'pending'`. |
| **Postconditions:** | - The rental request status in the database is changed to `'approved'`.<br>- The rented room's availability status is updated to `'rented'`.<br>- A real-time notification is generated and sent to the Tenant. |
| **Normal Flow:** | **28.1.0 Approve Rental Request**<br>1. Landlord navigates to the **"Rental Requests"** management page.<br>2. System displays a table list of all rental requests submitted for rooms owned by the landlord.<br>3. Landlord clicks **"View Details"** on a pending request row.<br>4. System opens the Rental Request Details modal, showing tenant info, requested room info, proposed dates, lease duration, and message.<br>5. Landlord reviews the details and clicks the **"Approve Request"** button.<br>6. System prompts a confirmation dialog: *"Are you sure you want to approve this request?"*<br>7. Landlord confirms the action.<br>8. System sends a PUT request (`PUT /api/landlord/rental-requests/:requestId/approve`) to the backend.<br>9. Server validates the request (checks that status is pending and request belongs to landlord), updates request status to `'approved'`, updates corresponding room status to `'rented'`, creates a notification for the Tenant, and returns a success response.<br>10. System closes the modal, refreshes the request list, and alerts the Landlord: *"Request approved successfully!"* |
| **Alternative Flows:** | **28.1.0.A1 Reject Rental Request**<br>1. In step 5, Landlord decides to reject the request and clicks **"Reject Request"**.<br>2. System opens the Reject Modal prompting for a rejection reason.<br>3. Landlord enters the reason and clicks **"Confirm Rejection"**.<br>4. System sends a request (`PUT /api/landlord/rental-requests/:requestId/reject`) to the backend.<br>5. Server updates request status to `'rejected'` with the reason, notifies the tenant, and returns success.<br>6. System updates the UI list. |
| **Exceptions:** | **28.1.0.E1 Rental Request is Not Pending**<br>1. The selected request has already been approved, rejected, or cancelled.<br>2. System does not render "Approve Request" and "Reject Request" action buttons in the details modal. |
| **Priority:** | High |
| **Frequency of Use:** | High |
| **Business Rules:** | - Only requests with status = `'pending'` can be approved.<br>- When a request is approved, the associated room listing status must instantly shift to `'rented'`.<br>- An automated in-app notification must be delivered to the tenant upon approval or rejection. |
| **Other Information:** | - Approving a request prepares the system to initialize the contract creation process for the tenant. |
| **Assumptions:** | - The tenant's profile is valid and the landlord is satisfied with the tenant's application details. |

---

### b. Business Rules

*   **BR-28.1 (Status Constraint):** Only rental requests with a current status of `'pending'` are eligible for approval or rejection actions.
*   **BR-28.2 (State Sync Cascading):** Upon approving a rental request, the target room's status must cascade-update to `'rented'` in the database to prevent duplicate rentals.
*   **BR-28.3 (Tenant Notification):** Any approval outcome must log a notification entity linked to the tenant's user ID with type `'rental_request'`.

---

### c. Use Case Summary List Row

| ID | Use Case Name | Feature/Function | Actor | Description |
| :-: | :--- | :--- | :--- | :--- |
| **28** | **Approve Rental Request** | **Rental Request Management** | Landlord | Landlords can approve rental requests from eligible tenants. |
