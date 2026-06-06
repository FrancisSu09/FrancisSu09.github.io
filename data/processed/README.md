# iHealth Demo Health Data

This folder contains converted demo data from the Kaggle `antimoni/metabolic-syndrome` dataset.

## Files

- `ihealth_employee_health.json`: one combined payload for the website/backend.
- `employee_info.csv`: employee profile table.
- `health_check_records.csv`: health check records table.
- `user_accounts.csv`: demo login account table.

## Field Mapping

| Website field | Source field | Note |
| --- | --- | --- |
| `employeeId` | generated | `E001`, `E002`, ... |
| `name` | generated | English demo employee display name. |
| `englishName` | generated | English demo employee name retained as a separate data column. |
| `gender` | `Sex` | `Male` -> `M`, `Female` -> `F`. |
| `age` | `Age` | Direct mapping. |
| `department` | generated | Deterministic demo department. |
| `companyId` | generated | Always `C001`. |
| `freeClasses` | generated | 3 if website risk count is 3 or more; otherwise 2. |
| `year` | generated | Assigned to 2024, 2025, or 2026 for synthetic longitudinal demo records. |
| `waist` | `WaistCirc` | Direct mapping. |
| `bmi` | `BMI` | Direct mapping. |
| `glucose` | `BloodGlucose` | Direct mapping. |
| `hdl` | `HDL` | Direct mapping. |
| `tg` | `Triglycerides` | Direct mapping. |
| `bpS` | generated | Synthetic deterministic demo value. Source dataset has no blood pressure column. |
| `bpD` | generated | Synthetic deterministic demo value. Source dataset has no blood pressure column. |
| `sourceSeqns` | `seqn` | Employee-level semicolon-separated source row IDs used for the synthetic longitudinal profile. |
| `sourceSeqn` | `seqn` | Record-level source row ID retained for traceability to the Kaggle row. |
| `metabolicSyndrome` | `MetabolicSyndrome` | Original Kaggle binary label. |
| `bpSource` | generated | Always `synthetic`. |

## Conversion Result

- Raw rows: 2401
- Converted employees: 816
- Converted health check records: 2311
- Employees with 2 or more years: 766
- Skipped rows: 90
- Skipped reason: missing at least one website-required field, mostly waist circumference or BMI.

## Longitudinal Demo Grouping

The Kaggle source is cross-sectional, not a real same-person annual follow-up dataset. To support the website's historical health check query UI, rows with the same `Sex` and `Age` are grouped into synthetic demo employees with up to three annual records:

- 3 matched rows -> 2024, 2025, 2026
- 2 matched rows -> 2025, 2026
- 1 matched row -> 2026

This keeps the generated data useful for UI and database testing, while `sourceSeqn`, `sourceSeqns`, and `bpSource` make the synthetic parts explicit.

For presentation testing, E001 is intentionally pinned to a source-backed male age 40-59 metabolic syndrome demo profile, and E003 is pinned to a source-backed female age 30-49 metabolic syndrome demo profile. E002 remains a low-risk comparison profile.

Run the converter again with:

```bash
python3 scripts/convert_metabolic_syndrome.py
```
