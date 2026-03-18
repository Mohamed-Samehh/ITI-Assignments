with open("students.txt", "r") as f:
    for line in f:
        student_id, name = line.strip().split(",")
        print("ID:", student_id, "| Name:", name)