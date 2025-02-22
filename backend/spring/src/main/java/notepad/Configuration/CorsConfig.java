package notepad.Configuration;

import java.util.List;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

public class CorsConfig implements CorsConfigurationSource {

    private final List<String> allowedOrigins = List.of(
            "http://localhost:[*]",
            "http://10.0.2.2:[*]"
    );

    private final List<String> allowedMethods = List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
    );

    private final List<String> allowedHeaders = List.of("*");

    @SuppressWarnings("null")
    @Override
    public org.springframework.web.cors.CorsConfiguration getCorsConfiguration(
            HttpServletRequest request
    ) {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowCredentials(true);
        cors.setAllowedOriginPatterns(allowedOrigins);
        cors.setAllowedMethods(allowedMethods);
        cors.setAllowedHeaders(allowedHeaders);

        return cors;
    }
}
