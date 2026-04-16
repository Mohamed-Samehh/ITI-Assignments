// Q1: Singleton for only one LibraryService

// Q8: Observer for book availability notifications
import java.util.ArrayList;
import java.util.List;

public class LibraryService {
    private static LibraryService instance;
    private final List<Book> books = new ArrayList<>();
    private final List<LibraryObserver> observers = new ArrayList<>();

    private LibraryService() {

    }

    public static synchronized LibraryService getInstance() {
        if (instance == null) {
            instance = new LibraryService();
        }
        return instance;
    }

    public void addBook(Book book) {
        books.add(book);
    }

    public Book findBook(String title) {
        for (Book book : books) {
            if (book.getTitle().equalsIgnoreCase(title)) {
                return book;
            }
        }
        return null;
    }

    public void borrowBook(String title, User user) {
        Book book = findBook(title);
        if (book != null) {
            book.borrowBook(user);
        } else {
            System.out.println("Book not found.");
        }
    }

    public void returnBook(String title) {
        Book book = findBook(title);
        if (book != null) {
            boolean wasAvailable = book.isAvailable();
            book.returnBook();

            if (!wasAvailable && book.isAvailable()) {
                notifyBookAvailable(book);
            }
        } else {
            System.out.println("Book not found.");
        }
    }

    public void addObserver(LibraryObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(LibraryObserver observer) {
        observers.remove(observer);
    }

    private void notifyBookAvailable(Book book) {
        for (LibraryObserver observer : observers) {
            observer.update("Book is now available: " + book.getTitle());
        }
    }
}
