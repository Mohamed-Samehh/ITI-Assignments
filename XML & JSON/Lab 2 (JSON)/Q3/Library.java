import java.util.List;

class Library {
    public String location;
    public String description;
    public String librarian;
    public List<Book> books;
    
    @Override
    public String toString() {
        return "Library{location='" + location + "', librarian='" + librarian + "', books=" + books.size() + "}";
    }
}

class Book {
    public String title;
    public String isbn;
    public String author;
    public String preface;
    public List<Part> parts;
    
    @Override
    public String toString() {
        return "Book{title='" + title + "', author='" + author + "', isbn='" + isbn + "'}";
    }
}

class Part {
    public String title;
    public List<Chapter> chapters;
    
    @Override
    public String toString() {
        return "Part{title='" + title + "', chapters=" + chapters.size() + "}";
    }
}

class Chapter {
    public String title;
    public String summary;
    public List<String> sections;
    
    @Override
    public String toString() {
        return "Chapter{title='" + title + "'}";
    }
}