package proyecto.IM.warMetrics.Proyecto1.dto;

public class ResultadoResponse {
    private int dañoAleatorio;
    private double dañoMedioEstadistico;

    // Constructores
    public ResultadoResponse(int dañoAleatorio, double dañoMedioEstadistico) {
        this.dañoAleatorio = dañoAleatorio;
        this.dañoMedioEstadistico = dañoMedioEstadistico;
    }

    // Getters y Setters
    public int getDañoAleatorio() { return dañoAleatorio; }
    public void setDañoAleatorio(int dañoAleatorio) { this.dañoAleatorio = dañoAleatorio; }

    public double getDañoMedioEstadistico() { return dañoMedioEstadistico; }
    public void setDañoMedioEstadistico(double dañoMedioEstadistico) { this.dañoMedioEstadistico = dañoMedioEstadistico; }

}
