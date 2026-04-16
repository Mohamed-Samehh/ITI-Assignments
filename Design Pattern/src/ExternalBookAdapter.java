// Q7: Adapter for external JSON book data
public class ExternalBookAdapter implements ExternalBookDataTarget {
    private final ExternalBookJsonData externalBookJsonData;

    public ExternalBookAdapter(ExternalBookJsonData externalBookJsonData) {
        this.externalBookJsonData = externalBookJsonData;
    }

    @Override
    public Book toBook() {
        return new Book(
                externalBookJsonData.getBookTitle(),
                externalBookJsonData.isBorrowable(),
                externalBookJsonData.getAuthorName(),
                externalBookJsonData.getYear());
    }
}
