public class ExternalBookJsonData {
    private final String bookTitle;
    private final boolean isBorrowable;
    private final String authorName;
    private final int year;

    public ExternalBookJsonData(String bookTitle, boolean isBorrowable, String authorName, int year) {
        this.bookTitle = bookTitle;
        this.isBorrowable = isBorrowable;
        this.authorName = authorName;
        this.year = year;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public boolean isBorrowable() {
        return isBorrowable;
    }

    public String getAuthorName() {
        return authorName;
    }

    public int getYear() {
        return year;
    }
}
