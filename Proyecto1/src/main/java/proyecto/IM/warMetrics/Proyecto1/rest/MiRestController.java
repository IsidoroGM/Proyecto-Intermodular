package proyecto.IM.warMetrics.Proyecto1.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;




@RestController

    public class MiRestController{

        @GetMapping("/")
        public String getMethodName() {
            return "Hola crack que pasa";
        }
        
    }
/* public class MiRestController {

   @GetMapping("/")
   public String getMethodName() {
       return "index";
   }
   
 */

