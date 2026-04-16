public class BorrowRequest {
    private final String bookTitle;
    private final User user;
    private final int requestedDays;

    public BorrowRequest(String bookTitle, User user, int requestedDays) {
        this.bookTitle = bookTitle;
        this.user = user;
        this.requestedDays = requestedDays;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public User getUser() {
        return user;
    }

    public int getRequestedDays() {
        return requestedDays;
    }
}
