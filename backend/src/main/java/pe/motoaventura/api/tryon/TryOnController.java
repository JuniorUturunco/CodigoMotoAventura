package pe.motoaventura.api.tryon;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/try-on")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5500", "http://127.0.0.1:5500"})
public class TryOnController {
    private static final String IDM_VTON_VERSION = "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";
    private final String replicateToken;
    private final String replicateModel;
    private final String garmentUrl;
    private final ObjectMapper mapper = new ObjectMapper();

    public TryOnController(@Value("${motoaventura.replicate-token:}") String replicateToken,
                           @Value("${motoaventura.replicate-model:cuuupid/idm-vton}") String replicateModel,
                           @Value("${motoaventura.garment-url:}") String garmentUrl) {
        this.replicateToken = replicateToken;
        this.replicateModel = replicateModel;
        this.garmentUrl = garmentUrl;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> generatePreview(
            @RequestPart("photo") MultipartFile photo,
            @RequestPart(value = "garment", required = false) MultipartFile garment,
            @RequestParam(required = false) Long productId,
            @RequestParam(defaultValue = "person") String mode,
            @RequestParam(defaultValue = "upper_body") String garmentCategory) {
        System.out.println("Solicitud recibida en /api/try-on | modo=" + mode + " | producto=" + productId + " | tienePrenda=" + (garment != null));
        if (photo.isEmpty()) throw new IllegalArgumentException("La fotografía está vacía");
        if (photo.getSize() > 10 * 1024 * 1024) throw new IllegalArgumentException("La fotografía supera el límite de 10 MB");
        boolean configured = replicateToken != null && !replicateToken.isBlank();
        if (configured && garment != null && !garment.isEmpty()) {
            try {
                String mime = photo.getContentType() == null ? "image/jpeg" : photo.getContentType();
                String dataUrl = "data:" + mime + ";base64," + Base64.getEncoder().encodeToString(photo.getBytes());
                String garmentMime = garment.getContentType() == null ? "image/jpeg" : garment.getContentType();
                String garmentDataUrl = "data:" + garmentMime + ";base64," + Base64.getEncoder().encodeToString(garment.getBytes());
                String body = mapper.createObjectNode()
                        .put("version", IDM_VTON_VERSION)
                        .set("input", mapper.createObjectNode()
                                .put("human_img", dataUrl)
                                .put("garm_img", garmentDataUrl)
                                .put("garment_des", "Indumentaria para motociclista")
                                .put("category", garmentCategory)
                                .put("crop", true))
                        .toString();
                HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.replicate.com/v1/predictions"))
                        .header("Authorization", "Bearer " + replicateToken)
                        .header("Content-Type", "application/json")
                        .header("Prefer", "wait=60")
                        .POST(HttpRequest.BodyPublishers.ofString(body)).build();
                HttpResponse<String> apiResponse = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
                JsonNode response = mapper.readTree(apiResponse.body());
                if (apiResponse.statusCode() >= 400) {
                    System.err.println("Replicate rechazo la solicitud. HTTP " + apiResponse.statusCode() + ": " + apiResponse.body());
                    return Map.of("status", "ERROR", "message", "Replicate rechazÃ³ la solicitud. Revisa el modelo y las imÃ¡genes enviadas.");
                }
                String predictionUrl = response.path("urls").path("get").asText("");
                for (int attempt = 0; attempt < 12 && (response.path("output").isMissingNode() || response.path("output").isNull()); attempt++) {
                    if (predictionUrl.isBlank() || "succeeded".equals(response.path("status").asText()) || "failed".equals(response.path("status").asText())) break;
                    Thread.sleep(5000);
                    HttpRequest poll = HttpRequest.newBuilder(URI.create(predictionUrl)).header("Authorization", "Bearer " + replicateToken).GET().build();
                    response = mapper.readTree(HttpClient.newHttpClient().send(poll, HttpResponse.BodyHandlers.ofString()).body());
                }
                String finalStatus = response.path("status").asText("unknown");
                System.out.println("Replicate estado final: " + finalStatus);
                if (!"succeeded".equals(finalStatus)) {
                    String detail = response.path("error").asText("La predicciÃ³n no generÃ³ una imagen.");
                    return Map.of("status", finalStatus, "message", "Replicate no pudo generar la imagen: " + detail);
                }
                JsonNode output = response.get("output");
                return Map.of("status", response.path("status").asText("processing"), "output", output == null ? "" : output.toString(), "message", "La vista previa fue generada por Replicate.");
            } catch (Exception error) {
                System.err.println("No se pudo completar la solicitud a Replicate: " + error.getMessage());
                // Si el servicio no responde, se informa al usuario sin exponer el token.
            }
        }
        return Map.of(
                "status", configured ? "READY_FOR_REPLICATE" : "DEMO",
                "productId", productId == null ? "" : productId,
                "mode", mode,
                "fileName", photo.getOriginalFilename() == null ? "foto" : photo.getOriginalFilename(),
                "message", configured ? "La imagen fue recibida y está lista para enviarse al servicio de IA." : "La imagen fue recibida. El modo demostración está activo hasta configurar Replicate API."
        );
    }
}
