package proyecto.IM.warMetrics.Proyecto1.config;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    // Inyectamos nuestro creador de tokens
    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Obtener la cabecera de autorización de la petición
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. Si no hay cabecera o no empieza con "Bearer ", ignoramos y pasamos al siguiente filtro.
        // (Será SecurityConfig quien decida luego si bloquea la ruta o si era una ruta pública como el Login)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraer el token puro (quitamos los 7 caracteres de "Bearer ")
        jwt = authHeader.substring(7);
        
        try {
            // 4. Leer el nombre de usuario que hay dentro del token
            username = jwtService.extraerUsername(jwt);

            // 5. Si hay usuario y aún no se le ha dado acceso en esta petición...
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Comprobamos que el token no sea inventado ni esté caducado
                if (jwtService.esTokenValido(jwt)) {
                    
                    // ¡Todo correcto! Creamos el "Pase de Acceso" oficial de Spring Security
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            new ArrayList<>() // Aquí irían los roles (ej. ROLE_ADMIN). Lo dejamos vacío.
                    );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Guardamos el pase para que el resto de la aplicación sepa que este usuario está logueado
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Si el token es inválido, caducado o mal formado, no hacemos nada y dejamos que Spring lo bloquee
            System.out.println("Token denegado: " + e.getMessage());
        }

        // 6. Continuar con la ejecución normal
        filterChain.doFilter(request, response);
    }
}