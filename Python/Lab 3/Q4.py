student_id = input("Enter student ID: ")

name = None
with open("students.txt", "r") as f:
    for line in f:
        sid, sname = line.strip().split(",")
        if sid == student_id:
            name = sname
            break

if name is None:
    print("Student not found.")
else:
    print("Student:", name)
    print("Grades:")
    with open("grades.txt", "r") as f:
        for line in f:
            sid, subject, grade = line.strip().split(",")
            if sid == student_id:
                print(" ", subject, "-", grade)