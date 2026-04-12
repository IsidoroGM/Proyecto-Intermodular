package proyecto.IM.warMetrics.Proyecto1.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import proyecto.IM.warMetrics.Proyecto1.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Aquí podríamos agregar métodos personalizados de consulta si los necesitamos
    // Spring Boot leerá este nombre y creará automáticamente una consulta SQL: 
    // SELECT * FROM usuarios WHERE username = ?

    Optional<Usuario> findByUsername(String username);
    
    // Lo mismo para el email
    Optional<Usuario> findByEmail(String email);
    
    // Para comprobar si un nombre ya está en uso al registrarse
    boolean existsByUsername(String username);
}

