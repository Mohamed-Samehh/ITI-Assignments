// Q5, Q6, Q9: Director handler in approval chain
public class DirectorHandler extends BorrowRequestHandler {

    @Override
    public boolean handle(BorrowRequest request) {
        if (request.getRequestedDays() >= 15) {
            System.out.println("Director approved request for " + request.getRequestedDays() + " days.");
            return true;
        }
        return passToNext(request);
    }
}
