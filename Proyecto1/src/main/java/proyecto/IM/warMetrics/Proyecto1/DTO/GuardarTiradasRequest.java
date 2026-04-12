package proyecto.IM.warMetrics.Proyecto1.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GuardarTiradasRequest {

    @NotNull private Long usuarioId;
    @NotBlank private String titulo;
    private String notas;
    private int aleatorio;
    private double media;

    // Getters y Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public int getAleatorio() { return aleatorio; }
    public void setAleatorio(int aleatorio) { this.aleatorio = aleatorio; }

    public double getMedia() { return media; }
    public void setMedia(double media) { this.media = media; }


}
