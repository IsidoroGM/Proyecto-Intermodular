package proyecto.IM.warMetrics.Proyecto1.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. Configuramos Security para que permita todas las peticiones (por ahora)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactivamos protección CSRF para pruebas locales
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Permitimos el paso a todo el mundo a todas las rutas
            );
        return http.build();
    }

    // 2. Creamos la "Máquina de Cifrado" BCrypt que usaremos en el Servicio
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
