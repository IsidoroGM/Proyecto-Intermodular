package proyecto.IM.warMetrics.Proyecto1.Service;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import proyecto.IM.warMetrics.Proyecto1.DTO.AtaqueRequest;

@Service //Esta anotación le dice a Spring que esta clase es un componente que debe gestionar y que contiene lógica de negocio.
public class SimuladorService {
    /**
     * Método principal que ejecuta toda la secuencia de combate.
     */
    public int calcularHeridasFinales(AtaqueRequest req) {
        int impactos = 0;
        int heridasEfectivas = 0;
        int heridasTrasSalvacion = 0;
        int dañoFinal = 0;

        // --- 1º TIRADA: IMPACTAR ---
        for (int i = 0; i < req.getNumAtaques(); i++) {
            int resultado = tirarD6(req.getRepeticionImpacto(), req.getImpactoX());
            
            // Verificamos si impacta (o si impacta siempre con valor 1)
            if (resultado >= req.getImpactoX() || req.getImpactoX() <= 1) {
                impactos++;
                
                // Reglas especiales de los 6s al impactar
                if (resultado == 6) {
                    if ("EXTRA_HIT".equals(req.getEspecialSeisImpacto())) {
                        impactos++; // Genera un impacto adicional
                    } else if ("AUTO_WOUND".equals(req.getEspecialSeisImpacto())) {
                        impactos--; // Lo quitamos de impactos normales...
                        heridasEfectivas++; // ...y lo pasamos directo a herida (salta paso 2)
                    }
                }
            }
        }

        // --- 2º TIRADA: HERIR ---
        for (int i = 0; i < impactos; i++) {
            int resultado = tirarD6(req.getRepeticionHerir(), req.getHerirX());
            
            // Si saca un 6 Y la opción está marcada en la web
            if (resultado == 6 && req.isSeisHeridaInsalvable()) {
                heridasTrasSalvacion++; // Salta directo al pool de daño (ignora armadura)
            } 
            // Si saca un éxito normal (o un 6 pero la opción está desactivada)
            else if (resultado >= req.getHerirX()) {
                heridasEfectivas++; // Estas pasan por la fase de salvación de armadura
            }
        }

        // --- 3º TIRADA: SALVACIÓN POR ARMADURA ---
        for (int i = 0; i < heridasEfectivas; i++) {
            int dado = ThreadLocalRandom.current().nextInt(1, 7);
            // Si el dado es MENOR que la salvación, no se salva y la herida pasa
            if (dado < req.getSalvacionX()) {
                heridasTrasSalvacion++;
            }
        }

        // --- 4º TIRADA: NO HAY DOLOR (FNP) Y CÁLCULO DE DAÑO ---
        // El daño se aplica por cada herida que no se salvó
        for (int i = 0; i < heridasTrasSalvacion; i++) {
            for (int d = 0; d < req.getDañoPorAtaque(); d++) {
                if (req.getNoHayDolorX() > 0) {
                    int dadoFnp = ThreadLocalRandom.current().nextInt(1, 7);
                    // Si falla el No Hay Dolor (saca menos que el valor X), recibe 1 punto de daño
                    if (dadoFnp < req.getNoHayDolorX()) {
                        dañoFinal++;
                    }
                } else {
                    dañoFinal++;
                }
            }
        }

        return dañoFinal;
    }

    /**
     * Simula la tirada de un dado considerando las repeticiones de fallos o de 1s.
     */
    private int tirarD6(String modoRepeticion, int umbral) {
        int dado = ThreadLocalRandom.current().nextInt(1, 7);
        
        // Lógica de repetición
        if ("ONES".equals(modoRepeticion) && dado == 1) {
            dado = ThreadLocalRandom.current().nextInt(1, 7);
        } else if ("ALL".equals(modoRepeticion) && dado < umbral) {
            dado = ThreadLocalRandom.current().nextInt(1, 7);
        }
        
        return dado;
    }

}
