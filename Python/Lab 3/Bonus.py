students = {}
with open("students.txt", "r") as f:
    for line in f:
        sid, name = line.strip().split(",")
        students[sid] = name

totals = {}
with open("grades.txt", "r") as f:
    for line in f:
        sid, subject, grade = line.strip().split(",")
        if sid not in totals:
            totals[sid] = []
        totals[sid].append(int(grade))

for sid, grades in totals.items():
    avg = sum(grades) / len(grades)
    print(students[sid], "- Average:", avg)