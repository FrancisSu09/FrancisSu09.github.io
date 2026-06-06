#!/usr/bin/env python3
"""Convert the Kaggle metabolic syndrome CSV into iHealth demo data files."""

from __future__ import annotations

import csv
import json
import zipfile
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW_ZIP = ROOT / "data" / "raw" / "metabolic-syndrome.zip"
OUT_DIR = ROOT / "data" / "processed"
RAW_CSV_NAME = "Metabolic Syndrome.csv"
COMPANY_ID = "C001"
YEARS = [2024, 2025, 2026]

DEPARTMENTS = ["營運部", "財務部", "工程部", "人資部", "業務部", "行政部", "客服部", "產品部"]
MALE_ENGLISH_NAMES = [
    "Ken",
    "Aaron",
    "Adam",
    "Alan",
    "Andrew",
    "Arthur",
    "Benjamin",
    "Dylan",
    "Jason",
    "Kevin",
    "Brian",
    "Daniel",
    "Eric",
    "George",
    "Henry",
    "Ian",
    "Jack",
    "Leo",
    "Mark",
    "Nathan",
    "Oscar",
    "Peter",
    "Ryan",
    "Sean",
    "Victor",
    "William",
    "Charles",
    "David",
    "Edward",
    "Felix",
    "Gavin",
    "Howard",
    "Isaac",
    "Jeremy",
    "Lucas",
    "Martin",
    "Noah",
    "Owen",
    "Philip",
    "Quentin",
    "Robert",
    "Steven",
    "Thomas",
    "Vincent",
    "Wesley",
    "Zachary",
]
FEMALE_ENGLISH_NAMES = [
    "Kelly",
    "Amy",
    "Bella",
    "Claire",
    "Daisy",
    "Emily",
    "Fiona",
    "Grace",
    "Hannah",
    "Ivy",
    "Jenny",
    "Laura",
    "Mia",
    "Nina",
    "Olivia",
    "Peggy",
    "Queenie",
    "Ruby",
    "Sophie",
    "Harper",
    "Abigail",
    "Audrey",
    "Beatrice",
    "Caroline",
    "Chloe",
    "Diana",
    "Eleanor",
    "Eva",
    "Florence",
    "Georgia",
    "Hazel",
    "Isabel",
    "Julia",
    "Katherine",
    "Lily",
    "Madeline",
    "Natalie",
    "Penelope",
    "Rachel",
    "Sarah",
    "Teresa",
    "Vanessa",
    "Wendy",
    "Zoe",
]
ENGLISH_SURNAMES = [
    "Anderson",
    "Baker",
    "Carter",
    "Davis",
    "Edwards",
    "Foster",
    "Garcia",
    "Harris",
    "Irving",
    "Johnson",
    "King",
    "Lewis",
    "Miller",
    "Nelson",
    "Owens",
    "Parker",
    "Quinn",
    "Roberts",
    "Scott",
    "Turner",
    "Underwood",
    "Walker",
    "Young",
    "Adams",
    "Brooks",
    "Cooper",
    "Diaz",
    "Evans",
    "Ford",
    "Green",
    "Hill",
    "James",
    "Knight",
    "Lopez",
    "Moore",
    "Price",
    "Reed",
    "Stewart",
    "Ward",
    "Bell",
    "Coleman",
    "Fisher",
    "Gray",
    "Hayes",
    "Morgan",
    "Russell",
    "Watson",
]


def parse_float(value: str) -> float | None:
    value = value.strip()
    if value == "" or value.lower() in {"na", "nan", "null"}:
        return None
    return float(value)


def parse_int(value: str) -> int | None:
    parsed = parse_float(value)
    if parsed is None:
        return None
    return int(round(parsed))


def clean_required(row: dict[str, str]) -> bool:
    required = ["seqn", "Age", "Sex", "WaistCirc", "BMI", "BloodGlucose", "HDL", "Triglycerides"]
    return all(row.get(field, "").strip() for field in required)


def synthetic_bp(seqn: int, age: int, bmi: float, metabolic: int, waist_risk: bool, glucose: int, tg: int, hdl_risk: bool) -> tuple[int, int]:
    risk_score = int(metabolic == 1) + int(waist_risk) + int(glucose >= 100) + int(tg >= 150) + int(hdl_risk)
    age_load = max(0, age - 35) * 0.35
    bmi_load = max(0, bmi - 23) * 1.2
    noise_s = (seqn % 9) - 4
    noise_d = (seqn % 7) - 3
    systolic = round(108 + age_load + bmi_load + risk_score * 3.2 + noise_s)
    diastolic = round(68 + age_load * 0.32 + bmi_load * 0.45 + risk_score * 2.1 + noise_d)
    return max(96, min(168, systolic)), max(58, min(104, diastolic))


