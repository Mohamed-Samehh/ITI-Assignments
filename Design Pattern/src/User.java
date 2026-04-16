// Q8: User is an observer for notifications
public class User implements LibraryObserver {
    private String name;
    private boolean isPremium;

    public User(String name) {
        this.name = name;
        this.isPremium = false;
    }

    public User(String name, boolean isPremium) {
        this.isPremium = isPremium;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public boolean isPremium() {
        return isPremium;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPremium(boolean premium) {
        isPremium = premium;
    }

    @Override
    public void update(String message) {
        System.out.println("Notification for " + name + ": " + message);
    }

}
