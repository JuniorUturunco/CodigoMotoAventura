package pe.motoaventura.api.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private final String secret;
    public JwtService(@Value("${MOTOAVENTURA_JWT_SECRET:dev-secret-motoaventura-2026-change-this}") String secret){this.secret=secret;}
    public String generate(String email,String role){return Jwts.builder().subject(email).claim("role",role).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+86400000)).signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8))).compact();}
    public String email(String token){return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8))).build().parseSignedClaims(token).getPayload().getSubject();}
}
