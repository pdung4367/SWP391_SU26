# Use Case Specification: UC-18_Cancel Contract

This document describes the Use Case **UC-18_Cancel Contract** based on the project templates and the actual implementation in the project codebase (matching database models in [Contract.js](file:///d:/FPT/SU2026/SWP391/SWP391_SU26/server/src/models/Contract.js) and contract termination logic in [contractController.js](file:///d:/FPT/SU2026/SWP391/SWP391_SU26/server/src/controllers/contractController.js#L326)).

---

## 2.3 UC-18_Cancel Contract

### a. Functionalities

| Field | Description / Value |
| :--- | :--- |
| **UC ID and Name:** | **UC-18_Cancel Contract** |
| **Created By:** | KhoiNTN |
| **Date Created:** | 10/06/2026 |
| **Primary Actor:** | Tenant |
| **Secondary Actors:** | Landlord |
| **Trigger:** | Tenant clicks the "Request Cancellation" or "Cancel Contract" button on their active contract page. |
| **Description:** | Allows a Tenant to cancel or request early termination of their active rental contract in accordance with the established cancellation and deposit policies. |
| **Preconditions:** | - Tenant is logged into the system.<br>- An active contract exists between the Tenant and the Landlord (`status = 'active'`). |
| **Postconditions:** | - The contract status in the database is updated to `terminated`.<br>- The rented room's status is reset back to `available` for public searching.<br>- The Landlord receives a real-time notification regarding the cancellation.<br>- Financial deposit refund or forfeiture is processed. |
| **Normal Flow:** | **18.1.0 Cancel Rental Contract**<br>1. Tenant logs in and navigates to the "My Contracts" or "My Dashboard" section.<br>2. System displays a list of active contracts.<br>3. Tenant selects the active contract they wish to terminate and views its details.<br>4. Tenant clicks the **"Cancel Contract"** button.<br>5. System calculates and displays a summary of the Cancellation Policy terms (e.g., notice period, deposit refund calculations, early termination fees).<br>6. Tenant is prompted to select/input the **Reason for Cancellation** and accept the financial settlement/penalty policy.<br>7. Tenant clicks **"Confirm Cancellation"**.<br>8. System validates the request, updates the contract status to `'terminated'`, and resets the corresponding Room status back to `'available'`.<br>9. System sends a real-time notification to the Landlord.<br>10. System displays a success message: *"Contract terminated successfully according to the policy."* |
| **Alternative Flows:** | **18.1.0.A1 Landlord Approval Required (Mutual Agreement)**<br>1. Under certain lease policies, early cancellation requires landlord confirmation.<br>2. Tenant clicks **"Request Cancellation"** and enters the reason.<br>3. System updates contract status to `'termination_pending'` and notifies the Landlord.<br>4. Landlord reviews the request in their portal and clicks **"Approve Termination"**.<br>5. System updates contract to `'terminated'` and sets the Room status to `'available'`. |
| **Exceptions:** | **18.1.0.E1 Contract is Not Active**<br>1. The selected contract is already expired, renewed, or terminated.<br>2. System disables the cancellation actions and displays: *"Only active contracts can be terminated."*<br><br>**18.1.0.E2 Notice Period / Policy Violation Penalty**<br>1. Tenant attempts cancellation with less than the required notice period (e.g. 30 days).<br>2. System displays warning: *"Notice period is insufficient. Submitting this cancellation will forfeit your security deposit of $X. Do you wish to proceed?"*<br>3. If Tenant clicks "Cancel", flow terminates. If "Proceed", system completes termination and marks the deposit as forfeited. |
| **Priority:** | Medium |
| **Frequency of Use:** | Low |
| **Business Rules:** | - Only active contracts (`status = 'active'`) can be terminated.<br>- Upon contract termination, the associated room's status must automatically transition back to `'available'`.<br>- Deposit refunds are calculated based on the notice period provided before termination (e.g. full refund if notice >= 30 days; forfeited if notice < 30 days). |
| **Other Information:** | - Automated contract status updates and notifications are managed via backend hooks. |
| **Assumptions:** | - The Tenant has read and agreed to the early termination terms during the contract signing phase. |

---

### b. Business Rules

*   **BR-18.1 (Contract Active State Constraint):** Contract termination actions are strictly restricted to contracts with an `'active'` status.
*   **BR-18.2 (Notice Period & Deposit Forfeiture Policy):** If a tenant cancels a contract early with less than 30 days' notice, the security deposit (`deposit_amount`) is automatically forfeited to the landlord as a penalty.
*   **BR-18.3 (Room Availability Release):** Once a contract is successfully marked as `'terminated'`, the associated room listing's status must instantly be updated to `'available'` so it can be searched by other tenants.
*   **BR-18.4 (Real-time Notification Trigger):** Every cancellation action must immediately trigger a notification to the counterpart (the Landlord) to ensure timely turnover.

---

### c. Use Case Summary List Row

| ID | Use Case Name | Feature/Function | Actor | Description |
| :-: | :--- | :--- | :--- | :--- |
| **18** | **Cancel Contract** | **Contract Management** | Tenant | Tenants can cancel rental contracts according to policies. |
