import random
import webbrowser

sites = [
        "https://www.google.com",
        "https://www.github.com",
        "https://www.python.org",
        "https://www.wikipedia.org",
        "https://www.stackoverflow.com",
    ]
url = random.choice(sites)
print(url)
webbrowser.open(url)