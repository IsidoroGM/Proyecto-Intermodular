package proyecto.IM.warMetrics.Proyecto1.Service;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import proyecto.IM.warMetrics.Proyecto1.dto.AtaqueRequest;
import proyecto.IM.warMetrics.Proyecto1.dto.GuardarTiradasRequest; // <-- IMPORTACIÓN NECESARIA AÑADIDA
import proyecto.IM.warMetrics.Proyecto1.dto.ResultadoResponse;
import proyecto.IM.warMetrics.Proyecto1.model.HistorialTirada;
import proyecto.IM.warMetrics.Proyecto1.model.Usuario;
import proyecto.IM.warMetrics.Proyecto1.repository.HistorialTiradaRepository;
import proyecto.IM.warMetrics.Proyecto1.repository.UsuarioRepository;

@Service
public class SimuladorService {

    private final UsuarioRepository usuarioRepository;
    private final HistorialTiradaRepository historialRepository;

    public SimuladorService(UsuarioRepository usuarioRepository, HistorialTiradaRepository historialRepository) {
        this.usuarioRepository = usuarioRepository;
        this.historialRepository = historialRepository;
    }

    public ResultadoResponse ejecutarSimulacion(AtaqueRequest req) {
        // Ejecutamos los cálculos
        int aleatorio = calcularHeridasAleatorias(req);
        double media = calcularMediaEstadistica(req);
        double mediaRedondeada = Math.round(media * 100.0) / 100.0;

        return new ResultadoResponse(aleatorio, mediaRedondeada);
    }

