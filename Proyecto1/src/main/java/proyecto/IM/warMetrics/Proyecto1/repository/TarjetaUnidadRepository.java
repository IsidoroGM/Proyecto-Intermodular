package proyecto.IM.warMetrics.Proyecto1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import proyecto.IM.warMetrics.Proyecto1.model.TarjetaUnidad;

@Repository
public interface TarjetaUnidadRepository extends JpaRepository<TarjetaUnidad, Long> {
    
    // Busca todas las tarjetas asociadas al ID de un usuario
    List<TarjetaUnidad> findByUsuarioId(Long usuarioId);
}