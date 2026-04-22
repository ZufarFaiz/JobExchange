package JobExchange.model.enums;

public enum EmploymentType {
    FULL_TIME("Полная занятость"),
    PART_TIME("Частичная занятость"),
    PROJECT("Проектная работа"),
    INTERNSHIP("Стажировка");

    private final String description;

    EmploymentType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}