    // --- EL MÉTODO QUE FALTABA PARA EL HISTORIAL ---
    public void guardarEnHistorial(GuardarTiradasRequest req) {
        Usuario usuario = usuarioRepository.findById(req.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        HistorialTirada registro = new HistorialTirada(
            req.getTitulo(), 
            req.getNotas(), 
            req.getAleatorio(), 
            req.getMedia(), 
            usuario
        );
        historialRepository.save(registro);
    }

    // ------------------- SIMULACIÓN REAL (ALEATORIA) -------------------
    private int calcularHeridasAleatorias(AtaqueRequest req) {
        int impactos = 0;
        int heridasEfectivas = 0;
        int heridasTrasSalvacion = 0;
        int dañoFinal = 0;
        int heridasAutomaticas = 0;

        // 1. Fase de impacto
        for (int i = 0; i < req.getNumAtaques(); i++) {
            // SEGURIDAD: Si repeticion es null, usamos "NONE"
            String repImpacto = req.getRepeticionImpacto() != null ? req.getRepeticionImpacto() : "NONE";
            int resultado = tirarD6(repImpacto, req.getImpactoX());
            
            if (resultado >= req.getImpactoX() || req.getImpactoX() <= 1) {
                impactos++;
                // Reglas especiales en 6s
                if (resultado == 6 && req.getEspecialSeisImpacto() != null) {
                    if ("EXTRA_HIT".equals(req.getEspecialSeisImpacto())) {
                        impactos++;
                    } else if ("AUTO_WOUND".equals(req.getEspecialSeisImpacto())) {
                        heridasAutomaticas++;
                        impactos--; // El impacto se convierte en herida automática
                    }
                }
            }
        }

        // 2. Fase de herir
        for (int i = 0; i < impactos; i++) {
            String repHerir = req.getRepeticionHerir() != null ? req.getRepeticionHerir() : "NONE";
            int resultado = tirarD6(repHerir, req.getHerirX());
            
            if (resultado == 6 && req.isSeisHeridaInsalvable()) {
                heridasTrasSalvacion++;
            } else if (resultado >= req.getHerirX()) {
                heridasEfectivas++;
            }
        }

        heridasEfectivas += heridasAutomaticas;

        // 3. Salvación
        for (int i = 0; i < heridasEfectivas; i++) {
            int tirada = ThreadLocalRandom.current().nextInt(1, 7);
            if (tirada < req.getSalvacionX()) {
                heridasTrasSalvacion++;
            }
        }

        // 4. Daño + FNP (No Hay Dolor)
        // Usamos danoPorAtaque (sin ñ) para asegurar compatibilidad
        int valorDano = req.getDanoPorAtaque() > 0 ? req.getDanoPorAtaque() : 1;

        for (int i = 0; i < heridasTrasSalvacion; i++) {
            for (int d = 0; d < valorDano; d++) {
                if (req.getNoHayDolorX() > 0 && req.getNoHayDolorX() <= 6) {
                    int tirada = ThreadLocalRandom.current().nextInt(1, 7);
                    if (tirada < req.getNoHayDolorX()) {
                        dañoFinal++;
                    }
                } else {
                    dañoFinal++;
                }
            }
        }
        return dañoFinal;
    }

    private int tirarD6(String repeticion, int umbral) {
        int dado = ThreadLocalRandom.current().nextInt(1, 7);
        if ("ONES".equals(repeticion) && dado == 1) {
            dado = ThreadLocalRandom.current().nextInt(1, 7);
        } else if ("ALL".equals(repeticion) && dado < umbral) {
            dado = ThreadLocalRandom.current().nextInt(1, 7);
        }
        return dado;
    }

    // ------------------- MEDIA ESTADÍSTICA -------------------
    private double calcularMediaEstadistica(AtaqueRequest req) {
        double ataques = req.getNumAtaques();
        String repImp = req.getRepeticionImpacto() != null ? req.getRepeticionImpacto() : "NONE";
        String repHer = req.getRepeticionHerir() != null ? req.getRepeticionHerir() : "NONE";

        // 1. Impactos
        double probImpactoBase = calcularProbBase(req.getImpactoX());
        double probImpactoTotal = calcularProbConRepeticion(probImpactoBase, repImp);
        double probSeisImpacto = calcularProbSeis(repImp);

        double impactosNormales = ataques * probImpactoTotal;
        double heridasAutomaticas = 0.0;

        if ("EXTRA_HIT".equals(req.getEspecialSeisImpacto())) {
            impactosNormales += ataques * probSeisImpacto;
        } else if ("AUTO_WOUND".equals(req.getEspecialSeisImpacto())) {
            heridasAutomaticas += ataques * probSeisImpacto;
            impactosNormales -= ataques * probSeisImpacto;
        }

        // 2. Heridas
        double probHeridaBase = calcularProbBase(req.getHerirX());
        double probHeridaTotal = calcularProbConRepeticion(probHeridaBase, repHer);
        double probSeisHerida = calcularProbSeis(repHer);

        double heridasParaSalvar = heridasAutomaticas;
        double heridasInsalvables = 0.0;

        if (req.isSeisHeridaInsalvable()) {
            heridasInsalvables = impactosNormales * probSeisHerida;
            heridasParaSalvar += impactosNormales * (probHeridaTotal - probSeisHerida);
        } else {
            heridasParaSalvar += impactosNormales * probHeridaTotal;
        }

        // 3. Salvación
        double probFalloSalvacion = req.getSalvacionX() > 6 ? 1.0 : (req.getSalvacionX() - 1.0) / 6.0;
        double heridasQuePasan = (heridasParaSalvar * Math.max(0, probFalloSalvacion)) + heridasInsalvables;

        // 4. Daño final
        int valorDano = req.getDanoPorAtaque() > 0 ? req.getDanoPorAtaque() : 1;
        double danoTotal = heridasQuePasan * valorDano;

        if (req.getNoHayDolorX() > 0 && req.getNoHayDolorX() <= 6) {
            double probFalloFNP = (req.getNoHayDolorX() - 1.0) / 6.0;
            danoTotal *= Math.max(0, probFalloFNP);
        }

        return danoTotal;
    }

    private double calcularProbBase(int umbral) {
        if (umbral <= 1) return 1.0;
        if (umbral > 6) return 0.0;
        return (7.0 - umbral) / 6.0;
    }

    private double calcularProbConRepeticion(double probBase, String repeticion) {
        if (repeticion == null) return probBase;
        return switch (repeticion) {
            case "ONES" -> probBase + (1.0 / 6.0) * probBase;
            case "ALL" -> 1.0 - Math.pow(1.0 - probBase, 2);
            default -> probBase;
        };
    }

    private double calcularProbSeis(String repeticion) {
        double base = 1.0 / 6.0;
        if (repeticion == null) return base;
        return switch (repeticion) {
            case "ONES" -> base + (1.0 / 6.0) * base;
            case "ALL" -> base + (5.0 / 6.0) * base;
            default -> base;
        };
    }
}