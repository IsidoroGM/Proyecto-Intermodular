package proyecto.IM.warMetrics.Proyecto1.config; 

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import proyecto.IM.warMetrics.Proyecto1.model.Usuario;

@Service
public class JwtService {

    // Esta es la "firma" del servidor. Si alguien intenta falsificar un token sin saber esta clave, el servidor lo rechazará.
    // NOTA: En un proyecto real de producción, esto se guarda en un archivo secreto, ¡nunca en el código!
    private static final String SECRET_KEY = "FirmaSuperSecretaDeWarMetricsQueDebeTenerAlMenos256BitsDeLongitud!!";

    // 1. Generar el Token (El "Pase VIP")
    public String generarToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getUsername()) // Guardamos el nombre del usuario dentro del token
                .setIssuedAt(new Date(System.currentTimeMillis())) // Fecha de creación (Ahora)
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Caduca en 24 horas (1 día)
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Lo firmamos con nuestra clave secreta
                .compact(); // Lo empaquetamos
    }

    // 2. Extraer el nombre de usuario del Token (Para saber quién está llamando a la puerta)
    public String extraerUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 3. Validar si el token es correcto y no ha caducado
    public boolean esTokenValido(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token);
            return true; // Si no salta ningún error, el token es 100% válido
        } catch (Exception e) {
            return false; // Si falla la firma o ha caducado, devolvemos false
        }
    }

    // Método auxiliar para transformar nuestro texto secreto en una clave criptográfica real
    private Key getSignInKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}