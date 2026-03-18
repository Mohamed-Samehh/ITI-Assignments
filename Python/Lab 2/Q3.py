def multiplication_table(n):
    table = []
    for i in range(1, n + 1):
        row = []
        for j in range(1, i + 1):
            row.append(i * j)
        table.append(row)
    return table

print(multiplication_table(3))