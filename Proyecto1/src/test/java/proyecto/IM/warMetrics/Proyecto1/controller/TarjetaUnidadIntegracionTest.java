package proyecto.IM.warMetrics.Proyecto1.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import proyecto.IM.warMetrics.Proyecto1.config.JwtService;
import proyecto.IM.warMetrics.Proyecto1.dto.TarjetaUnidadRequest;
import proyecto.IM.warMetrics.Proyecto1.model.Usuario;
import proyecto.IM.warMetrics.Proyecto1.repository.TarjetaUnidadRepository;
import proyecto.IM.warMetrics.Proyecto1.repository.UsuarioRepository;

// ¡El cambio clave! Levantamos el servidor REAL en un puerto aleatorio para evitar conflictos
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TarjetaUnidadIntegracionTest {

    @Value("${local.server.port}")
    private int port;

    private RestTemplate restTemplate = new RestTemplate(); // Nuestro "fetch" de Java para hacer peticiones reales

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TarjetaUnidadRepository tarjetaRepository;

    @Autowired
    private JwtService jwtService;

    private String tokenValido;
    private Usuario usuarioTest;

    @BeforeEach
    void setUp() {
        // 1. Limpiamos la base de datos
        tarjetaRepository.deleteAll();
        usuarioRepository.deleteAll();

        // 2. Creamos nuestro Comandante de prueba
        usuarioTest = new Usuario();
        usuarioTest.setUsername("ComandanteTest");
        usuarioTest.setPassword("passwordSecreta");
        usuarioTest.setEmail("comandante@test.com"); // <-- ¡NUEVA LÍNEA AÑADIDA AQUÍ!
        
        usuarioTest = usuarioRepository.save(usuarioTest);

        // 3. Generamos su Pase VIP
        tokenValido = jwtService.generarToken(usuarioTest);
    }

    
    @Test
    void guardarTarjeta_ConTokenValido_DeberiaGuardarEnBaseDeDatos() {
        // 1. Preparamos los datos (como si fuera el formulario web)
        TarjetaUnidadRequest request = new TarjetaUnidadRequest();
        request.setUsuarioId(usuarioTest.getId());
        request.setNombre("Exterminadores de Prueba");
        request.setNumAtaques(5);
        request.setImpactoX(3);
        request.setHerirX(4);
        request.setSalvacionX(3);
        request.setDanoPorAtaque(2);

        // 2. Preparamos las cabeceras enseñando nuestro Token
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + tokenValido);
        headers.set("Content-Type", "application/json");

        // Empaquetamos los datos y las cabeceras juntos
        HttpEntity<TarjetaUnidadRequest> peticion = new HttpEntity<>(request, headers);

        // --- LA CORRECCIÓN TÁCTICA ---
        // Construimos la URL absoluta usando el puerto aleatorio asignado por Spring
        String urlCompleta = "http://localhost:" + port + "/api/tarjetas/guardar";

        // 3. ¡FUEGO! Disparamos la petición HTTP real a la URL completa
        ResponseEntity<String> response = restTemplate.exchange(
                urlCompleta,
                HttpMethod.POST,
                peticion,
                String.class
        );

        // 4. Verificaciones
        // ¿El servidor nos dejó pasar y respondió bien (200 OK)?
        assertTrue(response.getStatusCode().is2xxSuccessful(), "La petición fue denegada o falló.");

        // ¿Se guardó la tarjeta en la base de datos H2?
        assertEquals(1, tarjetaRepository.findAll().size(), "Debería haber exactamente 1 tarjeta en la base de datos.");
        assertEquals("Exterminadores de Prueba", tarjetaRepository.findAll().get(0).getNombre());
    }
}