package proyecto.IM.warMetrics.Proyecto1;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import proyecto.IM.warMetrics.Proyecto1.Service.SimuladorService; 
import proyecto.IM.warMetrics.Proyecto1.dto.AtaqueRequest;
import proyecto.IM.warMetrics.Proyecto1.dto.ResultadoResponse;
import proyecto.IM.warMetrics.Proyecto1.repository.HistorialTiradaRepository;
import proyecto.IM.warMetrics.Proyecto1.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class SimuladorServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private HistorialTiradaRepository historialRepository;

    // ERROR CORREGIDO 1: Inyectamos el servicio real, NO el test
    @InjectMocks
    private SimuladorService simuladorService; 

    private AtaqueRequest requestBasico;

    @BeforeEach
    void setUp() {
        requestBasico = new AtaqueRequest();
        requestBasico.setNumAtaques(10);
        requestBasico.setImpactoX(3);           // Impacta a 3+
        requestBasico.setRepeticionImpacto("NONE");
        requestBasico.setEspecialSeisImpacto("NONE");
        requestBasico.setHerirX(4);             // Hiere a 4+
        requestBasico.setRepeticionHerir("NONE");
        requestBasico.setSeisHeridaInsalvable(false);
        requestBasico.setSalvacionX(5);         // Salva a 5+
        requestBasico.setDanoPorAtaque(1);      // Daño 1
        requestBasico.setNoHayDolorX(0);        // Sin FNP
    }

    @Test
    void ejecutarSimulacion_CalculaMediaCorrectamente() {
        // ERROR CORREGIDO 2: Llamamos a la variable simuladorService (en minúscula)
        ResultadoResponse resultado = simuladorService.ejecutarSimulacion(requestBasico);

        // Verificamos que la media matemática exacta sea 2.22 (con margen de 0.01 por los decimales)
        assertEquals(2.22, resultado.getDañoMedioEstadistico(), 0.01, "La media estadística no coincide con la fórmula esperada.");

        // Verificamos que la tirada aleatoria no sea negativa (ya que no podemos predecir el número exacto)
        assertTrue(resultado.getDañoAleatorio() >= 0, "El daño aleatorio no debería ser negativo.");
    }
}