// Q4: Proxy for premium access to EBooks
public class PremiumEBookProxy extends Book {
    private final EBook realEBook;

    public PremiumEBookProxy(EBook realEBook) {
        super(
                realEBook.getTitle(),
                realEBook.isAvailable(),
                realEBook.getAuthorName(),
                realEBook.getYear());
        this.realEBook = realEBook;
    }

    @Override
    public String getTitle() {
        return realEBook.getTitle();
    }

    @Override
    public boolean isAvailable() {
        return realEBook.isAvailable();
    }

    @Override
    public String getAuthorName() {
        return realEBook.getAuthorName();
    }

    @Override
    public int getYear() {
        return realEBook.getYear();
    }

    @Override
    public void borrowBook(User user) {
        if (!user.isPremium()) {
            System.out.println("Access denied: this e-book is for premium users only.");
            return;
        }
        realEBook.borrowBook(user);
    }

    @Override
    public void returnBook() {
        realEBook.returnBook();
    }
}
