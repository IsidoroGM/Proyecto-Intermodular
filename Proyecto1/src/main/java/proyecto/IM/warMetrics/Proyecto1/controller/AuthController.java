package proyecto.IM.warMetrics.Proyecto1.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import proyecto.IM.warMetrics.Proyecto1.Service.AuthService;
import proyecto.IM.warMetrics.Proyecto1.dto.RegistroRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Para que el frontend pueda conectar sin bloqueos
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    public String registrar(@Valid @RequestBody RegistroRequest request) {
        // El @Valid activa las reglas del DTO (@Email, @Pattern, etc.)
        return authService.registrarUsuario(request);
    }


}
