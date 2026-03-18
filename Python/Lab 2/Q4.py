import math

def calculate_area(shape, a, b=None):
    if shape == "t":
        return 0.5 * a * b
    elif shape == "r":
        if b:
            return a * b
        else:
            return a * a
    elif shape == "c":
        return math.pi * a ** 2

print(calculate_area("t", 10, 7))
print(calculate_area("r", 10, 7))
print(calculate_area("r", 10))
print(calculate_area("c", 10))