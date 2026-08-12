package pe.motoaventura.api.product;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5500", "http://127.0.0.1:5500"})
public class ProductController {
    private final ProductRepository repository;
    public ProductController(ProductRepository repository){this.repository=repository;}
    @GetMapping public List<Product> all(@RequestParam(required=false) String category){
        return category == null ? repository.findByStockGreaterThan(0) : repository.findByCategoryIgnoreCaseAndStockGreaterThan(category,0);
    }
    @GetMapping("/{id}") public Product one(@PathVariable Long id){return repository.findById(id).orElseThrow();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Product create(@Valid @RequestBody Product product){return repository.save(product);}
    @PutMapping("/{id}") public Product update(@PathVariable Long id,@Valid @RequestBody Product input){
        Product p=repository.findById(id).orElseThrow(); p.setName(input.getName()); p.setCategory(input.getCategory()); p.setDescription(input.getDescription()); p.setPrice(input.getPrice()); p.setStock(input.getStock()); p.setFeatured(input.isFeatured()); p.setOnSale(input.isOnSale()); p.setImageUrl(input.getImageUrl()); p.setImageUrls(input.getImageUrls()); p.setVideoUrl(input.getVideoUrl()); return repository.save(p);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){repository.deleteById(id);}
}
