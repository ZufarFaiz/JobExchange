package JobExchange.model.enums;

public enum ExperienceLevel {
    NO_EXPERIENCE("Без опыта"),
    JUNIOR("Начинающий (Junior)"),
    MIDDLE("Средний (Middle)"),
    SENIOR("Старший (Senior)");

    private final String description;

    ExperienceLevel(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
