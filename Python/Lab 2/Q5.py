def names_to_dict(names):
    result = {}
    for name in names:
        key = name[0].lower()
        if key not in result:
            result[key] = []
        result[key].append(name)
    return dict(sorted(result.items()))

print(names_to_dict(["ahmed", "fatma", "Ibrahim"]))