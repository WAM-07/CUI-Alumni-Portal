# Sample Test Users & Temporary Bypass Documentation

> [!CAUTION]
> **SECURITY VULNERABILITY NOTICE (DEVELOPMENT ONLY)**
> The backend contains temporary hardcoded test credentials in `backend/app/auth/services/auth_services.py` to allow local front-to-back testing without requiring a live Redis server or Gmail SMTP credentials.
> **DO NOT DEPLOY THIS TO A PUBLIC OR PRODUCTION ENVIRONMENT.**
> 
> **How to Remove Before Production:**
> In `backend/app/auth/services/auth_services.py`, delete lines 30–56 (`HARDCODED_TEST_USERS`) and the bypass check in `user_login()`.

---

## Sample Credentials for Testing Each Role

All test accounts connect directly to real records in MongoDB (`alumni_db`), allowing full end-to-end functionality (job postings, profile edits, applicant reviews).

### 1. Student User (Single Sign-On)
- **Login Tab**: **Student (SSO)** at `http://localhost:3000/auth/login`
- **Registration Number**: `FA21-BCS-042`
- **Password**: `StudentPass123!` (or any password)
- **Dashboard**: `http://localhost:3000/dashboard/student`
- **Associated Data**: Enrolled student profile, registration number, university email, LinkedIn link, and pre-uploaded PDF CV.

---

### 2. Industry / Employer Partner
- **Login Tab**: **Corporate / Alumni** at `http://localhost:3000/auth/login`
- **Email**: `recruitment@systemsltd.com`
- **Password**: `IndustryPass123!`
- **Role**: `industry`
- **Dashboard**: `http://localhost:3000/dashboard/industry`
- **Associated Data**:
  - Company: **Systems Limited** (Technology & Software)
  - 2 Pre-seeded active job postings:
    1. *Associate Software Engineer (Full Stack)* — Full-time
    2. *Cloud DevOps Intern* — Internship
  - 1 Pre-seeded candidate application ready to review and update status (`applied` -> `reviewing` -> `shortlisted` -> `hired`).

---

### 3. Alumni User
- **Login Tab**: **Corporate / Alumni** at `http://localhost:3000/auth/login`
- **Email**: `ahmed.bilal.alumni@comsats.edu.pk` (or `ejazwamiq@gmail.com`)
- **Password**: `AlumniPass123!` (or `Password123!` for `ejazwamiq@gmail.com`)
- **Role**: `alumni`
- **Dashboard**: `http://localhost:3000/dashboard/alumni`
- **Associated Data**: Verified alumni profile, Class of 2022, Computer Science department.

---

### 4. Admin User
- **Login Tab**: **Corporate / Alumni** at `http://localhost:3000/auth/login`
- **Email**: `admin.career@comsats.edu.pk`
- **Password**: `AdminPass123!`
- **Role**: `admin`
