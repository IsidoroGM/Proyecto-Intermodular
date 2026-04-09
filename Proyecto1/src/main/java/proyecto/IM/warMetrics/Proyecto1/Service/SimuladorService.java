package proyecto.IM.warMetrics.Proyecto1.Service;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import proyecto.IM.warMetrics.Proyecto1.DTO.AtaqueRequest;
import proyecto.IM.warMetrics.Proyecto1.DTO.ResultadoResponse;

@Service
public class SimuladorService {

    // MÉTODO PRINCIPAL QUE ORQUESTA AMBOS CÁLCULOS
    public ResultadoResponse ejecutarSimulacion(AtaqueRequest req) {
        int aleatorio = calcularHeridasAleatorias(req);
        
        // Calculamos la media y redondeamos a 2 decimales para que sea legible
        double media = calcularMediaEstadistica(req);
        double mediaRedondeada = Math.round(media * 100.0) / 100.0; 

        return new ResultadoResponse(aleatorio, mediaRedondeada);
    }

    // --- 1. TU CÁLCULO ALEATORIO ORIGINAL ---
    private int calcularHeridasAleatorias(AtaqueRequest req) {
        int impactos = 0;
        int heridasEfectivas = 0;
        int heridasTrasSalvacion = 0;
        int dañoFinal = 0;

        for (int i = 0; i < req.getNumAtaques(); i++) {
            int resultado = tirarD6(req.getRepeticionImpacto(), req.getImpactoX());
            if (resultado >= req.getImpactoX() || req.getImpactoX() <= 1) {
                impactos++;
                if (resultado == 6) {
                    if ("EXTRA_HIT".equals(req.getEspecialSeisImpacto())) impactos++;
                    else if ("AUTO_WOUND".equals(req.getEspecialSeisImpacto())) {
                        impactos--; 
                        heridasEfectivas++; 
                    }
                }
            }
        }

        for (int i = 0; i < impactos; i++) {
            int resultado = tirarD6(req.getRepeticionHerir(), req.getHerirX());
            if (resultado == 6 && req.isSeisHeridaInsalvable()) heridasTrasSalvacion++; 
            else if (resultado >= req.getHerirX()) heridasEfectivas++; 
        }

        for (int i = 0; i < heridasEfectivas; i++) {
            if (ThreadLocalRandom.current().nextInt(1, 7) < req.getSalvacionX()) heridasTrasSalvacion++;
        }

        for (int i = 0; i < heridasTrasSalvacion; i++) {
            for (int d = 0; d < req.getDañoPorAtaque(); d++) {
                if (req.getNoHayDolorX() > 0) {
                    if (ThreadLocalRandom.current().nextInt(1, 7) < req.getNoHayDolorX()) dañoFinal++;
                } else dañoFinal++;
            }
        }
        return dañoFinal;
    }

    private int tirarD6(String repeticion, int umbral) {
        int dado = ThreadLocalRandom.current().nextInt(1, 7);
        if ("ONES".equals(repeticion) && dado == 1) dado = ThreadLocalRandom.current().nextInt(1, 7);
        else if ("ALL".equals(repeticion) && dado < umbral) dado = ThreadLocalRandom.current().nextInt(1, 7);
        return dado;
    }

    // --- 2. EL NUEVO CÁLCULO MATEMÁTICO (MEDIA PONDERADA) ---
    private double calcularMediaEstadistica(AtaqueRequest req) {
        double ataques = req.getNumAtaques();

        // 1º Fase: Impactos
        double probImpacto = calcularProbBase(req.getImpactoX());
        double probFalloImpactoRep = calcularProbRepeticion(req.getRepeticionImpacto(), probImpacto);
        
        double probImpactoTotal = probImpacto + (probFalloImpactoRep * probImpacto);
        double probSeisImpacto = (1.0 / 6.0) + (probFalloImpactoRep * (1.0 / 6.0));

        double impactosNormales = ataques * probImpactoTotal;
        double heridasAutomaticas = 0.0;

        if ("EXTRA_HIT".equals(req.getEspecialSeisImpacto())) {
            impactosNormales += ataques * probSeisImpacto;
        } else if ("AUTO_WOUND".equals(req.getEspecialSeisImpacto())) {
            impactosNormales -= ataques * probSeisImpacto;
            heridasAutomaticas += ataques * probSeisImpacto;
        }

        // 2º Fase: Heridas
        double probHerida = calcularProbBase(req.getHerirX());
        double probFalloHeridaRep = calcularProbRepeticion(req.getRepeticionHerir(), probHerida);
        
        double probHeridaTotal = probHerida + (probFalloHeridaRep * probHerida);
        double probSeisHerida = (1.0 / 6.0) + (probFalloHeridaRep * (1.0 / 6.0));

        double heridasParaSalvar = heridasAutomaticas;
        double heridasInsalvables = 0.0;

        if (req.isSeisHeridaInsalvable()) {
            heridasInsalvables = impactosNormales * probSeisHerida;
            heridasParaSalvar += impactosNormales * (probHeridaTotal - probSeisHerida);
        } else {
            heridasParaSalvar += impactosNormales * probHeridaTotal;
        }

        // 3º Fase: Salvación (calculamos la probabilidad de FALLAR la salvación)
        double probFalloSalvacion = Math.min(1.0, Math.max(0.0, (req.getSalvacionX() - 1.0) / 6.0));
        if (req.getSalvacionX() > 6) probFalloSalvacion = 1.0; 

        double heridasTotalesQuePasan = (heridasParaSalvar * probFalloSalvacion) + heridasInsalvables;

        // 4º Fase: Daño y FNP
        double dañoFinal = heridasTotalesQuePasan * req.getDañoPorAtaque();
        
        if (req.getNoHayDolorX() > 0) {
            double probFalloFNP = Math.min(1.0, Math.max(0.0, (req.getNoHayDolorX() - 1.0) / 6.0));
            dañoFinal *= probFalloFNP;
        }

        return dañoFinal;
    }

    // Utilidades matemáticas
    private double calcularProbBase(int umbral) {
        if (umbral <= 1) return 1.0;
        return Math.min(1.0, Math.max(0.0, (7.0 - umbral) / 6.0));
    }

    private double calcularProbRepeticion(String repeticion, double probBase) {
        if ("ONES".equals(repeticion)) return 1.0 / 6.0;
        if ("ALL".equals(repeticion)) return 1.0 - probBase;
        return 0.0;
    }
}
