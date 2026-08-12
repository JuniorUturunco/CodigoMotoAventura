package pe.motoaventura.api.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pe.motoaventura.api.user.*;

@RestController @RequestMapping("/api/auth") @CrossOrigin(origins={"http://localhost:5173","http://localhost:5500","http://127.0.0.1:5500"})
public class AuthController {
    private final UserRepository users; private final PasswordEncoder encoder; private final AuthenticationManager manager; private final JwtService jwt;
    public AuthController(UserRepository users,PasswordEncoder encoder,AuthenticationManager manager,JwtService jwt){this.users=users;this.encoder=encoder;this.manager=manager;this.jwt=jwt;}
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public Message register(@Valid @RequestBody RegisterRequest req){if(users.findByEmail(req.email()).isPresent()) throw new IllegalArgumentException("El correo ya está registrado"); User u=new User();u.setEmail(req.email());u.setPassword(encoder.encode(req.password()));u.setFirstName(req.firstName());u.setLastName(req.lastName());users.save(u);return new Message("Cuenta creada correctamente");}
    @PostMapping("/login") public Token login(@Valid @RequestBody LoginRequest req){Authentication auth=manager.authenticate(new UsernamePasswordAuthenticationToken(req.email(),req.password())); User u=users.findByEmail(req.email()).orElseThrow(); return new Token(jwt.generate(u.getEmail(),u.getRole().name()),u.getRole().name());}
    public record RegisterRequest(@Email @NotBlank String email,@NotBlank String password,@NotBlank String firstName,String lastName){}
    public record LoginRequest(@Email @NotBlank String email,@NotBlank String password){}
    public record Token(String token,String role){} public record Message(String message){}
}
