def remove_vowels(word):
    vowels = "aeiouAEIOU"
    result = ""
    for char in word:
        if char not in vowels:
            result += char
    return result

print(remove_vowels("mobile"))