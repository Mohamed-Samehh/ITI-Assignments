with open("grades.txt", "r") as f:
    for line in f:
        student_id, subject, grade = line.strip().split(",")
        if subject == "Python":
            print("Student ID:", student_id, "| Grade:", grade)