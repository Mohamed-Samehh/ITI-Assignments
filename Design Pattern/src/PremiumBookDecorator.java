// Q3: Decorator for PremiumBook extra borrow days
public class PremiumBookDecorator extends Book {
    private final Book wrappedBook;
    private final int extraBorrowDays = 10;

    public PremiumBookDecorator(Book wrappedBook) {
        super(
                wrappedBook.getTitle(),
                wrappedBook.isAvailable(),
                wrappedBook.getAuthorName(),
                wrappedBook.getYear());
        this.wrappedBook = wrappedBook;
    }

    @Override
    public String getTitle() {
        return wrappedBook.getTitle();
    }

    @Override
    public boolean isAvailable() {
        return wrappedBook.isAvailable();
    }

    @Override
    public String getAuthorName() {
        return wrappedBook.getAuthorName();
    }

    @Override
    public int getYear() {
        return wrappedBook.getYear();
    }

    @Override
    public void borrowBook(User user) {
        wrappedBook.borrowBook(user);
        if (!wrappedBook.isAvailable()) {
            System.out.println("Premium benefit: extra " + extraBorrowDays + " days for borrowing.");
        }
    }

    @Override
    public void returnBook() {
        wrappedBook.returnBook();
    }

    public int getExtraBorrowDays() {
        return extraBorrowDays;
    }
}
