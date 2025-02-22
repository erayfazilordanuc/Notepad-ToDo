package notepad.Common.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class RequestService {

    private final String URL = "http://localhost:3001/game/start";

    public String sendGameStartEmitRequest(Long room, String[][] board) throws Exception {
        URL url = URI.create(URL).toURL();
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("accept", "application/json");
        connection.setDoOutput(true);

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("room", room);
        requestBody.put("board", board);

        OutputStream os = connection.getOutputStream();
        byte[] input = mapper.writeValueAsBytes(requestBody);
        os.write(input, 0, input.length);

        int responseCode = connection.getResponseCode();
        String responseMessage = connection.getResponseMessage();

        return "Response message : " + responseMessage + "\nResponse code : " + responseCode;
    }
}
