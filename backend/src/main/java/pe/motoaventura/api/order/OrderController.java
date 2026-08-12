package pe.motoaventura.api.order;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5500", "http://127.0.0.1:5500"})
public class OrderController {
    private final OrderRepository repository;
    public OrderController(OrderRepository repository){this.repository=repository;}
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Order create(@Valid @RequestBody Order order){ return repository.save(order); }
    @GetMapping public java.util.List<Order> all(){ return repository.findAll(); }
}
