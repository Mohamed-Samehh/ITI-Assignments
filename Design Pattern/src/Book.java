public class Book implements BookInterface {
    private String title;
    private boolean isAvailable;
    private String authorName;
    private int year;

    public Book(String title) {
        this(title, true, "Unknown", 0);
    }

    public Book(String title, boolean isAvailable) {
        this(title, isAvailable, "Unknown", 0);
    }

    public Book(String title, boolean isAvailable, String authorName, int year) {
        this.title = title;
        this.isAvailable = isAvailable;
        this.authorName = authorName;
        this.year = year;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthorName() {
        return authorName;
    }

    public int getYear() {
        return year;
    }

    public void borrowBook(User user) {
        if (isAvailable) {
            isAvailable = false;
            System.out.println(user.getName() + " borrowed: " + title);
        } else {
            System.out.println(title + " is not available.");
        }
    }

    public void returnBook() {
        if (isAvailable) {
            System.out.println(title + " is already available.");
            return;
        }

        isAvailable = true;
        System.out.println(title + " has been returned.");
    }
}
