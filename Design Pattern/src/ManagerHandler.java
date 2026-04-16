// Q5, Q6, Q9: Manager handler in approval chain
public class ManagerHandler extends BorrowRequestHandler {

    @Override
    public boolean handle(BorrowRequest request) {
        if (request.getRequestedDays() <= 14) {
            System.out.println("Manager approved request for " + request.getRequestedDays() + " days.");
            return true;
        }
        return passToNext(request);
    }
}
