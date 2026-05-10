PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS companies (
    company_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_accounts (
    account_id TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('employee', 'enterprise')),
    company_id TEXT NOT NULL,
    employee_id TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    FOREIGN KEY (employee_id) REFERENCES employee_info(employee_id)
);

CREATE TABLE IF NOT EXISTS employee_info (
    employee_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
    birth_year INTEGER,
    department TEXT NOT NULL,
    job_title TEXT,
    active_status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

CREATE TABLE IF NOT EXISTS health_check_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    check_year INTEGER NOT NULL,
    waist_cm REAL NOT NULL,
    systolic_bp INTEGER NOT NULL,
    diastolic_bp INTEGER NOT NULL,
    fasting_glucose_mg_dl REAL NOT NULL,
    triglycerides_mg_dl REAL NOT NULL,
    hdl_mg_dl REAL NOT NULL,
    bmi REAL,
    source_note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (employee_id, check_year),
    FOREIGN KEY (employee_id) REFERENCES employee_info(employee_id)
);

CREATE TABLE IF NOT EXISTS company_health_benefits (
    benefit_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    category TEXT NOT NULL,
    benefit_name TEXT NOT NULL,
    description TEXT NOT NULL,
    vendor_name TEXT,
    active_status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

CREATE TABLE IF NOT EXISTS exercise_health_courses (
    course_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    coach_name TEXT NOT NULL,
    focus_tags TEXT NOT NULL,
    schedule_text TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    active_status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

CREATE TABLE IF NOT EXISTS course_bookings (
    booking_id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'confirmed',
    booked_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee_info(employee_id),
    FOREIGN KEY (course_id) REFERENCES exercise_health_courses(course_id)
);

CREATE INDEX IF NOT EXISTS idx_health_check_employee_year
ON health_check_records(employee_id, check_year DESC);

CREATE INDEX IF NOT EXISTS idx_employee_company_department
ON employee_info(company_id, department);

CREATE INDEX IF NOT EXISTS idx_course_bookings_course
ON course_bookings(course_id);
