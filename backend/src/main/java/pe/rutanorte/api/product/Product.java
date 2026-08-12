package pe.motoaventura.api.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank private String name;
    @NotBlank private String category;
    @NotBlank @Column(length = 1200) private String description;
    @DecimalMin("0.0") private BigDecimal price;
    private Integer stock;
    private boolean featured;
    private boolean onSale;
    private String imageUrl;
    private String videoUrl;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", length = 500)
    private List<String> imageUrls = new ArrayList<>();
    public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;}
    public String getCategory(){return category;} public void setCategory(String v){category=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal v){price=v;}
    public Integer getStock(){return stock;} public void setStock(Integer v){stock=v;}
    public boolean isFeatured(){return featured;} public void setFeatured(boolean v){featured=v;}
    public boolean isOnSale(){return onSale;} public void setOnSale(boolean v){onSale=v;}
    public String getImageUrl(){return imageUrl;} public void setImageUrl(String v){imageUrl=v;}
    public String getVideoUrl(){return videoUrl;} public void setVideoUrl(String v){videoUrl=v;}
    public List<String> getImageUrls(){return imageUrls;} public void setImageUrls(List<String> v){imageUrls=v == null ? new ArrayList<>() : v;}
}
