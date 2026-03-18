def find_positions(text, letter):
    positions = []
    for i,char in enumerate(text):
        if char == letter:
            positions.append(i)
    return positions

print(find_positions("This is javaScript", "i"))