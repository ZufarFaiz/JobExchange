package JobExchange.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="applicants")
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "user_id")
public class Applicant extends User{
    private String resumeUrl;
}
