INSERT INTO companies (company_id, company_name, industry)
VALUES ('C001', '永續科技股份有限公司', '科技服務');

INSERT INTO employee_info (employee_id, company_id, employee_name, gender, birth_year, department, job_title)
VALUES
('E001', 'C001', '王小明', 'M', 1980, '營運部', '營運專員'),
('E002', 'C001', '林雅婷', 'F', 1988, '財務部', '財務分析師'),
('E003', 'C001', '陳志豪', 'M', 1974, '工程部', '資深工程師'),
('E004', 'C001', '黃品蓁', 'F', 1995, '人資部', '人資專員'),
('E005', 'C001', '張育仁', 'M', 1982, '業務部', '客戶經理'),
('E006', 'C001', '蔡佳容', 'F', 1977, '營運部', '專案經理');

INSERT INTO user_accounts (account_id, role, company_id, employee_id, password_hash)
VALUES
('E001', 'employee', 'C001', 'E001', 'demo-plain-1234'),
('E002', 'employee', 'C001', 'E002', 'demo-plain-1234'),
('E003', 'employee', 'C001', 'E003', 'demo-plain-1234'),
('CORP001', 'enterprise', 'C001', NULL, 'demo-plain-admin123');

INSERT INTO health_check_records (
    employee_id,
    check_year,
    waist_cm,
    systolic_bp,
    diastolic_bp,
    fasting_glucose_mg_dl,
    triglycerides_mg_dl,
    hdl_mg_dl,
    bmi,
    source_note
)
VALUES
('E001', 2024, 99, 139, 86, 112, 168, 42, 30.1, 'Kaggle metabolic fields adapted; BP synthetic'),
('E001', 2025, 97, 136, 84, 108, 152, 44, 29.8, 'Kaggle metabolic fields adapted; BP synthetic'),
('E001', 2026, 95, 135, 82, 105, 140, 45, 29.4, 'Kaggle metabolic fields adapted; BP synthetic'),
('E002', 2024, 78, 116, 74, 88, 102, 60, 23.2, 'Kaggle metabolic fields adapted; BP synthetic'),
('E002', 2025, 80, 117, 76, 91, 111, 59, 24.1, 'Kaggle metabolic fields adapted; BP synthetic'),
('E002', 2026, 82, 118, 76, 92, 118, 58, 24.8, 'Kaggle metabolic fields adapted; BP synthetic'),
('E003', 2024, 96, 134, 86, 113, 156, 39, 29.8, 'Kaggle metabolic fields adapted; BP synthetic'),
('E003', 2025, 99, 138, 88, 121, 172, 37, 30.5, 'Kaggle metabolic fields adapted; BP synthetic'),
('E003', 2026, 101, 142, 91, 128, 188, 36, 31.2, 'Kaggle metabolic fields adapted; BP synthetic'),
('E004', 2024, 74, 110, 70, 89, 96, 66, 21.7, 'Kaggle metabolic fields adapted; BP synthetic'),
('E004', 2025, 73, 109, 69, 87, 93, 67, 21.4, 'Kaggle metabolic fields adapted; BP synthetic'),
('E004', 2026, 72, 108, 68, 86, 91, 67, 21.3, 'Kaggle metabolic fields adapted; BP synthetic'),
('E005', 2024, 88, 128, 82, 96, 143, 46, 25.6, 'Kaggle metabolic fields adapted; BP synthetic'),
('E005', 2025, 90, 130, 84, 99, 150, 44, 26.1, 'Kaggle metabolic fields adapted; BP synthetic'),
('E005', 2026, 91, 132, 86, 101, 158, 43, 26.5, 'Kaggle metabolic fields adapted; BP synthetic'),
('E006', 2024, 84, 126, 78, 94, 132, 52, 25.2, 'Kaggle metabolic fields adapted; BP synthetic'),
('E006', 2025, 85, 129, 82, 98, 146, 50, 25.8, 'Kaggle metabolic fields adapted; BP synthetic'),
('E006', 2026, 87, 131, 85, 103, 162, 48, 26.4, 'Kaggle metabolic fields adapted; BP synthetic');

INSERT INTO company_health_benefits (benefit_id, company_id, category, benefit_name, description, vendor_name)
VALUES
('B001', 'C001', '健康飲食', '低 GI 健康餐盒', '憑員工證享全品項 85 折，適合血糖與三酸甘油脂需控管者。', '健康餐盒聯盟'),
('B002', 'C001', '健康飲食', '營養師線上諮詢', '每月 2 次 30 分鐘營養諮詢，依健檢數據調整飲食目標。', 'iHealth Care'),
('B003', 'C001', '運動健身', '公司內部健身房', '免費使用，並可預約駐點教練安排減脂與阻力訓練。', '公司內部資源'),
('B004', 'C001', '心理與壓力', 'EAP 員工協助方案', '提供壓力、睡眠與生活型態諮詢，支援長工時與高血壓族群。', 'EAP Partner');

INSERT INTO exercise_health_courses (course_id, company_id, course_name, coach_name, focus_tags, schedule_text, capacity)
VALUES
('C101', 'C001', '阻力訓練與減脂課', '李教練', 'waist,hdl,tg', '週三 18:30 / 週五 19:00', 16),
('C102', 'C001', '血糖友善有氧方案', '周教練', 'glucose,bp,hdl', '週二 18:20 / 週四 18:20', 20),
('C103', 'C001', '營養師餐盤調整課', '陳營養師', 'glucose,tg,waist', '週一 12:30 / 週四 17:30', 12),
('C104', 'C001', '午休正念伸展', '黃老師', 'bp', '週一、三、五 12:10', 24);

INSERT INTO course_bookings (booking_id, employee_id, course_id, booking_status)
VALUES
('BK001', 'E001', 'C101', 'confirmed'),
('BK002', 'E003', 'C102', 'confirmed'),
('BK003', 'E003', 'C103', 'confirmed'),
('BK004', 'E005', 'C101', 'confirmed'),
('BK005', 'E006', 'C104', 'confirmed');
