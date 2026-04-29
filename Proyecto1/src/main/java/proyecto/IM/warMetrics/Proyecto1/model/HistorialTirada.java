package proyecto.IM.warMetrics.Proyecto1.model;

import java.time.LocalDateTime;

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
@Table(name = "historial_tiradas")

public class HistorialTirada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo; // Ej: "Ataque al Caos"
    
    @Column(length = 500)
    private String notas;

    // Guardamos los resultados
    private int danoAleatorio;
    private double danoMedioEstadistico;

    // Fecha en la que se hizo la tirada
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // --- OTRA VEZ LA RELACIÓN ---
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Constructores
    public HistorialTirada() {}

    public HistorialTirada(String titulo, String notas, int danoAleatorio, double danoMedioEstadistico, Usuario usuario) {
        this.titulo = titulo;
        this.notas = notas;
        this.danoAleatorio = danoAleatorio;
        this.danoMedioEstadistico = danoMedioEstadistico;
        this.usuario = usuario;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public int getDanoAleatorio() { return danoAleatorio; }
    public void setDanoAleatorio(int danoAleatorio) { this.danoAleatorio = danoAleatorio; }

    public double getDanoMedioEstadistico() { return danoMedioEstadistico; }
    public void setDanoMedioEstadistico(double danoMedioEstadistico) { this.danoMedioEstadistico = danoMedioEstadistico; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}


