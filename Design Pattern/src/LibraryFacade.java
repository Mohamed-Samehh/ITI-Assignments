// Q6: Facade to simplify library operations
public class LibraryFacade {
    private final LibraryService libraryService = LibraryService.getInstance();
    private final BookFactory bookFactory = new BookFactory();
    private final ExternalBookDataParser externalBookDataParser = new ExternalBookDataParser();
    private final BorrowRequestHandler approvalChain;

    public LibraryFacade() {
        BorrowRequestHandler librarian = new LibrarianHandler();
        BorrowRequestHandler manager = new ManagerHandler();
        BorrowRequestHandler director = new DirectorHandler();

        librarian.setNextHandler(manager);
        manager.setNextHandler(director);

        this.approvalChain = librarian;
    }

    public void addBook(String type, String title) {
        Book book = bookFactory.createBook(type, title);
        libraryService.addBook(book);
    }

    public void addPremiumBook(String type, String title) {
        Book premiumBook = bookFactory.createPremiumBook(type, title);
        libraryService.addBook(premiumBook);
    }

    public void importBookFromExternalJson(String externalJson) {
        ExternalBookJsonData data = externalBookDataParser.parse(externalJson);
        ExternalBookDataTarget adapter = new ExternalBookAdapter(data);
        libraryService.addBook(adapter.toBook());
    }

    public void subscribe(User user) {
        libraryService.addObserver(user);
    }

    public void unsubscribe(User user) {
        libraryService.removeObserver(user);
    }

    public void requestBorrow(String title, User user, int requestedDays) {
        if (requestedDays <= 0) {
            System.out.println("Requested days must be greater than zero.");
            return;
        }

        Book book = libraryService.findBook(title);
        if (book == null) {
            System.out.println("Book not found.");
            return;
        }

        if (!book.isAvailable()) {
            System.out.println(title + " is not available right now.");
            return;
        }

        if (book instanceof PremiumEBookProxy && !user.isPremium()) {
            System.out.println("Only premium users can borrow this e-book.");
            return;
        }

        int daysForApproval = requestedDays;
        if (book instanceof PremiumBookDecorator) {
            int bonus = ((PremiumBookDecorator) book).getExtraBorrowDays();
            daysForApproval = Math.max(1, requestedDays - bonus);
            System.out.println("Premium book bonus applied. Approval days: " + daysForApproval + " instead of "
                    + requestedDays + ".");
        }

        BorrowRequest request = new BorrowRequest(title, user, daysForApproval);
        boolean approved = approvalChain.handle(request);

        if (approved) {
            libraryService.borrowBook(title, user);
        }
    }

    public void returnBook(String title) {
        libraryService.returnBook(title);
    }
}
