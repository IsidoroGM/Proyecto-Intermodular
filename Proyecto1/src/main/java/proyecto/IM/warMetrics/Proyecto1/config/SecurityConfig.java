package proyecto.IM.warMetrics.Proyecto1.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Desactivamos CSRF porque para una API de pruebas local no lo necesitamos
            .csrf(csrf -> csrf.disable())
            // Permitimos que todas las peticiones entren sin pedir contraseña
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );
        
        return http.build();
    }

}
