import javax.json.*;
import java.io.*;

public class JsonReaderDemo {
    
    public static void main(String[] args) {
        consumeJSON();
    }
    
    public static void consumeJSON() {
        try (FileInputStream fis = new FileInputStream("library.json");
             JsonReader reader = Json.createReader(fis)) {
            
            JsonObject root = reader.readObject();
            JsonObject library = root.getJsonObject("library");
            
            System.out.println("Using JsonReader\n");
            
            System.out.println("LIBRARY INFORMATION");
            System.out.println("Location: " + library.getString("location"));
            System.out.println("Description: " + library.getString("description"));
            System.out.println("Librarian: " + library.getString("librarian"));
            
            JsonArray books = library.getJsonArray("books");
            System.out.println("\n=== BOOKS (" + books.size() + ") ===");
            
            for (int i = 0; i < books.size(); i++) {
                JsonObject book = books.getJsonObject(i);
                System.out.println("\nBook " + (i + 1) + ":");
                System.out.println("Title: " + book.getString("title"));
                System.out.println("ISBN: " + book.getString("isbn"));
                System.out.println("Author: " + book.getString("author"));
                System.out.println("Preface: " + book.getString("preface"));
                
                JsonArray parts = book.getJsonArray("parts");
                System.out.println("Parts: " + parts.size());
                
                for (int j = 0; j < parts.size(); j++) {
                    JsonObject part = parts.getJsonObject(j);
                    System.out.println("Part " + (j + 1) + ": " + part.getString("title"));
                    
                    JsonArray chapters = part.getJsonArray("chapters");
                    for (int k = 0; k < chapters.size(); k++) {
                        JsonObject chapter = chapters.getJsonObject(k);
                        System.out.println("Chapter " + (k + 1) + ": " + chapter.getString("title"));
                        System.out.println("Summary: " + chapter.getString("summary"));
                        
                        JsonArray sections = chapter.getJsonArray("sections");
                        System.out.println("Sections (" + sections.size() + "):");
                        for (int l = 0; l < sections.size(); l++) {
                            System.out.println("- " + sections.getString(l));
                        }
                    }
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}