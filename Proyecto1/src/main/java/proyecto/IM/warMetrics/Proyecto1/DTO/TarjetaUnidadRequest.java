// DTO para recibir los datos de la tarjeta desde el frontend
// Este DTO se usará en el controlador para crear o actualizar tarjetas de unidad



package proyecto.IM.warMetrics.Proyecto1.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TarjetaUnidadRequest {
    @NotNull private Long usuarioId;
    @NotBlank private String nombre;
    private String notas;
    
    // Estadísticas
    private int numAtaques;
    private int impactoX;
    private String repeticionImpacto;
    private String especialSeisImpacto;
    private int herirX;
    private String repeticionHerir;
    private boolean seisHeridaInsalvable;
    private int salvacionX;
    private int danoPorAtaque;
    private int noHayDolorX;

    // --- GETTERS Y SETTERS ---
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public int getNumAtaques() { return numAtaques; }
    public void setNumAtaques(int numAtaques) { this.numAtaques = numAtaques; }
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
    public int getDanoPorAtaque() { return danoPorAtaque; }
    public void setDanoPorAtaque(int danoPorAtaque) { this.danoPorAtaque = danoPorAtaque; }
    public int getNoHayDolorX() { return noHayDolorX; }
    public void setNoHayDolorX(int noHayDolorX) { this.noHayDolorX = noHayDolorX; }
}