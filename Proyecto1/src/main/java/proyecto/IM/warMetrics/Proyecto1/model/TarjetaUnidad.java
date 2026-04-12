package proyecto.IM.warMetrics.Proyecto1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// --- ENTIDAD TARJETA UNIDAD ---
@Entity
@Table(name= "tarjetas_unidad")


// Esta clase representa una tarjeta de unidad que un usuario puede crear para guardar información sobre una unidad específica de Warhammer 40K.
public class TarjetaUnidad {

    // --- ATRIBUTOS ---
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre; // Ej: "Marines Espaciales"

    @Column(length = 500)
    private String notas; // Ej: "Usar con la estratagema X"

    // --- AQUÍ ESTÁ LA MAGIA DE LA RELACIÓN ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; // Le decimos que esta tarjeta pertenece a un Usuario concreto

    // Constructores
    public TarjetaUnidad() {}

    public TarjetaUnidad(String nombre, String notas, Usuario usuario) {
        this.nombre = nombre;
        this.notas = notas;
        this.usuario = usuario;
    }

    // Getters y Setters
    public Long getId() {
         return id; 
        }

    public void setId(Long id) {
         this.id = id; 
        }

    public String getNombre() {
         return nombre;
         }

    public void setNombre(String nombre) {
         this.nombre = nombre;
         }

    public String getNotas() { 
        return notas;
     }

    public void setNotas(String notas) {
         this.notas = notas;
         }

    public Usuario getUsuario() {
         return usuario; 
        }

    public void setUsuario(Usuario usuario) {
         this.usuario = usuario;
         }

}
