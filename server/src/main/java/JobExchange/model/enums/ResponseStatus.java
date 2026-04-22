package JobExchange.model.enums;

public enum ResponseStatus {
    PENDING("На рассмотрении"),
    REVIEWED("Просмотрено"),
    APPROVED("Одобрено"),
    REJECTED("Отклонено");

    private final String description;

    ResponseStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}