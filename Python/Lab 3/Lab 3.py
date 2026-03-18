# Q1
def create_files():
    with open("students.txt", "w") as f:
        f.write("1,Ahmed Ali\n")
        f.write("2,Sara Mohamed\n")
        f.write("3,Omar Hassan\n")

    with open("grades.txt", "w") as f:
        f.write("1,Python,85\n")
        f.write("1,Math,90\n")
        f.write("2,Python,78\n")
        f.write("2,Math,88\n")
        f.write("3,Python,92\n")
        f.write("3,Math,75\n")

    print("Files created successfully.")


# Q2
def show_students():
    with open("students.txt", "r") as f:
        for line in f:
            student_id, name = line.strip().split(",")
            print("ID:", student_id, "| Name:", name)


# Q3
def show_python_grades():
    with open("grades.txt", "r") as f:
        for line in f:
            student_id, subject, grade = line.strip().split(",")
            if subject == "Python":
                print("Student ID:", student_id, "| Grade:", grade)


# Q4
def show_student_grades():
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


# Bonus
def show_averages():
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


while True:
    print()
    print("Menu:")
    print("1) Create files")
    print("2) Show students")
    print("3) Show Python grades")
    print("4) Show student grades by ID")
    print("5) Show averages")
    print("0) Exit")

    selected_number = input("Choose from menu (0-5): ")

    if selected_number == "1":
        create_files()
    elif selected_number == "2":
        show_students()
    elif selected_number == "3":
        show_python_grades()
    elif selected_number == "4":
        show_student_grades()
    elif selected_number == "5":
        show_averages()
    elif selected_number == "0":
        print("Exiting...")
        break
    else:
        print("Invalid number")
