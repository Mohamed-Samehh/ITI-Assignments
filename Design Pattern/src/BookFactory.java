// Q2: Factory for book creation logic
public class BookFactory {

    public Book createBook(String type, String title) {
        if (type == null) {
            return new Book(title);
        }

        switch (type.toLowerCase()) {
            case "physical":
                return new PhysicalBook(title);
            case "historical":
                return new HistoricalBook(title);
            case "ebook":
                return new EBook(title);
            case "premium-ebook":
                return new PremiumEBookProxy(new EBook(title));
            default:
                return new Book(title);
        }
    }

    public Book createPremiumBook(String type, String title) {
        return new PremiumBookDecorator(createBook(type, title));
    }
}
