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

import proyecto.IM.warMetrics.Proyecto1.Service.SimuladorService;
import proyecto.IM.warMetrics.Proyecto1.dto.GuardarTiradasRequest;
import proyecto.IM.warMetrics.Proyecto1.model.HistorialTirada;
import proyecto.IM.warMetrics.Proyecto1.repository.HistorialTiradaRepository;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "*")
public class HistorialController {

    private final SimuladorService simuladorService;
    private final HistorialTiradaRepository historialRepository;

    public HistorialController(SimuladorService simuladorService, HistorialTiradaRepository historialRepository) {
        this.simuladorService = simuladorService;
        this.historialRepository = historialRepository;
    }

    @PostMapping("/guardar")
    public ResponseEntity<String> guardar(@RequestBody GuardarTiradasRequest request) {
        try {
            simuladorService.guardarEnHistorial(request);
            return ResponseEntity.ok("Tirada guardada en el historial.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al guardar la tirada.");
        }
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<HistorialTirada>> obtenerHistorial(@PathVariable Long id) {
        List<HistorialTirada> historial = historialRepository.findByUsuarioIdOrderByFechaCreacionDesc(id);
        return ResponseEntity.ok(historial);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> borrarTirada(@PathVariable Long id) {
        try {
            if (!historialRepository.existsById(id)) {
                return ResponseEntity.status(404).body("No se encontró el archivo con ID: " + id);
            }

            historialRepository.deleteById(id);
            return ResponseEntity.ok("Archivo eliminado correctamente.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al intentar eliminar el archivo.");
        }
    }
}