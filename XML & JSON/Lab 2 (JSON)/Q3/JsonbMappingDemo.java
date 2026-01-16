import javax.json.bind.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

public class JsonbMappingDemo {
    
    public static void main(String[] args) {
        System.out.println("Answers:\n");
        
        // 1: Mapping an object
        mappingAnObject();
        
        // 2: Mapping a raw collection
        mappingRawCollection();
        
        // 3: Mapping a generic collection
        mappingGenericCollection();
    }

    public static void mappingAnObject() {
        System.out.println("\nMAPPING AN OBJECT");
        
        try {
            Jsonb jsonb = JsonbBuilder.create();
            String json = Files.readString(Paths.get("library.json"));

            Map<String, Object> root = jsonb.fromJson(json, Map.class);
            Map<String, Object> libraryMap = (Map<String, Object>) root.get("library");
            
            System.out.println("Location: " + libraryMap.get("location"));
            System.out.println("Description: " + libraryMap.get("description"));
            System.out.println("Librarian: " + libraryMap.get("librarian"));
            
            List books = (List) libraryMap.get("books");
            System.out.println("Number of books: " + books.size());
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }   
    
    public static void mappingRawCollection() {
        System.out.println("\nMAPPING A RAW COLLECTION");
        
        try {
            Jsonb jsonb = JsonbBuilder.create();
            String json = Files.readString(Paths.get("library.json"));
            
            Map<String, Object> root = jsonb.fromJson(json, Map.class);
            Map<String, Object> libraryMap = (Map<String, Object>) root.get("library");
            List books = (List) libraryMap.get("books");
            
            System.out.println("Books in the library:");
            for (int i = 0; i < books.size(); i++) {
                Map book = (Map) books.get(i);
                System.out.println("Book " + (i + 1) + ": " + book.get("title") + 
                                   " by " + book.get("author"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public static void mappingGenericCollection() {
        System.out.println("\nMAPPING A GENERIC COLLECTION");
        
        try {
            Jsonb jsonb = JsonbBuilder.create();
            String json = Files.readString(Paths.get("library.json"));
            
            Map<String, Object> root = jsonb.fromJson(json, Map.class);
            String libraryJson = jsonb.toJson(root.get("library"));
            
            Library library = jsonb.fromJson(libraryJson, Library.class);
            
            System.out.println("Library: " + library.location);
            System.out.println("Librarian: " + library.librarian);
            System.out.println("\nBooks:");
            
            for (Book book : library.books) {
                System.out.println("\n  " + book.title);
                System.out.println("Author: " + book.author);
                System.out.println("ISBN: " + book.isbn);
                System.out.println("Preface: " + book.preface);
                System.out.println("Parts: " + book.parts.size());
                
                for (Part part : book.parts) {
                    System.out.println("- " + part.title + " (" + part.chapters.size() + " chapters)");
                    
                    for (Chapter chapter : part.chapters) {
                        System.out.println("* " + chapter.title);
                        System.out.println("Summary: " + chapter.summary);
                        System.out.println("Sections: " + chapter.sections.size());
                        for (String section : chapter.sections) {
                            System.out.println("- " + section);
                        }
                    }
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}