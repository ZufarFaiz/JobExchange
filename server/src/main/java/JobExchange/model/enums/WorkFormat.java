package JobExchange.model.enums;

public enum WorkFormat {
    OFFICE("В офисе"),
    REMOTE("Удаленно"),
    HYBRID("Гибридный (офис + удаленно)");

    private final String description;

    WorkFormat(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
