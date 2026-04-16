// Q5, Q6, Q9: Librarian handler in approval chain
public class LibrarianHandler extends BorrowRequestHandler {

    @Override
    public boolean handle(BorrowRequest request) {
        if (request.getRequestedDays() <= 7) {
            System.out.println("Librarian approved request for " + request.getRequestedDays() + " days.");
            return true;
        }
        return passToNext(request);
    }
}
