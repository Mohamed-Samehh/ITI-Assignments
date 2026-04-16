import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ExternalBookDataParser {

    public ExternalBookJsonData parse(String json) {
        String title = readString(json, "bookTitle", "Unknown");
        boolean borrowable = readBoolean(json, "isBorrowable", true);
        String author = readString(json, "authorName", "Unknown");
        int year = readInt(json, "year", 0);

        return new ExternalBookJsonData(title, borrowable, author, year);
    }

    private String readString(String json, String key, String defaultValue) {
        String regex = "\\\"" + key + "\\\"\\s*:\\s*\\\"([^\\\"]*)\\\"";
        Matcher matcher = Pattern.compile(regex).matcher(json);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return defaultValue;
    }

    private boolean readBoolean(String json, String key, boolean defaultValue) {
        String regex = "\\\"" + key + "\\\"\\s*:\\s*(true|false)";
        Matcher matcher = Pattern.compile(regex).matcher(json);
        if (matcher.find()) {
            return Boolean.parseBoolean(matcher.group(1));
        }
        return defaultValue;
    }

    private int readInt(String json, String key, int defaultValue) {
        String regex = "\\\"" + key + "\\\"\\s*:\\s*(\\d+)";
        Matcher matcher = Pattern.compile(regex).matcher(json);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return defaultValue;
    }
}
