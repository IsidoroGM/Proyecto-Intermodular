package proyecto.IM.warMetrics.Proyecto1.Service;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import proyecto.IM.warMetrics.Proyecto1.dto.AtaqueRequest;
import proyecto.IM.warMetrics.Proyecto1.dto.ResultadoResponse;

@Service
public class SimuladorService {

    public ResultadoResponse ejecutarSimulacion(AtaqueRequest req) {
        int aleatorio = calcularHeridasAleatorias(req);

        double media = calcularMediaEstadistica(req);
        double mediaRedondeada = Math.round(media * 100.0) / 100.0;

        return new ResultadoResponse(aleatorio, mediaRedondeada);
    }

    // ------------------- SIMULACIÓN REAL -------------------
    private int calcularHeridasAleatorias(AtaqueRequest req) {
        int impactos = 0;
        int heridasEfectivas = 0;
        int heridasTrasSalvacion = 0;
        int dañoFinal = 0;

        int heridasAutomaticas = 0;

        //------------------ 1. Fase de impacto ------------------
        for (int i = 0; i < req.getNumAtaques(); i++) {
            int resultado = tirarD6(req.getRepeticionImpacto(), req.getImpactoX());

            if (resultado >= req.getImpactoX() || req.getImpactoX() <= 1) {
                impactos++;

                if (resultado == 6) {
                    if ("EXTRA_HIT".equals(req.getEspecialSeisImpacto())) {
                        impactos++;
                    } else if ("AUTO_WOUND".equals(req.getEspecialSeisImpacto())) {
                        heridasAutomaticas++; // ✅ NO quitamos impacto
                    }
                }
            }
        }

        //------------------ 2. Fase de herir ------------------
        for (int i = 0; i < impactos; i++) {
            int resultado = tirarD6(req.getRepeticionHerir(), req.getHerirX());

            if (resultado == 6 && req.isSeisHeridaInsalvable()) {
                heridasTrasSalvacion++;
            } else if (resultado >= req.getHerirX()) {
                heridasEfectivas++;
            }
        }

        // Añadimos heridas automáticas directamente a salvación
        heridasEfectivas += heridasAutomaticas;

        //------------------ 3. Salvación ------------------
        for (int i = 0; i < heridasEfectivas; i++) {
            int tirada = ThreadLocalRandom.current().nextInt(1, 7);

            if (tirada < req.getSalvacionX()) {
                heridasTrasSalvacion++;
            }
        }

        //------------------ 4. Daño + FNP ------------------
        for (int i = 0; i < heridasTrasSalvacion; i++) {
            for (int d = 0; d < req.getDañoPorAtaque(); d++) {

                if (req.getNoHayDolorX() > 0) {
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

        //------------------ 1. Impactos ------------------
        double probImpactoBase = calcularProbBase(req.getImpactoX());
        double probImpactoTotal = calcularProbConRepeticion(probImpactoBase, req.getRepeticionImpacto());
        double probSeisImpacto = calcularProbSeis(req.getRepeticionImpacto());

        double impactosNormales = ataques * probImpactoTotal;
        double heridasAutomaticas = 0.0;

        if ("EXTRA_HIT".equals(req.getEspecialSeisImpacto())) {
            impactosNormales += ataques * probSeisImpacto;
        } else if ("AUTO_WOUND".equals(req.getEspecialSeisImpacto())) {
            heridasAutomaticas += ataques * probSeisImpacto;
        }

        //------------------ 2. Heridas ------------------
        double probHeridaBase = calcularProbBase(req.getHerirX());
        double probHeridaTotal = calcularProbConRepeticion(probHeridaBase, req.getRepeticionHerir());
        double probSeisHerida = calcularProbSeis(req.getRepeticionHerir());

        double heridasParaSalvar = heridasAutomaticas;
        double heridasInsalvables = 0.0;

        if (req.isSeisHeridaInsalvable()) {
            heridasInsalvables = impactosNormales * probSeisHerida;
            heridasParaSalvar += impactosNormales * (probHeridaTotal - probSeisHerida);
        } else {
            heridasParaSalvar += impactosNormales * probHeridaTotal;
        }

        //------------------ 3. Salvación ------------------
        double probFalloSalvacion = Math.min(1.0, Math.max(0.0, (req.getSalvacionX() - 1.0) / 6.0));
        if (req.getSalvacionX() > 6) probFalloSalvacion = 1.0;

        double heridasTotalesQuePasan = (heridasParaSalvar * probFalloSalvacion) + heridasInsalvables;

        //------------------ 4. Daño ------------------
        double dañoFinal = heridasTotalesQuePasan * req.getDañoPorAtaque();

        if (req.getNoHayDolorX() > 0) {
            double probFalloFNP = Math.min(1.0, Math.max(0.0, (req.getNoHayDolorX() - 1.0) / 6.0));
            dañoFinal *= probFalloFNP;
        }

        return dañoFinal;
    }

    // ------------------- UTILIDADES -------------------

    private double calcularProbBase(int umbral) {
        if (umbral <= 1) return 1.0;
        return Math.min(1.0, Math.max(0.0, (7.0 - umbral) / 6.0));
    }

    private double calcularProbConRepeticion(double probBase, String repeticion) {
        switch (repeticion) {
            case "ONES":
                return probBase + (1.0 / 6.0) * probBase;
            case "ALL":
                double fallo = 1.0 - probBase;
                return 1.0 - (fallo * fallo);
            default:
                return probBase;
        }
    }

    private double calcularProbSeis(String repeticion) {
        double base = 1.0 / 6.0;

        switch (repeticion) {
            case "ONES":
                return base + (1.0 / 6.0) * base;
            case "ALL":
                return base + (5.0 / 6.0) * base;
            default:
                return base;
        }
    }
}