def metabolic_risk_count(employee: dict[str, object], record: dict[str, object]) -> int:
    gender = employee["gender"]
    waist = float(record["waist"])
    bp_s = int(record["bpS"])
    bp_d = int(record["bpD"])
    glucose = int(record["glucose"])
    tg = int(record["tg"])
    hdl = int(record["hdl"])

    return sum(
        [
            waist >= (90 if gender == "M" else 80),
            bp_s >= 130 or bp_d >= 85,
            glucose >= 100,
            tg >= 150,
            hdl < (40 if gender == "M" else 50),
        ]
    )


def english_name(gender_index: int, gender: str) -> str:
    names = MALE_ENGLISH_NAMES if gender == "M" else FEMALE_ENGLISH_NAMES
    first_name = names[gender_index % len(names)]
    surname = ENGLISH_SURNAMES[gender_index % len(ENGLISH_SURNAMES)]
    return f"{first_name} {surname}"


def build_record(employee_number: int, employee_id: str, gender: str, latest_age: int, year: int, source: dict[str, object]) -> dict[str, object]:
    age_for_year = latest_age - (YEARS[-1] - year)
    waist = float(source["waist"])
    bmi = float(source["bmi"])
    glucose = int(source["glucose"])
    hdl = int(source["hdl"])
    tg = int(source["tg"])
    metabolic = int(source["metabolic"])
    seqn = int(source["seqn"])
    waist_risk = waist >= (90 if gender == "M" else 80)
    hdl_risk = hdl < (40 if gender == "M" else 50)
    bp_s, bp_d = synthetic_bp(seqn, age_for_year, bmi, metabolic, waist_risk, glucose, tg, hdl_risk)

    return {
        "recordId": f"HC{employee_number:04d}-{year}",
        "employeeId": employee_id,
        "year": year,
        "waist": round(waist, 1),
        "bpS": bp_s,
        "bpD": bp_d,
        "glucose": glucose,
        "tg": tg,
        "hdl": hdl,
        "bmi": round(bmi, 1),
        "sourceSeqn": seqn,
        "metabolicSyndrome": metabolic,
        "bpSource": "synthetic",
    }


def latest_group_risk_count(group: list[dict[str, object]]) -> int:
    latest_source = group[-1]
    employee = {"gender": str(latest_source["gender"])}
    latest_record = build_record(1, "E001", str(latest_source["gender"]), int(latest_source["age"]), YEARS[-1], latest_source)
    return metabolic_risk_count(employee, latest_record)


def is_metabolic_demo_group(group: list[dict[str, object]], gender: str, min_age: int, max_age: int) -> bool:
    latest_source = group[-1]
    age = int(latest_source["age"])
    return (
        str(latest_source["gender"]) == gender
        and min_age <= age <= max_age
        and int(latest_source["metabolic"]) == 1
        and latest_group_risk_count(group) >= 3
    )


def prioritize_demo_groups(groups: list[list[dict[str, object]]]) -> list[list[dict[str, object]]]:
    male_40_to_59_groups = [
        group for group in groups
        if is_metabolic_demo_group(group, "M", 40, 59)
    ]
    female_30_to_49_groups = [
        group for group in groups
        if is_metabolic_demo_group(group, "F", 30, 49)
    ]
    low_risk_groups = [
        group for group in groups
        if int(group[-1]["metabolic"]) == 0 and latest_group_risk_count(group) <= 1
    ]

    pinned_groups: list[list[dict[str, object]]] = []
    if male_40_to_59_groups:
        pinned_groups.append(male_40_to_59_groups[0])
    if low_risk_groups:
        pinned_groups.append(low_risk_groups[0])
    if female_30_to_49_groups:
        pinned_groups.append(female_30_to_49_groups[0])

    pinned_ids = {id(group) for group in pinned_groups}
    return pinned_groups + [group for group in groups if id(group) not in pinned_ids]


def read_source_rows() -> list[dict[str, str]]:
    with zipfile.ZipFile(RAW_ZIP) as archive:
        with archive.open(RAW_CSV_NAME) as raw:
            return list(csv.DictReader(line.decode("utf-8-sig") for line in raw))


def normalize_source_row(row: dict[str, str]) -> dict[str, object] | None:
    if not clean_required(row):
        return None

    seqn = parse_int(row["seqn"])
    age = parse_int(row["Age"])
    waist = parse_float(row["WaistCirc"])
    bmi = parse_float(row["BMI"])
    glucose = parse_int(row["BloodGlucose"])
    hdl = parse_int(row["HDL"])
    tg = parse_int(row["Triglycerides"])
    metabolic = parse_int(row["MetabolicSyndrome"]) or 0

    if None in {seqn, age, waist, bmi, glucose, hdl, tg}:
        return None

    gender = "M" if row["Sex"].strip().lower() == "male" else "F"
    return {
        "seqn": seqn,
        "age": age,
        "gender": gender,
        "waist": waist,
        "bmi": bmi,
        "glucose": glucose,
        "hdl": hdl,
        "tg": tg,
        "metabolic": metabolic,
    }


