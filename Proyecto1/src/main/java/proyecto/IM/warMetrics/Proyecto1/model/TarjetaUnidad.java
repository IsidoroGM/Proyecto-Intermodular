package proyecto.IM.warMetrics.Proyecto1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tarjetas_unidad")
public class TarjetaUnidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre; 

    @Column(length = 500)
    private String notas; 

    // --- ESTADÍSTICAS DEL SIMULADOR ---
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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; 

    // Constructor vacío (obligatorio en JPA)
    public TarjetaUnidad() {}

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}