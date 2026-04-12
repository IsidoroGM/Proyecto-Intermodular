package proyecto.IM.warMetrics.Proyecto1.Service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import proyecto.IM.warMetrics.Proyecto1.dto.RegistroRequest;
import proyecto.IM.warMetrics.Proyecto1.model.Usuario;
import proyecto.IM.warMetrics.Proyecto1.repository.UsuarioRepository;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Inyectamos el repositorio y el cifrador
    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registrarUsuario(RegistroRequest request) {
        // 1. Comprobar si el nombre de usuario ya existe
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            return "Error: El nombre de usuario ya está en uso.";
        }

        // 2. Comprobar si el email ya existe
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Error: El correo electrónico ya está registrado.";
        }

        // 3. Crear el nuevo usuario y CIFRAR su contraseña
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsername(request.getUsername());
        nuevoUsuario.setEmail(request.getEmail());
        
        // Aquí usamos BCrypt para convertir la contraseña en un código ilegible
        String passwordCifrada = passwordEncoder.encode(request.getPassword());
        nuevoUsuario.setPassword(passwordCifrada);

        // 4. Guardar en la base de datos
        usuarioRepository.save(nuevoUsuario);

        return "Usuario registrado con éxito.";
    }
 
    // Método que asegura que las contraseñas coiniciden.
    public Usuario login(String username, String password) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Comparamos la contraseña escrita con la cifrada de la BBDD
        if (passwordEncoder.matches(password, usuario.getPassword())) {
            return usuario;
        } else {
            throw new RuntimeException("Contraseña incorrecta");
        }
    }


}
