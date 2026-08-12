package pe.motoaventura.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.motoaventura.api.product.Product;
import pe.motoaventura.api.product.ProductRepository;
import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class ProductSeed {
    @Bean CommandLineRunner createInitialProducts(ProductRepository products) {
        return args -> {
            add(products, product("Casaca LS2 Narvik", "Indumentaria", "Casaca para motociclista con protecciones y diseno para rutas urbanas.", "449.90", true, true, "PRODUCTOS/CASACA_LS2_NARVIK/CASACA-LS2-PARA-HOMBRE-NARVIK-AZULNEGROGRISROJO.jpeg.webp", "PRODUCTOS/CASACA_LS2_NARVIK/CASACA-LS2-PARA-HOMBRE-NARVIK-AZULNEGROGRISROJO-1.jpeg.webp"));
            add(products, product("Pantalon LS2 Douglas", "Indumentaria", "Pantalon para motociclista con proteccion y comodidad para viajes.", "329.90", true, false, "PRODUCTOS/PANTALON_LS2_DOUGLAS/PANTALON-DOUGLAS.png.webp", "PRODUCTOS/PANTALON_LS2_DOUGLAS/PANTALON-DOUGLAS-B.png.webp"));
            add(products, product("Traje LS2 para lluvia Aqua Negro", "Indumentaria", "Traje impermeable para protegerse de la lluvia durante el recorrido.", "189.90", true, true, "PRODUCTOS/TRAJE_LS2_PARA_LLUVIA_AQUA_NEGRO/TRAJE-LS2-PARA-LLUVIA-AQUA-NEGRO-1.jpeg.webp", "PRODUCTOS/TRAJE_LS2_PARA_LLUVIA_AQUA_NEGRO/TRAJE-LS2-PARA-LLUVIA-AQUA-NEGRO-2.jpeg.webp", "PRODUCTOS/TRAJE_LS2_PARA_LLUVIA_AQUA_NEGRO/TRAJE-LS2-PARA-LLUVIA-AQUA-NEGRO-3.jpeg.webp", "PRODUCTOS/TRAJE_LS2_PARA_LLUVIA_AQUA_NEGRO/TRAJE-LS2-PARA-LLUVIA-AQUA-NEGRO-4.jpeg.webp"));
            add(products, product("Botas LS2 WP Garra", "Protecciones", "Botas resistentes al agua para proteger los pies durante la ruta.", "399.90", true, false, "PRODUCTOS/BOTAS_LS2_WP/BOTA-HOMBRE-GARRA-WP-1.jpeg", "PRODUCTOS/BOTAS_LS2_WP/BOTA-HOMBRE-GARRA-WP-NEGROROJO-2.jpeg", "PRODUCTOS/BOTAS_LS2_WP/BOTA-HOMBRE-GARRA-WP-NEGROROJO-3.jpeg", "PRODUCTOS/BOTAS_LS2_WP/BOTA-HOMBRE-GARRA-WP-NEGROROJO-4.jpeg"));
            add(products, product("Guantes LS2 Snow", "Guantes", "Guantes para motociclista con proteccion y abrigo para dias frios.", "159.90", true, true, "PRODUCTOS/GUANTES_LS2_SNOW/GUANTE-SNOW-NEGRO-1.png", "PRODUCTOS/GUANTES_LS2_SNOW/GUANTE-SNOW-NEGRO-2.png", "PRODUCTOS/GUANTES_LS2_SNOW/GUIA-DE-TALLA-DE-GUANTE-3.jpeg"));
            add(products, product("Guantes LS2 ThermoRain", "Guantes", "Guantes impermeables para lluvia con buena visibilidad.", "179.90", true, false, "PRODUCTOS/GUANTES_LS2_THERMORAIN/GUANTE-LS2-THERMORAIN-NEGROAMARILLOFLUO-1.jpeg", "PRODUCTOS/GUANTES_LS2_THERMORAIN/GUANTE-LS2-THERMORAIN-NEGROAMARILLOFLUO-2.jpeg", "PRODUCTOS/GUANTES_LS2_THERMORAIN/GUIA-DE-TALLA-DE-GUANTE-3.jpeg"));
            add(products, product("Rodillera Scoyco SRK12", "Protecciones", "Rodillera para reforzar la proteccion durante el recorrido.", "119.90", false, false, "PRODUCTOS/RODILLERA_SCOYCO/SRK12-N.jpg.webp"));
            add(products, product("Rodillera XKudo R39C39", "Protecciones", "Rodillera ajustable para uso en ciudad y carretera.", "139.90", false, true, "PRODUCTOS/RODILLERA_XKUDO/R39C39-1.jpeg", "PRODUCTOS/RODILLERA_XKUDO/R39C39-2.jpeg", "PRODUCTOS/RODILLERA_XKUDO/R39C39-3jpeg.webp"));
            add(products, product("Alforja 65 litros", "Equipaje", "Alforja amplia para transportar equipaje durante los viajes en motocicleta.", "249.90", true, false, "PRODUCTOS/ALFORJA_65LITROS/ALFORJA65-1.jpg", "PRODUCTOS/ALFORJA_65LITROS/ALFORJA65-2.jpg", "PRODUCTOS/ALFORJA_65LITROS/ALFORJA65-3.jpg"));
            add(products, product("Cajuela 45 litros", "Equipaje", "Cajuela trasera de 45 litros para transportar objetos con seguridad.", "299.90", true, false, "PRODUCTOS/CAJUELA_45LITROS/cajuela-1.jpg", "PRODUCTOS/CAJUELA_45LITROS/cajuela-2.jpg", "PRODUCTOS/CAJUELA_45LITROS/cajuela-3.jpg", "PRODUCTOS/CAJUELA_45LITROS/cajuela-4.jpg"));
            add(products, product("Cajuela 65 litros", "Equipaje", "Cajuela de gran capacidad para viajes largos en motocicleta.", "399.90", true, false, "PRODUCTOS/CAJUELA_65LITROS/cajuela65-1.jpg", "PRODUCTOS/CAJUELA_65LITROS/cajuela65-2.jpg", "PRODUCTOS/CAJUELA_65LITROS/cajuela65-3.jpg", "PRODUCTOS/CAJUELA_65LITROS/cajuela65-4.jpg"));
            add(products, product("Bolso impermeable", "Equipaje", "Bolso impermeable para proteger las pertenencias durante la ruta.", "129.90", true, true, "PRODUCTOS/BOLSO_IMPERMEABLE/bolso-impermeable-1.jpg", "PRODUCTOS/BOLSO_IMPERMEABLE/bolso-impermeable-2.jpg", "PRODUCTOS/BOLSO_IMPERMEABLE/bolso-impermeable-3.jpg", "PRODUCTOS/BOLSO_IMPERMEABLE/bolso-impermeable-4.jpg"));
            add(products, product("Tank bag", "Equipaje", "Bolso para tanque que facilita el acceso a objetos pequenos durante el viaje.", "119.90", true, false, "PRODUCTOS/TANK_BANK/tank-bank-1.jpg", "PRODUCTOS/TANK_BANK/tank-bank-2.jpg", "PRODUCTOS/TANK_BANK/tank-bank-3.jpg", "PRODUCTOS/TANK_BANK/tank-bank-4.jpg"));
            add(products, product("Bolso impermeable para moto", "Accesorios", "Bolso impermeable pensado para llevar objetos pequenos en la motocicleta.", "129.90", false, true, "PRODUCTOS/BOLSO_IMPERMEABLE/bolso-impermeable-1.jpg", "PRODUCTOS/BOLSO_IMPERMEABLE/bolso-impermeable-2.jpg", "PRODUCTOS/BOLSO_IMPERMEABLE/bolso-impermeable-3.jpg", "PRODUCTOS/BOLSO_IMPERMEABLE/bolso-impermeable-4.jpg"));
            add(products, product("Porta celular", "Accesorios", "Soporte para celular disenado para facilitar la navegacion durante el recorrido.", "89.90", true, false, "PRODUCTOS/PORTA_CELULAR/porta-celular-1.jpg", "PRODUCTOS/PORTA_CELULAR/porta-celular-2.jpg", "PRODUCTOS/PORTA_CELULAR/porta-celular-3.jpg"));
        };
    }
    private void add(ProductRepository products, Product product) {
        Product current = products.findByNameIgnoreCase(product.getName()).orElse(null);
        if (current == null) products.save(product);
        else { current.setCategory(product.getCategory()); current.setDescription(product.getDescription()); current.setPrice(product.getPrice()); current.setStock(10); current.setFeatured(product.isFeatured()); current.setOnSale(product.isOnSale()); current.setImageUrl(product.getImageUrl()); current.setImageUrls(product.getImageUrls()); products.save(current); }
    }
    private Product product(String name,String category,String description,String price,boolean featured,boolean onSale,String... images){Product p=new Product();p.setName(name);p.setCategory(category);p.setDescription(description);p.setPrice(new BigDecimal(price));p.setStock(10);p.setFeatured(featured);p.setOnSale(onSale);p.setImageUrl(images[0]);p.setImageUrls(Arrays.asList(images));return p;}
}
