package pe.motoaventura.api.order;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    @Column(length = 500) private String shippingAddress;
    private String district;
    private String phone;
    private BigDecimal total;
    @Column(length = 4000) private String items;
    private LocalDateTime createdAt = LocalDateTime.now();
    public Long getId(){return id;} public String getFirstName(){return firstName;} public void setFirstName(String v){firstName=v;}
    public String getLastName(){return lastName;} public void setLastName(String v){lastName=v;}
    public String getShippingAddress(){return shippingAddress;} public void setShippingAddress(String v){shippingAddress=v;}
    public String getDistrict(){return district;} public void setDistrict(String v){district=v;}
    public String getPhone(){return phone;} public void setPhone(String v){phone=v;}
    public BigDecimal getTotal(){return total;} public void setTotal(BigDecimal v){total=v;}
    public String getItems(){return items;} public void setItems(String v){items=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
}
