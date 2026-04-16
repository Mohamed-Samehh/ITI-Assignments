// Q5, Q6, Q9: Chain of Responsibility for borrow approvals
public abstract class BorrowRequestHandler {
    protected BorrowRequestHandler nextHandler;

    public void setNextHandler(BorrowRequestHandler nextHandler) {
        this.nextHandler = nextHandler;
    }

    public abstract boolean handle(BorrowRequest request);

    protected boolean passToNext(BorrowRequest request) {
        if (nextHandler == null) {
            System.out.println("Request rejected: no handler can approve " + request.getRequestedDays() + " days.");
            return false;
        }
        return nextHandler.handle(request);
    }
}
