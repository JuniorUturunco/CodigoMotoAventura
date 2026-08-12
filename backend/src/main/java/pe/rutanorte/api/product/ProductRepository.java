package pe.motoaventura.api.product;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Product> findByNameIgnoreCase(String name);
    List<Product> findByCategoryIgnoreCaseAndStockGreaterThan(String category, Integer stock);
    List<Product> findByStockGreaterThan(Integer stock);
}
