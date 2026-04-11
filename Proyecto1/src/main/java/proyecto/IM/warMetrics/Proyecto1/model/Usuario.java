package proyecto.IM.warMetrics.Proyecto1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



    @Entity // Le dice a Spring: "Esta clase es una tabla de la base de datos"
    @Table(name = "usuarios") // Nombramos la tabla en plural por convención
    public class Usuario {

    @Id // Define que este campo es la Clave Primaria (el identificador único)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Hace que el ID sea autoincremental (1, 2, 3...)
    private Long id;

    @Column(nullable = false, unique = true) // No puede estar vacío y no puede haber dos iguales
    private String username;

    @Column(nullable = false)
    private String password; // Más adelante la guardaremos encriptada

    @Column(nullable = false, unique = true)
    private String email;

    // JPA exige siempre un constructor vacío
    public Usuario() {
    }

    // Constructor con parámetros (opcional, pero útil)
    public Usuario(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

}
