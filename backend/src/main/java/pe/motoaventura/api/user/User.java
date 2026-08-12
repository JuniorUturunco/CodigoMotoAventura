package pe.motoaventura.api.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Email @NotBlank @Column(unique=true, nullable=false) private String email;
    @NotBlank private String password;
    @NotBlank private String firstName;
    private String lastName;
    private String address;
    private String district;
    private String phone;
    @Enumerated(EnumType.STRING) private Role role = Role.CLIENTE;
    public Long getId(){return id;} public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getPassword(){return password;} public void setPassword(String v){password=v;}
    public String getFirstName(){return firstName;} public void setFirstName(String v){firstName=v;}
    public String getLastName(){return lastName;} public void setLastName(String v){lastName=v;}
    public String getAddress(){return address;} public void setAddress(String v){address=v;}
    public String getDistrict(){return district;} public void setDistrict(String v){district=v;}
    public String getPhone(){return phone;} public void setPhone(String v){phone=v;}
    public Role getRole(){return role;} public void setRole(Role v){role=v;}
}
