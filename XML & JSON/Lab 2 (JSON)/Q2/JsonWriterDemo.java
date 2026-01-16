import javax.json.*;
import javax.json.stream.*;
import java.io.*;
import java.util.*;

public class JsonWriterDemo {
    
    public static void main(String[] args) {
        System.out.println("PRODUCING JSON (Using JsonObjectBuilder)\n");
        
        JsonObject library = Json.createObjectBuilder()
            .add("library", Json.createObjectBuilder()
                .add("location", "Alexandria Library")
                .add("description", "Historic library with ancient collections")
                .add("librarian", "Sara Mohamed")
                .add("books", Json.createArrayBuilder()
                    .add(Json.createObjectBuilder()
                        .add("title", "Effective Java")
                        .add("isbn", "978")
                        .add("author", "Joshua")
                        .add("preface", "This book is designed to help you make effective use of Java.")
                        .add("parts", Json.createArrayBuilder()
                            .add(Json.createObjectBuilder()
                                .add("title", "Creating and Destroying Objects")
                                .add("chapters", Json.createArrayBuilder()
                                    .add(Json.createObjectBuilder()
                                        .add("title", "Consider static factory methods")
                                        .add("summary", "Static factory methods provide flexibility")
                                        .add("sections", Json.createArrayBuilder()
                                            .add("Advantages of static factories")
                                            .add("Disadvantages")
                                            .add("Common naming conventions")
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
            .build();
        
        // Write to file
        try (FileWriter fw = new FileWriter("library_output.json");
             JsonWriter writer = Json.createWriter(fw)) {
            writer.writeObject(library);            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}