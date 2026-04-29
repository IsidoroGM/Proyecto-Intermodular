
// Controlador para manejar las operaciones relacionadas con las tarjetas de unidad
// Aquí se reciben las solicitudes del frontend para guardar, obtener o eliminar tarjetas de unidad

package proyecto.IM.warMetrics.Proyecto1.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyecto.IM.warMetrics.Proyecto1.dto.TarjetaUnidadRequest;
import proyecto.IM.warMetrics.Proyecto1.model.TarjetaUnidad;
import proyecto.IM.warMetrics.Proyecto1.model.Usuario;
import proyecto.IM.warMetrics.Proyecto1.repository.TarjetaUnidadRepository;
import proyecto.IM.warMetrics.Proyecto1.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/tarjetas")
@CrossOrigin(origins = "*")
public class TarjetaUnidadController {

    private final TarjetaUnidadRepository tarjetaRepository;
    private final UsuarioRepository usuarioRepository;

    public TarjetaUnidadController(TarjetaUnidadRepository tarjetaRepository, UsuarioRepository usuarioRepository) {
        this.tarjetaRepository = tarjetaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // 1. Guardar una nueva tarjeta
    @PostMapping("/guardar")
    public ResponseEntity<?> guardarTarjeta(@RequestBody TarjetaUnidadRequest req) {
        Usuario usuario = usuarioRepository.findById(req.getUsuarioId()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        TarjetaUnidad tarjeta = new TarjetaUnidad();
        tarjeta.setUsuario(usuario);
        tarjeta.setNombre(req.getNombre());
        tarjeta.setNotas(req.getNotas());
        tarjeta.setNumAtaques(req.getNumAtaques());
        tarjeta.setImpactoX(req.getImpactoX());
        tarjeta.setRepeticionImpacto(req.getRepeticionImpacto());
        tarjeta.setEspecialSeisImpacto(req.getEspecialSeisImpacto());
        tarjeta.setHerirX(req.getHerirX());
        tarjeta.setRepeticionHerir(req.getRepeticionHerir());
        tarjeta.setSeisHeridaInsalvable(req.isSeisHeridaInsalvable());
        tarjeta.setSalvacionX(req.getSalvacionX());
        tarjeta.setDanoPorAtaque(req.getDanoPorAtaque());
        tarjeta.setNoHayDolorX(req.getNoHayDolorX());

        tarjetaRepository.save(tarjeta);
        return ResponseEntity.ok("Tarjeta guardada con éxito");
    }

    // 2. Obtener todas las tarjetas de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<TarjetaUnidad> obtenerTarjetasPorUsuario(@PathVariable Long usuarioId) {
        return tarjetaRepository.findByUsuarioId(usuarioId);
    }

    // 3. Borrar una tarjeta (Opcional pero muy útil para el futuro)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> borrarTarjeta(@PathVariable Long id) {
        tarjetaRepository.deleteById(id);
        return ResponseEntity.ok("Tarjeta eliminada");
    }

    // 4. Actualizar una tarjeta existente (Update)
    // El @PutMapping busca una tarjeta por su ID y actualiza todos sus campos
    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<?> actualizarTarjeta(@PathVariable Long id, @RequestBody TarjetaUnidadRequest req) {
        return tarjetaRepository.findById(id).map(tarjeta -> {
            // Actualizamos los valores del modelo con los que vienen en el Request
            tarjeta.setNombre(req.getNombre());
            tarjeta.setNotas(req.getNotas());
            tarjeta.setNumAtaques(req.getNumAtaques());
            tarjeta.setImpactoX(req.getImpactoX());
            tarjeta.setRepeticionImpacto(req.getRepeticionImpacto());
            tarjeta.setEspecialSeisImpacto(req.getEspecialSeisImpacto());
            tarjeta.setHerirX(req.getHerirX());
            tarjeta.setRepeticionHerir(req.getRepeticionHerir());
            tarjeta.setSeisHeridaInsalvable(req.isSeisHeridaInsalvable());
            tarjeta.setSalvacionX(req.getSalvacionX());
            tarjeta.setDanoPorAtaque(req.getDanoPorAtaque());
            tarjeta.setNoHayDolorX(req.getNoHayDolorX());
            
            tarjetaRepository.save(tarjeta); // Guardamos los cambios
            return ResponseEntity.ok("Tarjeta actualizada con éxito");
        }).orElse(ResponseEntity.badRequest().body("Error: No se encontró la tarjeta con ID: " + id));
    }
}