def group_source_rows(source_rows: list[dict[str, object]]) -> list[list[dict[str, object]]]:
    buckets: dict[tuple[str, int], list[dict[str, object]]] = defaultdict(list)
    for row in source_rows:
        buckets[(str(row["gender"]), int(row["age"]))].append(row)

    groups: list[list[dict[str, object]]] = []
    for key in sorted(buckets):
        rows = sorted(
            buckets[key],
            key=lambda item: (
                item["metabolic"],
                round(float(item["bmi"])),
                round(float(item["waist"]) / 5),
                item["glucose"],
                item["tg"],
                item["hdl"],
                item["seqn"],
            ),
        )
        for start in range(0, len(rows), len(YEARS)):
            groups.append(rows[start:start + len(YEARS)])

    return groups


def convert_rows(rows: list[dict[str, str]]) -> tuple[list[dict[str, object]], list[dict[str, object]], list[dict[str, object]], dict[str, object]]:
    employee_info: list[dict[str, object]] = []
    health_records: list[dict[str, object]] = []
    user_accounts: list[dict[str, object]] = []
    source_rows: list[dict[str, object]] = []
    gender_name_counts = {"M": 0, "F": 0}
    skipped = 0

    for row in rows:
        normalized = normalize_source_row(row)
        if normalized is None:
            skipped += 1
            continue
        source_rows.append(normalized)

    grouped_rows = prioritize_demo_groups(group_source_rows(source_rows))

    for group in grouped_rows:
        employee_number = len(employee_info) + 1
        employee_id = f"E{employee_number:03d}"
        latest_source = group[-1]
        gender = str(latest_source["gender"])
        latest_age = int(latest_source["age"])
        name = english_name(gender_name_counts[gender], gender)
        gender_name_counts[gender] += 1
        employee = {
            "employeeId": employee_id,
            "name": name,
            "englishName": name,
            "gender": gender,
            "age": latest_age,
            "department": DEPARTMENTS[(employee_number - 1) % len(DEPARTMENTS)],
            "companyId": COMPANY_ID,
            "freeClasses": 2,
            "sourceSeqns": ";".join(str(item["seqn"]) for item in group),
        }

        years = YEARS[-len(group):]
        employee_records: list[dict[str, object]] = []
        for year, source in zip(years, group):
            employee_records.append(build_record(employee_number, employee_id, gender, latest_age, year, source))

        employee["freeClasses"] = 3 if metabolic_risk_count(employee, employee_records[-1]) >= 3 else 2
        user_account = {
            "accountId": employee_id,
            "password": "1234",
            "role": "employee",
            "employeeId": employee_id,
            "companyId": COMPANY_ID,
        }

        employee_info.append(employee)
        health_records.extend(employee_records)
        user_accounts.append(user_account)

    user_accounts.append(
        {
            "accountId": "CORP001",
            "password": "admin123",
            "role": "enterprise",
            "employeeId": "",
            "companyId": COMPANY_ID,
        }
    )

    metadata = {
        "source": "Kaggle antimoni/metabolic-syndrome",
        "sourceFile": RAW_CSV_NAME,
        "license": "CC0-1.0",
        "generatedYears": YEARS,
        "rawRows": len(rows),
        "convertedEmployees": len(employee_info),
        "convertedHealthRecords": len(health_records),
        "employeesWithMultipleYears": sum(
            1 for employee in employee_info
            if sum(record["employeeId"] == employee["employeeId"] for record in health_records) > 1
        ),
        "skippedRows": skipped,
        "notes": [
            "Kaggle rows are cross-sectional. Rows with the same sex and age are grouped into synthetic longitudinal demo employees.",
            "Each generated employee has up to three records assigned to 2024, 2025, and 2026.",
            "E001 is pinned to a male age 40-59 metabolic syndrome demo profile; E003 is pinned to a female age 30-49 metabolic syndrome demo profile.",
            "bpS and bpD are synthetic deterministic demo values because the source dataset has no blood pressure columns.",
            "Gender-matched unique English display names, employee IDs, departments, login accounts, and freeClasses are generated demo fields.",
        ],
    }

    return employee_info, health_records, user_accounts, metadata


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = read_source_rows()
    employee_info, health_records, user_accounts, metadata = convert_rows(rows)

    payload = {
        "metadata": metadata,
        "employeeInfo": employee_info,
        "healthCheckRecords": health_records,
        "userAccounts": user_accounts,
    }

    (OUT_DIR / "ihealth_employee_health.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_csv(
        OUT_DIR / "employee_info.csv",
        employee_info,
        ["employeeId", "name", "englishName", "gender", "age", "department", "companyId", "freeClasses", "sourceSeqns"],
    )
    write_csv(
        OUT_DIR / "health_check_records.csv",
        health_records,
        [
            "recordId",
            "employeeId",
            "year",
            "waist",
            "bpS",
            "bpD",
            "glucose",
            "tg",
            "hdl",
            "bmi",
            "sourceSeqn",
            "metabolicSyndrome",
            "bpSource",
        ],
    )
    write_csv(
        OUT_DIR / "user_accounts.csv",
        user_accounts,
        ["accountId", "password", "role", "employeeId", "companyId"],
    )

    print(json.dumps(metadata, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
