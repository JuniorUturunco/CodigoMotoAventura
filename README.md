# MotoAventura

Prototipo funcional de una tienda virtual de indumentaria y accesorios para motociclistas. Incluye catálogo, galería de productos, carrito, registro de pedidos, panel administrador protegido y probador virtual preparado para Replicate.

## Requisitos

- Java JDK 17.
- Maven 3.9 o superior.
- PostgreSQL.
- Python 3 para servir el frontend.

## Base de datos

Crear una base de datos llamada `motoaventura` en PostgreSQL. La configuración predeterminada utiliza:

```text
Usuario: postgres
Contraseña: admin123
Puerto: 5432
```

Si los datos son diferentes, configurar `DATABASE_USER`, `DATABASE_PASSWORD` y `DATABASE_URL`.

## Iniciar el backend

Desde la carpeta `backend`:

```powershell
mvn package -DskipTests
java -Djava.net.preferIPv4Stack=true -jar target\motoaventura-api-0.0.1-SNAPSHOT.jar
```

El backend queda disponible en `http://localhost:8080`.

## Iniciar el frontend

Desde la carpeta principal del proyecto:

```powershell
py -m http.server 5500
```

Abrir `http://localhost:5500/web/`.

## Probador virtual

Para activar Replicate, configurar el token antes de iniciar el backend:

```powershell
$env:REPLICATE_API_TOKEN="r8_TU_TOKEN"
$env:REPLICATE_MODEL="cuuupid/idm-vton"
```

Sin token, el prototipo conserva un modo demostración que permite validar la carga de imágenes y el flujo de prueba.

## Acceso administrador

```text
Correo: admin@motoaventura.pe
Contraseña: MotoAventura2026!
```

## Nota

El pago no está implementado porque el alcance corresponde a un prototipo académico. Los documentos Word y archivos auxiliares de la elaboración documental se mantienen fuera de este repositorio.
