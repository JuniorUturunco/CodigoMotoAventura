package pe.motoaventura.api.security;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pe.motoaventura.api.user.UserRepository;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
    @Bean UserDetailsService userDetailsService(UserRepository repo){return username->repo.findByEmail(username).map(u->User.withUsername(u.getEmail()).password(u.getPassword()).roles(u.getRole().name()).build()).orElseThrow(()->new UsernameNotFoundException("Usuario no encontrado"));}
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration config)throws Exception{return config.getAuthenticationManager();}
    @Bean SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter)throws Exception{return http.csrf(csrf->csrf.disable()).cors(cors->{}).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a->a.requestMatchers("/api/auth/**","/api/orders","/api/try-on","/error").permitAll().requestMatchers(HttpMethod.GET,"/api/products/**").permitAll().requestMatchers("/api/products/**").hasRole("ADMINISTRADOR").requestMatchers(HttpMethod.GET,"/api/orders/**").hasRole("ADMINISTRADOR").requestMatchers("/api/profile/**").authenticated().anyRequest().authenticated()).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();}
}
