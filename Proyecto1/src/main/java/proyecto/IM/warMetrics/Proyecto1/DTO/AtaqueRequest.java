package proyecto.IM.warMetrics.Proyecto1.dto;

/**
 * Esta clase es el molde que recibirá los datos desde el formulario web.
 */
public class AtaqueRequest {
    // Parámetros básicos
    private int numAtaques;
    private int dañoPorAtaque;
    
    // 1º Tirada: Impactar
    private int impactoX; 
    private String repeticionImpacto; // "NONE", "ONES", "ALL"
    private String especialSeisImpacto; // "EXTRA_HIT", "AUTO_WOUND", "NONE"
    
    // 2º Tirada: Herir
    private int herirX;
    private String repeticionHerir; // "NONE", "ONES", "ALL"
    private boolean seisHeridaInsalvable;
    
    // 3º y 4º Tirada: Salvaciones
    private int salvacionX;
    private int noHayDolorX;

    // Getters y Setters (Necesarios para que Spring Boot procese el JSON)
    public int getNumAtaques() { return numAtaques; }
    public void setNumAtaques(int numAtaques) { this.numAtaques = numAtaques; }

    public int getDañoPorAtaque() { return dañoPorAtaque; }
    public void setDañoPorAtaque(int dañoPorAtaque) { this.dañoPorAtaque = dañoPorAtaque; }

    public int getImpactoX() { return impactoX; }
    public void setImpactoX(int impactoX) { this.impactoX = impactoX; }

    public String getRepeticionImpacto() { return repeticionImpacto; }
    public void setRepeticionImpacto(String repeticionImpacto) { this.repeticionImpacto = repeticionImpacto; }

    public String getEspecialSeisImpacto() { return especialSeisImpacto; }
    public void setEspecialSeisImpacto(String especialSeisImpacto) { this.especialSeisImpacto = especialSeisImpacto; }

    public int getHerirX() { return herirX; }
    public void setHerirX(int herirX) { this.herirX = herirX; }

    public String getRepeticionHerir() { return repeticionHerir; }
    public void setRepeticionHerir(String repeticionHerir) { this.repeticionHerir = repeticionHerir; }

    public boolean isSeisHeridaInsalvable() { return seisHeridaInsalvable; }
    public void setSeisHeridaInsalvable(boolean seisHeridaInsalvable) { this.seisHeridaInsalvable = seisHeridaInsalvable; }

    public int getSalvacionX() { return salvacionX; }
    public void setSalvacionX(int salvacionX) { this.salvacionX = salvacionX; }

    public int getNoHayDolorX() { return noHayDolorX; }
    public void setNoHayDolorX(int noHayDolorX) { this.noHayDolorX = noHayDolorX; }

    
}