package proyecto.IM.warMetrics.Proyecto1.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import proyecto.IM.warMetrics.Proyecto1.Service.AuthService;
import proyecto.IM.warMetrics.Proyecto1.config.JwtService;
import proyecto.IM.warMetrics.Proyecto1.dto.RegistroRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Para que el frontend pueda conectar sin bloqueos
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService; // Inyectamos el servicio de JWT para generar tokens al hacer login

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }


    // Endpoint para registro de usuarios
    // Recibe un RegistroRequest con username, email y password, y devuelve un mensaje de éxito o error
    @PostMapping("/registro")
    public String registrar(@Valid @RequestBody RegistroRequest request) {
        // El @Valid activa las reglas del DTO (@Email, @Pattern, etc.)
        return authService.registrarUsuario(request);
    }

    // Nuevo endpoint para login
    // Recibe un LoginRequest con username y password, y devuelve un JSON con id y username si es correcto    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody proyecto.IM.warMetrics.Proyecto1.dto.LoginRequest request) {
        try {
            proyecto.IM.warMetrics.Proyecto1.model.Usuario usuario = authService.login(request.getUsername(), request.getPassword());

            //1. Si el login es correcto, generamos un token JWT para este usuario
            String token = jwtService.generarToken(usuario);

             //2. Devolvemos el token junto con los datos del usuario (sin la contraseña)
             //El frontend usará este token para acceder a las rutas protegidas   



            
            // Devolvemos solo los datos necesarios al frontend (sin la contraseña)
            Map<String, Object> response = new HashMap<>();
            response.put("id", usuario.getId());
            response.put("username", usuario.getUsername());
            response.put("token", token); // Agregamos el token al JSON de respuesta

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: " + e.getMessage());
        }
    }


}
