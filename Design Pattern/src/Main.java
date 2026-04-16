public class Main {
    public static void main(String[] args) {
        LibraryFacade library = new LibraryFacade();

        User john = new User("John", false);
        User alex = new User("Alex", true);

        library.subscribe(john);
        library.subscribe(alex);

        library.addBook("physical", "Harry Potter");
        library.addBook("historical", "History Of Egypt");
        library.addBook("premium-ebook", "Premium Java Patterns");
        library.addPremiumBook("physical", "Design Patterns In Practice");

        String externalJson = "{\"bookTitle\":\"Design Patterns\",\"isBorrowable\":true,\"authorName\":\"Erich Gamma\",\"year\":1994}";
        library.importBookFromExternalJson(externalJson);

        library.requestBorrow("Premium Java Patterns", john, 5);
        library.requestBorrow("Premium Java Patterns", alex, 5);
        library.requestBorrow("Harry Potter", john, 16);
        library.requestBorrow("Design Patterns In Practice", alex, 20);

        library.returnBook("Premium Java Patterns");

    }
}
