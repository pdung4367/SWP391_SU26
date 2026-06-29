# Use Case Specification: UC-14_View Room List

This document describes the Use Case **UC-14_View Room List** based on the project templates and the actual implementation in the project codebase (matching client-side [RoomManagementPage.jsx](file:///d:/FPT/SU2026/SWP391/SWP391_SU26/client/src/features/landlord/pages/RoomManagementPage.jsx) and server-side [roomController.js](file:///d:/FPT/SU2026/SWP391/SWP391_SU26/server/src/controllers/roomController.js#L71)).

---

## 2.4 UC-14_View Room List

### a. Functionalities

| Field | Description / Value |
| :--- | :--- |
| **UC ID and Name:** | **UC-14_View Room List** |
| **Created By:** | KhoiNTN |
| **Date Created:** | 10/06/2026 |
| **Primary Actor:** | Landlord |
| **Secondary Actors:** | None |
| **Trigger:** | Landlord navigates to the "Room Management" section in the sidebar navigation. |
| **Description:** | Allows a logged-in Landlord to view a list of all room listings under their management, showing key details like title, address, price, status, capacity, and size, with capabilities to search and filter the list. |
| **Preconditions:** | - Landlord is logged into the system.<br>- Landlord has the role of `'LANDLORD'`. |
| **Postconditions:** | - The system retrieves and renders all active room listings associated with the Landlord's account ID. |
| **Normal Flow:** | **14.1.0 View Room List**<br>1. Landlord logs in and clicks the **"Room Management"** item in the sidebar menu.<br>2. System calls the API (`GET /api/landlord/rooms`) to request all listings owned by this landlord.<br>3. Server queries the database where `landlord_id = logged_in_userId` and `is_deleted = false`.<br>4. Server retrieves room information, including primary images and facilities, and returns the data.<br>5. System displays the rooms list in a responsive card grid, showing the thumbnail image, title, address, monthly price, and a color-coded status badge (**AVAILABLE**, **OCCUPIED**, or **MAINTENANCE**).<br>6. Landlord can type terms in the search bar to filter room cards by title or address.<br>7. Landlord can click the status dropdown to filter rooms by a specific availability status (All, AVAILABLE, OCCUPIED, MAINTENANCE). |
| **Alternative Flows:** | **14.1.0.A1 Soft-Delete Room**<br>1. Landlord clicks the **Delete (Trash)** icon on a specific room card.<br>2. System prompts a confirmation dialog: *"Are you sure you want to delete this room?"*<br>3. Landlord confirms the action.<br>4. System sends a request (`DELETE /api/landlord/rooms/:roomId`) to the backend.<br>5. Server sets the room's `is_deleted` property to `true` and saves it.<br>6. System removes the deleted room card from the UI display.<br><br>**14.1.0.A2 Add/Edit Room Operations**<br>1. From the room list page, Landlord can trigger modals to perform UC-15 (Add Room) or UC-16 (Edit Room). |
| **Exceptions:** | **14.1.0.E1 No Room Listings Found**<br>1. Landlord account has no rooms created yet.<br>2. System renders an empty state screen displaying *"No rooms found. Create your first room to get started"* and an **"Add New Room"** action button.<br><br>**14.1.0.E2 Failed to Load Rooms (Server/Database Error)**<br>1. The API request to fetch rooms fails (e.g. timeout or database downtime).<br>2. System displays a top banner warning: *"Failed to load rooms"* with error details if available. |
| **Priority:** | High |
| **Frequency of Use:** | Very High |
| **Business Rules:** | - A Landlord can only query, search, and view rooms where they are the owner (`landlord_id = req.user.userId`).<br>- Soft-deleted rooms (`is_deleted: true`) must be excluded from all queries.<br>- Status badge color mappings must be consistent with room statuses (AVAILABLE = green success badge, OCCUPIED = blue info badge, MAINTENANCE = orange warning badge). |
| **Other Information:** | - Pagination and pagination controls are supported to manage large quantities of listings. |
| **Assumptions:** | - The Landlord account is active and verified to access management views. |

---

### b. Business Rules

*   **BR-14.1 (Ownership Scope Constraint):** A Landlord is strictly restricted to viewing room listings where `room.landlord_id` matches the current logged-in user ID.
*   **BR-14.2 (Soft-Delete Integrity):** Soft-deleted room records (`is_deleted = true`) must be ignored by queries and never rendered in the UI.
*   **BR-14.3 (Status Representation):** The status labels displayed on the cards must dynamically sync with the backend enum status values (`available`, `rented`, `maintenance`, `inactive`).

---

### c. Use Case Summary List Row

| ID | Use Case Name | Feature/Function | Actor | Description |
| :-: | :--- | :--- | :--- | :--- |
| **-** | **View Room List** | **Room Management** | Landlord | Landlords can view all rooms under their management. |
