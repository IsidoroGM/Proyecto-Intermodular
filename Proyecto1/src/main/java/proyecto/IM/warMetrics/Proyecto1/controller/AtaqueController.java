package proyecto.IM.warMetrics.Proyecto1.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyecto.IM.warMetrics.Proyecto1.DTO.AtaqueRequest;
import proyecto.IM.warMetrics.Proyecto1.Service.SimuladorService;


@RestController
@RequestMapping("/api/combate")
// Permitimos que una web externa o local pueda llamar a este controlador
@CrossOrigin(origins = "*")

public class AtaqueController {

    private final SimuladorService simuladorService;

    // Inyectamos el servicio mediante el constructor
    public AtaqueController(SimuladorService simuladorService) {
        this.simuladorService = simuladorService;
    }

    @PostMapping("/simular")
    public String simularAtaque(@RequestBody AtaqueRequest request) {
        // Llamamos al servicio para obtener el resultado
        int totalHeridas = simuladorService.calcularHeridasFinales(request);
        
        // Devolvemos el mensaje final al front-end
        return "El resultado de la secuencia de ataques es: " + totalHeridas + " heridas realizadas.";
    }

}
