# Test Cases Specification: Forgot Password (OTP-Based)

This document contains the test cases for the **Forgot Password** feature, based on the **actual OTP-based implementation** in your project codebase. All details are written in English.

---

## 1. Test Cases Table (Markdown Format)

| Test Case ID | Test Case Description | Test Steps | Expected Result | Preconditions | Status (Run 1) | Date (Run 1) | Tester (Run 1) | Status (Run 2) | Date (Run 2) | Tester (Run 2) | Status (Run 3) | Date (Run 3) | Tester (Run 3) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_AUTH_12** | Verify sending OTP to valid email | 1. Navigate to `/forgot-password`. <br>2. Enter a registered email (e.g., `test@example.com`). <br>3. Click "Reset Password". | - Success message displayed: "OTP sent to your email. Please check your inbox." <br>- Redirected to `/verify-otp` page. | Email service configured. | Passed | 08/06/2026 | KhoiNTN | Passed | 12/06/2026 | KhoiNTN | Passed | 14/06/2026 | KhoiNTN |
| **TC_AUTH_13** | Verify behavior for unregistered email | 1. Navigate to `/forgot-password`. <br>2. Enter an unregistered email (e.g., `unregistered@example.com`). <br>3. Click "Reset Password". | - Masked success message: "If the email exists, an OTP has been sent." (to prevent account enumeration)<br>- Redirected to `/verify-otp` page. | None. | Passed | 08/06/2026 | KhoiNTN | Passed | 12/06/2026 | KhoiNTN | Passed | 14/06/2026 | KhoiNTN |
| **TC_AUTH_14** | Verify invalid or expired OTP behavior | 1. Enter incorrect OTP (e.g., `000000`) or wait 5 minutes for OTP to expire on `/verify-otp` page. <br>2. Input new password on `/reset-password` page and submit. | - Error message displayed: "Invalid or expired OTP." <br>- Password is not changed. | Expired or incorrect OTP. | failed | 08/06/2026 | KhoiNTN | failed | 13/06/2026 | KhoiNTN | Passed | 15/06/2026 | KhoiNTN |
| **TC_AUTH_15** | Verify successful password reset with OTP | 1. Enter valid OTP on `/verify-otp` page. <br>2. Navigate to `/reset-password` page. <br>3. Enter new password (min 6 chars) and confirm password. <br>4. Click "Update Password". | - Success message displayed: "Password updated successfully! Please login with your new password." <br>- Redirected to `/login` page. <br>- Login works with new password. | Valid OTP. | failed | 08/06/2026 | KhoiNTN | failed | 13/06/2026 | KhoiNTN | Passed | 15/06/2026 | KhoiNTN |

---

## 2. Copy-Pasteable Tab-Separated Format (For Excel)
*You can copy this block directly and paste it into Excel. It will automatically split into columns.*

```tsv
Test Case ID	Test Case Description	Test Steps	Expected Result	Preconditions	Status (Run 1)	Date (Run 1)	Tester (Run 1)	Status (Run 2)	Date (Run 2)	Tester (Run 2)	Status (Run 3)	Date (Run 3)	Tester (Run 3)
TC_AUTH_12	Verify sending OTP to valid email	1. Navigate to "/forgot-password". 2. Enter a registered email. 3. Click "Reset Password".	Success message: "OTP sent to your email. Please check your inbox." and redirected to "/verify-otp".	Email service configured.	Passed	08/06/2026	KhoiNTN	Passed	12/06/2026	KhoiNTN	Passed	14/06/2026	KhoiNTN
TC_AUTH_13	Verify behavior for unregistered email	1. Navigate to "/forgot-password". 2. Enter an unregistered email. 3. Click "Reset Password".	Masked success message: "If the email exists, an OTP has been sent." and redirected to "/verify-otp" (prevents account enumeration).	None.	Passed	08/06/2026	KhoiNTN	Passed	12/06/2026	KhoiNTN	Passed	14/06/2026	KhoiNTN
TC_AUTH_14	Verify invalid or expired OTP behavior	1. Enter invalid OTP or wait 5 minutes (OTP expires) on "/verify-otp". 2. Navigate to "/reset-password" and submit new password.	Error message displayed: "Invalid or expired OTP." and password is not changed.	Expired or incorrect OTP.	failed	08/06/2026	KhoiNTN	failed	13/06/2026	KhoiNTN	Passed	15/06/2026	KhoiNTN
TC_AUTH_15	Verify successful password reset with OTP	1. Enter valid OTP on "/verify-otp" page. 2. Navigate to "/reset-password". 3. Enter new password (min 6 chars) and confirm password. 4. Click "Update Password".	Success message: "Password updated successfully! Please login with your new password." and redirected to "/login". Login works with new password.	Valid OTP.	failed	08/06/2026	KhoiNTN	failed	13/06/2026	KhoiNTN	Passed	15/06/2026	KhoiNTN
```
