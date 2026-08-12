package pe.motoaventura.api.user;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/profile") @CrossOrigin(origins={"http://localhost:5173","http://localhost:5500","http://127.0.0.1:5500"})
public class ProfileController {
 private final UserRepository users; public ProfileController(UserRepository users){this.users=users;}
 @GetMapping public User get(Authentication a){return users.findByEmail(a.getName()).orElseThrow();}
 @PutMapping public User update(@RequestBody ProfileRequest p,Authentication a){User u=users.findByEmail(a.getName()).orElseThrow();u.setFirstName(p.firstName());u.setLastName(p.lastName());u.setAddress(p.address());u.setDistrict(p.district());u.setPhone(p.phone());return users.save(u);}
 public record ProfileRequest(String firstName,String lastName,String address,String district,String phone){}
}
