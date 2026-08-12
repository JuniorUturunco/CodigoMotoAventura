package pe.motoaventura.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import pe.motoaventura.api.user.*;

@Configuration
public class AdminSeed {
    @Bean CommandLineRunner createAdmin(UserRepository users, PasswordEncoder encoder){return args->{
        if(users.findByEmail("admin@motoaventura.pe").isEmpty()){
            User admin=new User(); admin.setEmail("admin@motoaventura.pe"); admin.setPassword(encoder.encode("MotoAventura2026!")); admin.setFirstName("Administrador"); admin.setLastName("MotoAventura"); admin.setRole(Role.ADMINISTRADOR); users.save(admin);
        }
    };}
}
